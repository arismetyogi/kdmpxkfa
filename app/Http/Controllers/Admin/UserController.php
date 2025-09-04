<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display the users management page.
     */
    public function index(Request $request)
    {
        // Check if user has permission to view users
        if (! $request->user()->can('view users')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('admin/users', [
            'users' => \App\Models\User::with('roles', 'permissions')->get(),
            'roles' => Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        if (! $request->user()->can('create users')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
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
            'password' => Hash::make($validated['password']),
        ]);

        Log::info($validated);
        if (! empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return redirect()->route('admin.users.index')->with('success', 'Role created successfully.');
    }

    public function update(Request $request, User $user)
    {
        if (! $request->user()->can('update users')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'password' => array_merge(
                ['nullable', 'string', 'max:255', 'confirmed'],
                App::environment('production')
                    ? [Password::min(8)->mixedCase()->numbers()->symbols()->uncompromised()]
                    : [Password::min(6)], // more relaxed rule in non-production
            ),
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id'],
        ]);

        if (! empty($validated['[password]'])) {
            $user->update([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
        } else {
            $user->update([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
            ]);
        }

        if (! empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return redirect()->route('admin.users.index')->with('success', 'User update successfully.');
    }

    public function destroy(Request $request, User $user)
    {
        // Check if user has permission to delete roles
        if (! $request->user()->can('delete users')) {
            abort(403, 'Unauthorized action.');
        }

        // Prevent deletion of system roles
        if (in_array($user->getRoleNames(), ['super-admin', 'admin'])) {
            return redirect()->route('admin.users.index')->with('error', 'Admin users cannot be deleted.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
