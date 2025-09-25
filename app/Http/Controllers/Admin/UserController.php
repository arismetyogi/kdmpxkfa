<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaginatedResourceResponse;
use App\Http\Resources\UserResource;
use App\Models\Apotek;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

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

        $users = User::query()->whereDoesntHave('roles', function ($q) {
            $q->where('name', '!=', 'user');
        });

        $paginatedUsers = $users->latest()->paginate(15);

        return Inertia::render('admin/users', [
            'users' => PaginatedResourceResponse::make($paginatedUsers, UserResource::class),
            'allUsers' => User::all()->count(),
            'adminUsers' => User::admin()->get()->count(),
            'activeUsers' => User::active()->get()->count(),
            'apoteks' => Apotek::active()->get(),
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
            'apotek_id' => ['exists:apoteks,id'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'apotek_id' => $validated['apotek_id'],
        ]);

        //        Log::info(json_encode($validated));
        if (! empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        if (! $request->user()->can('update users')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'password' => array_merge(
                ['nullable', 'string', 'max:255', 'confirmed'],
                App::environment('production')
                    ? [Password::min(8)->mixedCase()->numbers()->symbols()->uncompromised()]
                    : [Password::min(6)], // more relaxed rule in non-production
            ),
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id'],
            'apotek_id' => ['exists:apoteks,id'],
        ]);

        if (! empty($validated['[password]'])) {
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'apotek_id' => $validated['apotek_id'],
            ]);
        } else {
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'apotek_id' => $validated['apotek_id'],
            ]);
        }

        if (! empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return back()->with('success', 'User updated successfully.');
    }

    public function mapUser(Request $request, User $user)
    {
        if (! $user) {
            Log::error('User not found during mapUser', [
                'userId' => null,
                'url' => $request->fullUrl(),
                'payload' => $request->all(),
            ]);

            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        //        Log::info('mapUser called successfully', [
        //            'userId' => $user->id,
        //            'url' => $request->fullUrl(),
        //        ]);

        if (! $request->user()->can('update users')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'apotek_id' => ['required', 'exists:apoteks,id'],
        ]);

        $user->update([
            'apotek_id' => $validated['apotek_id'],
            'is_active' => true,
        ]);

        return to_route('admin.users.index')->with('success', 'User updated successfully.');
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
