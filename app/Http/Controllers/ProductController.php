<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

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

        $faker = fake();
        // Dummy Data
        $dummyProducts = [];
        for ($i = 0; $i < 19; $i++) {
            $dummyProducts[] = [
                'id' => $faker->unique()->randomNumber(5),
                'sku' => $faker->unique()->uuid(),
                'name' => $faker->words(3, true),
                'category' => $faker->unique()->slug(),
                'price' => $faker->randomFloat(2, 10, 1000),
                'weight' => $faker->numberBetween(100, 1000),
                'length' => $faker->numberBetween(2, 30),
                'width' => $faker->numberBetween(2, 30),
                'height' => $faker->numberBetween(5, 20),
                'is_active' => $faker->randomElement([true, false]),
            ];
        }

        return Inertia::render('admin/products', [
            'products' => Product::all()
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->user()->can('create products')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:products,username'],
            'email' => ['required', 'email', 'max:255', 'unique:products,email'],
            'password' => array_merge(
                ['string', 'max:255', 'confirmed'],
                App::environment('production')
                    ? [Password::min(8)->mixedCase()->numbers()->symbols()->uncompromised()]
                    : [Password::min(6)], // more relaxed rule in non-production
            ),
            'password_confirmation' => ['required_if:password,', 'same:password'],
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);

        Log::info($validated);
        if (!empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return redirect()->route('admin.products.index')->with('success', 'Role created successfully.');
    }

    public function update(Request $request, User $user)
    {
        if (!$request->user()->can('update products')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('products', 'username')->ignore($user)],
            'email' => ['required', 'email', 'max:255', Rule::unique('products', 'email')->ignore($user)],
            'password' => array_merge(
                ['nullable', 'string', 'max:255', 'confirmed'],
                App::environment('production')
                    ? [Password::min(8)->mixedCase()->numbers()->symbols()->uncompromised()]
                    : [Password::min(6)], // more relaxed rule in non-production
            ),
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id'],
        ]);

        if (!empty($validated['[password]'])) {
            $user->update([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password'])
            ]);
        } else {
            $user->update([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
            ]);
        }

        if (!empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return redirect()->route('admin.products.index')->with('success', 'User update successfully.');
    }

    public function destroy(Request $request, User $user)
    {
        // Check if user has permission to delete roles
        if (!$request->user()->can('delete products')) {
            abort(403, 'Unauthorized action.');
        }

        // Prevent deletion of system roles
        if (in_array($user->getRoleNames(), ['super-admin', 'admin'])) {
            return redirect()->route('admin.products.index')->with('error', 'Admin products cannot be deleted.');
        }

        $user->delete();

        return redirect()->route('admin.products.index')->with('success', 'User deleted successfully.');
    }
}
