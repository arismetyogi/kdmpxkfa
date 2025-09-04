<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\CartService;
use App\Services\DigikopTransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
            ($billingData && $shippingData &&
                $billingData['first_name'] === $shippingData['first_name'] &&
                $billingData['last_name'] === $shippingData['last_name'] &&
                $billingData['email'] === $shippingData['email'] &&
                $billingData['phone'] === $shippingData['phone'] &&
                $billingData['address'] === $shippingData['address'] &&
                $billingData['city'] === $shippingData['city'] &&
                $billingData['state'] === $shippingData['state'] &&
                $billingData['zip'] === $shippingData['zip'] &&
                $billingData['country'] === $shippingData['country']);

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
        // Validate billing information
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
            // Shipping fields - make them required since we're copying from billing
            'shipping_first_name' => 'required|string|max:255',
            'shipping_last_name' => 'required|string|max:255',
            'shipping_email' => 'required|email|max:255',
            'shipping_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'shipping_city' => 'required|string|max:255',
            'shipping_state' => 'required|string|max:255',
            'shipping_zip' => 'required|string|max:20',
            'shipping_country' => 'required|string|max:255',
        ]);

        // Store billing/shipping info in session for payment page
        session([
            'checkout.billing' => [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip' => $validated['zip'],
                'country' => $validated['country'],
                'notes' => $validated['notes'] ?? '',
            ],
            'checkout.shipping' => [
                'first_name' => $validated['shipping_first_name'],
                'last_name' => $validated['shipping_last_name'],
                'email' => $validated['shipping_email'],
                'phone' => $validated['shipping_phone'],
                'address' => $validated['shipping_address'],
                'city' => $validated['shipping_city'],
                'state' => $validated['shipping_state'],
                'zip' => $validated['shipping_zip'],
                'country' => $validated['shipping_country'],
            ],
        ]);

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

    public function processPayment(Request $request, CartService $cartService, DigikopTransactionService $transactionService)
    {
        // Check if billing information exists in session
        if (! session('checkout.billing')) {
            return redirect()->route('checkout')->with('error', 'Please complete billing information first.');
        }

        $request->validate([
            'payment_method' => 'required|string|in:va,cad',
        ]);

        try {
            // Validate credit limit before processing payment
            $user = auth()->user();
            $totalAmount = $cartService->getTotalPrice();

            // Validate credit limit using tenant_id
            $creditValidation = $transactionService->validateCreditLimit($user->tenant_id, $totalAmount);

            if (!$creditValidation['valid']) {
                return back()->with('error', $creditValidation['message']);
            }

            DB::beginTransaction();

            $billingData = session('checkout.billing');
            $shippingData = session('checkout.shipping');
            $cartItems = $cartService->getCartItems();

            if (empty($cartItems)) {
                return redirect()->route('carts.index')->with('error', 'Your cart is empty.');
            }

            // Create the order
            $order = Order::create([
                'transaction_number' => Order::generateTransactionNumber(),
                'user_id' => auth()->id(),
                'tenant_id' => auth()->user()->tenant_id,
                'source_of_fund' => 'pinjaman',
                'account_no' => '', // This would need to be set based on your business logic
                'account_bank' => '', // This would need to be set based on your business logic
                'payment_type' => 'cad',
                'payment_method' => $request->payment_method,
                'va_number' => '', // This would need to be set based on your business logic
                'status' => 'pending',
                'subtotal' => $cartService->getSubTotal(),
                'tax_amount' => $cartService->getSubTotal() * 0.11, // You can calculate tax based on your business logic
                'shipping_amount' => 0, // You can calculate shipping based on your business logic
                'discount_amount' => 0,
                'total_price' => $cartService->getSubTotal() * 1.11,
                'billing_name' => $billingData['first_name'] . ' ' . $billingData['last_name'],
                'billing_email' => $billingData['email'],
                'billing_phone' => $billingData['phone'],
                'billing_address' => $billingData['address'],
                'billing_city' => $billingData['city'],
                'billing_state' => $billingData['state'],
                'billing_zip' => $billingData['zip'],
                'shipping_name' => $shippingData['first_name'] . ' ' . $shippingData['last_name'],
                'shipping_address' => $shippingData['address'],
                'shipping_city' => $shippingData['city'],
                'shipping_state' => $shippingData['state'],
                'shipping_zip' => $shippingData['zip'],
                'customer_notes' => $billingData['notes'] ?? null,
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                $product = Product::find($cartItem['product_id']);

                if (! $product) {
                    continue;
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'product_description' => $product->description,
                    'product_image' => $cartItem['image'],
                    'unit_price' => $cartItem['price'],
                    'total_price' => $cartItem['price'] * $cartItem['quantity'],
                    'quantity' => $cartItem['quantity'],
                ]);
            }

            // Clear the cart
            $cartService->clearCart();

            // Clear session data
            session()->forget(['checkout.billing', 'checkout.shipping']);

            DB::commit();

            // Redirect to order confirmation page
            return redirect()->route('order.complete', $order->id)->with('success', 'Order placed successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Order creation failed: '.$e->getMessage());

            return back()->with('error', 'Failed to create order. Please try again.');
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Order creation failed: '.$e->getMessage());

            return back()->with('error', 'Failed to create order. Please try again.');
        }
    }

    public function orderComplete(Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('ecommerce/order-completed', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->transaction_number,
                'status' => $order->status,
                'payment_status' => $order->payment_method,
                'total_price' => $order->total_price,
                'billing_full_name' => $order->billing_name,
                'billing_email' => $order->billing_email,
                'billing_address' => $order->billing_address,
                'billing_city' => $order->billing_city,
                'billing_state' => $order->billing_state,
                'billing_zip' => $order->billing_zip,
                'shipping_full_name' => $order->shipping_name,
                'shipping_address' => $order->shipping_address,
                'shipping_city' => $order->shipping_city,
                'shipping_state' => $order->shipping_state,
                'shipping_zip' => $order->shipping_zip,
                'created_at' => $order->created_at->format('M d, Y H:i'),
                'order_items' => $order->orderItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'product_image' => $item->product_image,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'variation_data' => $item->variation_data,
                    ];
                }),
            ],
        ]);
    }
}
