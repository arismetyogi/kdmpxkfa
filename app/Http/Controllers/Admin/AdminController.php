<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaginatedResourceResponse;
use App\Http\Resources\UserResource;
use App\Models\Apotek;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        // Check if user has permission to view users
        if (! $request->user()->can('view users')) {
            abort(403, 'Unauthorized action.');
        }

        $admins = User::query()->whereHas('roles', function ($q) {
            $q->whereIn('name', RoleEnum::adminRoles());
        });

        $paginatedAdmins = $admins->latest()->paginate(15);

        return Inertia::render('admin/admins', [
            'admins' => PaginatedResourceResponse::make($paginatedAdmins, UserResource::class),
            'allAdmins' => $admins->count(),
            'adminAdmins' => $admins->get()->count(),
            'activeAdmins' => $admins->active()->get()->count(),
            'roles' => Role::where('name', '!=', 'user')->get(),
            'apoteks' => Apotek::active()->get(),
        ]);
    }

    /**
     * Display the admin dashboard.
     */
   public function dashboard(Request $request)
{
    $user = $request->user();

    // 🔹 cek role daripada permission
    if (! $user->hasAnyRole(['super-admin', 'admin-apotek', 'admin-busdev'])) {
        abort(403, 'Unauthorized action.');
    }

    $stats = [];

    if ($user->hasRole('super-admin')) {
        $stats = [
            'total_users' => User::count(),
            'total_roles' => Role::count(),
            'total_permissions' => Permission::count(),
        ];
    } elseif ($user->hasRole('admin-apotek')) {
        $stats = [
            'total_orders' => \App\Models\Order::count(),
            'pending_orders' => \App\Models\Order::where('status', 'pending')->count(),
        ];
    } elseif ($user->hasRole('admin-busdev')) {
        $stats = [
            'total_mapping' => \App\Models\User::count(),
            'total_accounts' => \App\Models\User::count(),
        ];
    }

    return Inertia::render('admin/dashboard', [
        'user' => $user->load('roles', 'permissions'),
        'stats' => $stats,
    ]);
}



    /**
     * Display the roles management page.
     */
    public function roles(Request $request)
    {
        // Check if user has permission to view roles
        if (! $request->user()->can('view roles')) {
            abort(403, 'Unauthorized action.');
        }

        $roles = Role::with('permissions')->get()->map(function ($role) {
            $role->users_count = $role->users()->count();

            return $role;
        });

        return Inertia::render('admin/roles', [
            'roles' => $roles,
            'permissions' => Permission::all(),
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function storeRole(Request $request)
    {
        // Check if user has permission to create roles
        if (! $request->user()->can('create roles')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if (! empty($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Role created successfully.');
    }

    /**
     * Update the specified role.
     */
    public function updateRole(Request $request, Role $role)
    {
        // Check if user has permission to update roles
        if (! $request->user()->can('update roles')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role.
     */
    public function destroyRole(Request $request, Role $role)
    {
        // Check if user has permission to delete roles
        if (! $request->user()->can('delete roles')) {
            abort(403, 'Unauthorized action.');
        }

        // Prevent deletion of system roles
        if (in_array($role->name, ['super-admin', 'admin', 'user'])) {
            return redirect()->route('admin.roles.index')->with('error', 'System roles cannot be deleted.');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')->with('success', 'Role deleted successfully.');
    }
}
