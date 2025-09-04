<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PaginatedResourceResponse;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index(Request $request)
    {
        $categories = Category::latest()->paginate(15);

        return Inertia::render('admin/categories/index', [
            'categories' => PaginatedResourceResponse::make($categories, CategoryResource::class),
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'main_category' => ['required', 'string', 'max:255'],
            'subcategory1' => ['nullable', 'string', 'max:255'],
            'subcategory2' => ['nullable', 'string', 'max:255'],
        ]);

        $category = Category::create($validated);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'main_category' => ['required', 'string', 'max:255'],
            'subcategory1' => ['nullable', 'string', 'max:255'],
            'subcategory2' => ['nullable', 'string', 'max:255'],
        ]);

        $category->update($validated);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Request $request, Category $category)
    {
        // Check if category has associated products
        if ($category->products()->exists()) {
            return redirect()->route('admin.categories.index')->with('error', 'Cannot delete category with associated products.');
        }

        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}
