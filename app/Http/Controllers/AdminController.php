<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard(Request $request)
    {
        // Check if user has permission to view dashboard
        if (! $request->user()->can('view dashboard')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('admin/dashboard', [
            'user' => $request->user()->load('roles', 'permissions'),
            'stats' => [
                'total_users' => \App\Models\User::count(),
                'total_roles' => Role::count(),
                'total_permissions' => Permission::count(),
            ],
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

        if (!empty($validated['permissions'])) {
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

    /**
     * Display the permissions management page.
     */
    public function permissions(Request $request)
    {
        // Check if user has permission to view permissions
        if (! $request->user()->can('view permissions')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('admin/permissions', [
            'permissions' => Permission::all(),
        ]);
    }
}
