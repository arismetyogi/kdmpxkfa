<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Throwable;

class CartService
{
    private ?array $cachedCartItems = null;

    private const COOKIE_NAME = 'cartItems';

    protected const COOKIE_LIFETIME = 60 * 24 * 365;

    public function addItemToCart(Product $product, int $quantity = 1): void
    {

        // Price per order unit = base price * content
        $price = $product->price * $product->content;

        if (Auth::check()) {
            // save to the database
            $this->saveItemToDatabase($product->id, $quantity, $price);
        } else {
            // save to the cookie
            $this->saveItemToCookies($product->id, $quantity, $price);
        }
    }

    public function processCheckout(Request $request): array
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
        ]);

        // Store billing/shipping info in session for payment page
        return [
            'checkout.billing' => [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip' => $validated['zip'],
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
            ],
        ];
    }

    protected function updateItemQuantityToDatabase(int $productId, int $quantity): void
    {
        $userId = Auth::id();

        $cartItem = Cart::where('product_id', $productId)->where('user_id', $userId)
            ->first();

        if ($cartItem) {
            $cartItem->quantity = $quantity;
            $cartItem->save();
        }
    }

    protected function updateItemQuantityToCookies(int $productId, int $quantity): void
    {
        $cartItems = $this->getCartItemsFromCookies();
        $cartItems['quantity'] = $quantity;
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    protected function removeItemFromDatabase(int $productId): void
    {
        $userId = Auth::id();
        Cart::where('product_id', $productId)
            ->where('user_id', $userId)
            ->delete();
    }

    protected function removeItemFromCookies(int $productId): void
    {
        $cartItems = $this->getCartItemsFromCookies();
        $cartItemKey = $productId;
        if (isset($cartItems[$cartItemKey])) {
            unset($cartItems[$cartItemKey]);
        }
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    public function updateItemQuantity(int $productId, int $quantity): void
    {
        if (Auth::check()) {
            $this->updateItemQuantityToDatabase($productId, $quantity);
        } else {
            $this->updateItemQuantityToCookies($productId, $quantity);
        }
    }

    public function removeItemFromCart(int $productId): void
    {
        if (Auth::check()) {
            $this->removeItemFromDatabase($productId);
        } else {
            $this->removeItemFromCookies($productId);
        }
    }

    public function getCartItems(): array
    {
        try {
            if ($this->cachedCartItems === null) {
                if (Auth::check()) {
                    $cartItems = $this->getCartItemsFromDatabase();
                } else {
                    $cartItems = $this->getCartItemsFromCookies();
                }

                $productIds = collect($cartItems)->map(fn ($item) => $item['product_id']);

                $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

                $cartItemData = [];
                foreach ($cartItems as $cartItem) {
                    $product = $products->get($cartItem['product_id']);

                    if (! $product) {
                        continue;
                    }

                    $imageUrl = null;
                    if (! $imageUrl) {
                        $imageUrl = $product->getFirstMediaUrl('images');
                    }

                    $cartItemData[] = [
                        'id' => $cartItem['id'] ?? null,
                        'product_id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'quantity' => $cartItem['quantity'],
                        'price' => $product->price * $product->content, // Price per order unit
                        'base_price' => $product->price, // Price per base unit
                        'image' => $imageUrl,
                        'order_unit' => $product->order_unit,
                        'base_uom' => $product->base_uom,
                        'content' => $product->content,
                    ];
                }
                $this->cachedCartItems = $cartItemData;
            }

            return $this->cachedCartItems;
        } catch (\Exception $e) {
            // throw $th;
            Log::error($e->getMessage().PHP_EOL.$e->getTraceAsString());
        }

        return [];
    }

    protected function saveItemToDatabase(int $productId, int $quantity, int $price): void
    {
        $userId = Auth::id();

        $cartItem = Cart::where('product_id', $productId)
            ->where('user_id', $userId)
            ->first();

        if ($cartItem) {
            $cartItem->quantity = $cartItem->quantity + $quantity;
        } else {
            $cartItem = new Cart;
            $cartItem->user_id = $userId;
            $cartItem->product_id = $productId;
            $cartItem->quantity = $quantity;
        }
        $cartItem->save();
    }

    protected function saveItemToCookies(int $productId, int $quantity, int $price): void
    {
        $cartItems = $this->getCartItemsFromCookies();
        if (! isset($cartItems[$productId])) {
            $cartItems[$productId] = [
                'id' => uniqid(),
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
            ];
        } else {
            $cartItems[$productId]['quantity'] += $quantity;
        }

        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    public function getCartItemsFromDatabase(): array
    {
        $userId = Auth::id();

        return Cart::with('product')
            ->where('user_id', $userId)->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                ];
            })
            ->toArray();
    }

    public function getCartItemsFromCookies(): array
    {
        return json_decode(Cookie::get(self::COOKIE_NAME, '[]'), true);
    }

    public function clearCart(): void
    {
        if (Auth::check()) {
            Cart::where('user_id', Auth::id())->delete();
        } else {
            Cookie::queue(self::COOKIE_NAME, json_encode([]), self::COOKIE_LIFETIME);
        }
    }

    public function moveCartItemsToDatabase($userId): void
    {
        $cartItems = $this->getCartItemsFromCookies();
        if (empty($cartItems)) {
            return; // No items to move
        }
        foreach ($cartItems as $cartItem) {
            $existingItem = Cart::where('product_id', $cartItem['product_id'])->where('user_id', $cartItem['user_id'])->first();
            if ($existingItem) {
                $existingItem->quantity = $cartItem['quantity'];
                $existingItem->save();
            } else {
                $newItem = new Cart;
                $newItem->user_id = $userId;
                $newItem->product_id = $cartItem['product_id'];
                $newItem->quantity = $cartItem['quantity'];
                $newItem->price = $cartItem['price'];
                $newItem->save();
            }
        }
        Cookie::queue(self::COOKIE_NAME, '', -1);

        $this->cachedCartItems = null;
    }

    public function getTotalQuantity(): int
    {
        $totalQuantity = 0;
        foreach ($this->getCartItems() as $cartItem) {
            $totalQuantity += $cartItem['quantity'];
        }

        return $totalQuantity;
    }

    public function getSubTotal(): float
    {
        $totalPrice = 0;
        foreach ($this->getCartItems() as $cartItem) {
            $totalPrice += $cartItem['price'] * $cartItem['quantity'];
        }

        return $totalPrice;
    }

    public function getTotalPrice(): float
    {
        $totalPrice = 0;
        foreach ($this->getCartItems() as $cartItem) {
            $totalPrice += $cartItem['price'] * $cartItem['quantity'];
        }

        return $totalPrice;
    }

    public function getCartCount(): int
    {
        $cartCount = 0;
        if (Auth::check()) {
            $cartCount = Cart::where('user_id', Auth::id())->count();
        } else {
            $cartCount = count($this->getCartItemsFromCookies());
        }

        return $cartCount;
    }

    /**
     * @throws Throwable
     */
    public function processPayment(Request $request, DigikopTransactionService $transactionService): array
    {
        // Check if billing information exists in session
        if (! Session::get('checkout.billing')) {
            return [
                'success' => false,
                'redirect' => 'checkout',
                'message' => 'Please complete billing information first.',
            ];
        }

        $request->validate([
            'payment_method' => 'required|string|in:va,cad',
        ]);

        try {
            // Validate credit limit before processing payment
            $user = auth()->user();
            $totalAmount = $this->getTotalPrice();

            // Validate credit limit using tenant_id
            $creditValidation = $transactionService->validateCreditLimit($user->tenant_id, $totalAmount);

            if (! $creditValidation['valid']) {
                return [
                    'success' => false,
                    'back' => true,
                    'message' => $creditValidation['message'],
                ];
            }

            DB::beginTransaction();

            $billingData = Session::get('checkout.billing');
            $shippingData = Session::get('checkout.shipping');
            $cartItems = $this->getCartItems();

            if (empty($cartItems)) {
                return [
                    'success' => false,
                    'redirect' => 'carts.index',
                    'message' => 'Your cart is empty.',
                ];
            }

            // Create the order
            $order = Order::create([
                'transaction_number' => Order::generateTransactionNumber(),
                'user_id' => auth()->id(),
                'tenant_id' => auth()->user()->tenant_id,
                'source_of_fund' => 'pinjaman',
                'account_no' => '', // This would need to be set based on your business logic
                'account_bank' => '', // This would need to be set based on your business logic
                'payment_type' => 'cad', // todo! no other payment available currently, subjects to change
                'payment_method' => $request->payment_method,
                'va_number' => '', // This would need to be set based on your business logic
                'subtotal' => $this->getSubTotal(),
                'tax_amount' => $this->getSubTotal() * 0.11, // You can calculate tax based on your business logic
                'shipping_amount' => 0, // You can calculate shipping based on your business logic
                'discount_amount' => 0,
                'total_price' => $this->getSubTotal() * 1.11,
                'billing_name' => $billingData['first_name'].' '.$billingData['last_name'],
                'billing_email' => $billingData['email'],
                'billing_phone' => $billingData['phone'],
                'billing_address' => $billingData['address'],
                'billing_city' => $billingData['city'],
                'billing_state' => $billingData['state'],
                'billing_zip' => $billingData['zip'],
                'shipping_name' => $shippingData['first_name'].' '.$shippingData['last_name'],
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
                    'unit_price' => $cartItem['price'], // This is now the price per order unit
                    'total_price' => $cartItem['price'] * $cartItem['quantity'],
                    'quantity' => $cartItem['quantity'],
                    'base_quantity' => $cartItem['quantity'] * $product->content,
                    'order_unit' => $product->order_unit,
                    'base_uom' => $product->base_uom,
                    'content' => $product->content,
                ]);
            }

            // Clear the cart
            $this->clearCart();

            // Clear session data
            Session::forget(['checkout.billing', 'checkout.shipping']);

            DB::commit();

            // Return success response with order ID for redirect
            return [
                'success' => true,
                'redirect' => 'order.complete',
                'order_id' => $order->id,
                'message' => 'Order placed successfully!',
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Order creation failed with exception: '.$e->getMessage());

            return [
                'success' => false,
                'back' => true,
                'message' => 'Koperasi belum dimapping dengan Apotek KF, Silakan hubungi administrator.',
            ];
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Order creation failed with throwable: '.$e->getMessage());

            return [
                'success' => false,
                'back' => true,
                'message' => $e->getMessage(),
            ];
        }
    }
}
