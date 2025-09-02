<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;

class CartService
{
    private ?array $cachedCartItems = null;
    private const COOKIE_NAME = 'cartItems';
    protected const COOKIE_LIFETIME = 60 * 24 * 365;

    public function addItemToCart(Product $product, int $quantity = 1): void
    {

        $price = $product->price;

        if (Auth::check()) {
            // save to the database
            $this->saveItemToDatabase($product->id, $quantity, $price);
        } else {
            //save to the cookie
            $this->saveItemToCookies($product->id, $quantity, $price);
        }
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


                $productIds = collect($cartItems)->map(fn($item) => $item['product_id']);

                $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

                $cartItemData = [];
                foreach ($cartItems as $cartItem) {
                    $product = $products->get($cartItem['product_id']);

                    if (!$product) continue;

//                    $imageUrl = null;
//                    if (!$imageUrl) {
//                        $imageUrl = $product->getFirstMediaUrl('images', 'small') ;
//                    dump($imageUrl);
//                    }

                    $cartItemData[] = [
                        'id' => $cartItem['id'] ?? null ,
                        'product_id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'quantity' => $cartItem['quantity'],
                        'price' => $product->price,
//                        'image' => $imageUrl,
                    ];
                }
                $this->cachedCartItems = $cartItemData;
            }
            return $this->cachedCartItems;
        } catch (\Exception $e) {
            //throw $th;
            Log::error($e->getMessage() . PHP_EOL . $e->getTraceAsString());
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
            $cartItem = new Cart();
            $cartItem->user_id = $userId;
            $cartItem->product_id = $productId;
            $cartItem->quantity = $quantity;
        }
        $cartItem->save();
    }

    protected function saveItemToCookies(int $productId, int $quantity, int $price): void
    {
        $cartItems = $this->getCartItemsFromCookies();
        if (!isset($cartItems[$productId])) {
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
                $newItem = new Cart();
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
}
