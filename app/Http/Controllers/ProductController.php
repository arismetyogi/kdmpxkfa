<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{

    /**
     * Display the products management page.
     */
    public function index(Request $request)
    {
        // Check if user has permission to view products
        if (!$request->user()->can('view products')) {
            abort(403, 'Unauthorized action.');
        }

        $products = Product::with('category');

        $paginatedProducts = $products->latest()->paginate(15);

        return Inertia::render('admin/products', [
            'products' => $paginatedProducts,
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->user()->can('create products')) {
            abort(403, 'Unauthorized action.');
        }

//        TODO! implement product CRUD with image upload
        $validated = $request->validate([
            'sku' => ['required', Rule::unique('products', 'sku')],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'max:255'],
            'pharmacology' => ['nullable', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'price' => ['required', 'numeric'],
            'weight' => ['required', 'numeric'],
            'length' => ['required', 'numeric'],
            'width' => ['required', 'numeric'],
            'height' => ['required', 'numeric'],
            'base_uom' => ['required', 'string', 'max:4'],
            'order_unit' => ['required', 'string', 'max:4'],
            'content' => ['required', 'number'],
            'brand' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'file', 'mimes:jpg,png,jpeg', 'max:1024'],
            'image_alt' => ['nullable', 'file', 'mimes:jpg,png,jpeg', 'max:1024'],
        ]);

        $slug = Str::slug($validated['name']);
        $productExistBySlug = Product::where('slug', $slug)->first();

        if ($productExistBySlug) {
            return back()->withErrors([
                'slug' => 'Product already exists with that name!',
            ]);
        }

        Log::debug('Validated data: ', $validated);

        $product = Product::create([
            'sku' => $validated['sku'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'],
            'pharmacology' => $validated['pharmacology'],
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'base_uom' => $validated['base_uom'],
            'order_unit' => $validated['order_unit'],
            'content' => $validated['content'],
            'brand' => $validated['brand'],
        ]);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function update(Request $request, User $product)
    {
        if (!$request->user()->can('update products')) {
            abort(403, 'Unauthorized action.');
        }

        return redirect()->route('admin.products.index')->with('success', 'User update successfully.');
    }

    public function destroy(Request $request, User $product)
    {
        // Check if user has permission to delete roles
        if (!$request->user()->can('delete products')) {
            abort(403, 'Unauthorized action.');
        }

        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Products deleted successfully.');
    }
}
