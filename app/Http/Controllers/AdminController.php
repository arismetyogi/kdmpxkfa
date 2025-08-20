<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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

        return Inertia::render('Admin/Dashboard', [
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

        return Inertia::render('Admin/Roles', [
            'roles' => Role::with('permissions')->get(),
            'permissions' => Permission::all(),
        ]);
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

        return Inertia::render('Admin/Permissions', [
            'permissions' => Permission::all(),
        ]);
    }

    /**
     * Display the users management page.
     */
    public function users(Request $request)
    {
        // Check if user has permission to view users
        if (! $request->user()->can('view users')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Admin/Users', [
            'users' => \App\Models\User::with('roles', 'permissions')->get(),
            'roles' => Role::all(),
        ]);
    }
}
