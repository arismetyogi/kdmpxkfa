<?php

namespace App\Http\Controllers;

use App\Http\Resources\PaginatedResourceResponse;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;

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

        $products = Product::query()
            ->with('category');

        $paginatedProducts = $products->latest()->paginate(15);

//        dd($paginatedProducts);
        return Inertia::render('admin/products', [
            'products' => PaginatedResourceResponse::make($paginatedProducts, ProductResource::class),
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->user()->can('create products')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'sku' => ['required', Rule::unique('products', 'sku')],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'pharmacology' => ['nullable', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'price' => ['required', 'numeric'],
            'weight' => ['required', 'numeric'],
            'length' => ['required', 'numeric'],
            'width' => ['required', 'numeric'],
            'height' => ['required', 'numeric'],
            'base_uom' => ['required', 'string', 'max:4'],
            'order_unit' => ['required', 'string', 'max:4'],
            'content' => ['required', 'numeric'],
            'brand' => ['required', 'string', 'max:255'],
            'dosage' => ['nullable', 'array'],
            'dosage.*' => ['string'],
            'is_active' => ['boolean'],
        ]);

        $slug = Str::slug($validated['name']);
        $productExistBySlug = Product::where('slug', $slug)->first();

        if ($productExistBySlug) {
            return back()->withErrors([
                'name' => 'Product already exists with that name!',
            ]);
        }

        Log::debug('Validated data: ', $validated);

        $product = Product::create([
            'sku' => $validated['sku'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'pharmacology' => $validated['pharmacology'] ?? null,
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'weight' => $validated['weight'],
            'length' => $validated['length'],
            'width' => $validated['width'],
            'height' => $validated['height'],
            'base_uom' => $validated['base_uom'],
            'order_unit' => $validated['order_unit'],
            'content' => $validated['content'],
            'brand' => $validated['brand'],
            'dosage' => $validated['dosage'] ?? [],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $product->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    /**
     * @throws FileDoesNotExist
     * @throws FileIsTooBig
     */
    public function update(Request $request, Product $product)
    {
        if (!$request->user()->can('update products')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'sku' => ['required', Rule::unique('products', 'sku')->ignore($product->id)],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'pharmacology' => ['nullable', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'price' => ['required', 'numeric'],
            'weight' => ['required', 'numeric'],
            'length' => ['required', 'numeric'],
            'width' => ['required', 'numeric'],
            'height' => ['required', 'numeric'],
            'base_uom' => ['required', 'string', 'max:4'],
            'order_unit' => ['required', 'string', 'max:4'],
            'content' => ['required', 'numeric'],
            'brand' => ['required', 'string', 'max:255'],
            'dosage' => ['nullable', 'array'],
            'dosage.*' => ['string'],
            'is_active' => ['boolean'],
        ]);

        $slug = Str::slug($validated['name']);
        $productExistBySlug = Product::where('slug', $slug)->where('name', '!=', $product->name )->first();

        if ($productExistBySlug) {
            return back()->withErrors([
                'name' => 'Another product already exists with that name!',
            ]);
        }

        $product->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'pharmacology' => $validated['pharmacology'] ?? null,
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'weight' => $validated['weight'],
            'length' => $validated['length'],
            'width' => $validated['width'],
            'height' => $validated['height'],
            'base_uom' => $validated['base_uom'],
            'order_unit' => $validated['order_unit'],
            'content' => $validated['content'],
            'brand' => $validated['brand'],
            'dosage' => $validated['dosage'] ?? [],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Remove existing images
            $product->clearMediaCollection('images');
            // Add new image
            $product->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Request $request, Product $product)
    {
        // Check if user has permission to delete roles
        if (!$request->user()->can('delete products')) {
            abort(403, 'Unauthorized action.');
        }

        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
