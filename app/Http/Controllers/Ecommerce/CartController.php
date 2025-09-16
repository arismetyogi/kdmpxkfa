<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Services\CartService;
use App\Services\DigikopTransactionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index(CartService $cartService)
    {
        return Inertia::render(
            'ecommerce/cart',
            [
                'cartItems' => $cartService->getCartItems(),
            ]
        );
    }

    public function store(Request $request, CartService $cartService)
    {
        //        dump('Product: ', $request->json()->get('productId'));
        $request->mergeIfMissing((['quantity' => 1]));

        $data = $request->validate([
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);
        $cartService->addItemToCart(Product::find($request['productId']), $data['quantity']);

        return back()->with('success', 'Item added to cart successfully.');
    }

    public function update(Request $request, CartService $cartService)
    {
        dump($request->all());
        $request->validate([
            'quantity' => ['integer', 'min:1'],
        ]);

        $quantity = $request->input('quantity');
        $cartService->updateItemQuantity($request['product'], $quantity);

        return back()->with('success', 'Item quantity updated successfully.');
    }

    public function destroy(Product $product, CartService $cartService)
    {
        $cartService->removeItemFromCart($product->id);

        return back()->with('success', 'Item removed from cart successfully.');
    }

    public function checkoutForm(CartService $cartService)
    {
        $cartItems = $cartService->getCartItems();
        if (empty($cartItems)) {
            return redirect()->route('carts.index')->with('error', 'Your cart is empty.');
        }

        // Get existing checkout data from session if available
        $billingData = session('checkout.billing', []);
        $shippingData = session('checkout.shipping', []);

        // Determine if shipping is same as billing
        $sameAsBilling = empty($shippingData) ||
            ($billingData &&
                $billingData['first_name'] === $shippingData['first_name'] &&
                $billingData['last_name'] === $shippingData['last_name'] &&
                $billingData['email'] === $shippingData['email'] &&
                $billingData['phone'] === $shippingData['phone'] &&
                $billingData['address'] === $shippingData['address'] &&
                $billingData['city'] === $shippingData['city'] &&
                $billingData['state'] === $shippingData['state'] &&
                $billingData['zip'] === $shippingData['zip']);

        return Inertia::render('ecommerce/checkout', [
            'cartItems' => $cartItems,
            'totalQuantity' => $cartService->getTotalQuantity(),
            'totalPrice' => $cartService->getTotalPrice(),
            'subtotal' => $cartService->getSubTotal(),
            'shipping' => 0,
            'tax' => 0,
            'billingData' => $billingData,
            'shippingData' => $shippingData,
            'sameAsBilling' => $sameAsBilling,
        ]);
    }

    public function processCheckout(Request $request, CartService $cartService)
    {
        // Process checkout through service
        $sessionData = $cartService->processCheckout($request);

        // Store billing/shipping info in session for payment page
        session($sessionData);

        // Redirect to payment page
        return redirect()->route('payment');
    }

    // Show payment form
    public function paymentForm(CartService $cartService)
    {
        // Check if billing information exists in session
        if (! session('checkout.billing')) {
            return redirect()->route('checkout')->with('error', 'Please complete billing information first.');
        }

        // check cart empty
        if ($cartService->getTotalQuantity() == 0) {
            return redirect()->route('carts.index')->with('error', 'Your cart is empty.');
        }

        return Inertia::render('ecommerce/payment', [
            'cartItems' => $cartService->getCartItems(),
            'totalPrice' => $cartService->getTotalPrice(),
            'totalQuantity' => $cartService->getTotalQuantity(),
            'subtotal' => $cartService->getSubTotal(),
            'shipping_amount' => 0,
            'tax' => 0,
            'billing' => session('checkout.billing'),
            'shipping' => session('checkout.shipping'),
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function processPayment(Request $request, CartService $cartService, DigikopTransactionService $transactionService)
    {
        $result = $cartService->processPayment($request, $transactionService);

        if (! $result['success']) {
            if (isset($result['back']) && $result['back']) {
                return back()->with('error', $result['message']);
            } elseif (isset($result['redirect'])) {
                return redirect()->route($result['redirect'])->with('error', $result['message']);
            }
        }

        // Redirect to order confirmation page
        return redirect()->route($result['redirect'], $result['order_id'])->with('success', $result['message']);
    }

    public function orderComplete(Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        // Load order items with product relationship
        $order->load('orderItems.product');

        return Inertia::render('ecommerce/order-completed', [
            'order' => (new OrderResource($order))->toArray(request()),
        ]);
    }
}
