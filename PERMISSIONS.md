# Laravel Permission System

This application uses [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission) to manage user roles and permissions.

## Overview

The permission system provides:

- **Roles**: Groups of permissions (e.g., admin, manager, user)
- **Permissions**: Specific actions users can perform (e.g., view users, create users)
- **Middleware**: Route protection based on roles and permissions
- **Frontend Components**: React components for conditional rendering

## Database Structure

The system creates the following tables:

- `roles` - Stores user roles
- `permissions` - Stores available permissions
- `model_has_roles` - Links users to roles
- `model_has_permissions` - Links users to permissions
- `role_has_permissions` - Links roles to permissions

## Default Roles and Permissions

### Roles

- **admin**: Full access to all features
- **manager**: Limited administrative access
- **user**: Basic user access

### Permissions

- `view users`, `create users`, `edit users`, `delete users`
- `view roles`, `create roles`, `edit roles`, `delete roles`
- `view permissions`, `create permissions`, `edit permissions`, `delete permissions`
- `view dashboard`, `access settings`

## Usage

### Backend (PHP)

#### Checking Permissions in Controllers

```php
// Check if user has a specific permission
if (!$request->user()->can('view users')) {
    abort(403, 'Unauthorized action.');
}

// Check if user has a specific role
if (!$request->user()->hasRole('admin')) {
    abort(403, 'Unauthorized action.');
}
```

#### Route Middleware

```php
// Protect routes with role middleware
Route::middleware(['role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'dashboard']);
});

// Protect routes with permission middleware
Route::middleware(['permission:view dashboard'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
```

#### Assigning Roles and Permissions

```php
// Assign a role to a user
$user->assignRole('admin');

// Give a permission to a user
$user->givePermissionTo('view users');

// Give permissions to a role
$role->givePermissionTo(['view users', 'create users']);
```

### Frontend (React)

#### Permission Check Components

```tsx
import { Can, HasRole } from '@/components/PermissionCheck';

// Show content only if user has permission
<Can permission="view users">
    <UserList />
</Can>

// Show content only if user has role
<HasRole role="admin">
    <AdminPanel />
</HasRole>

// With fallback content
<Can permission="edit users" fallback={<p>No permission to edit users</p>}>
    <UserEditForm />
</Can>
```

#### Checking Permissions in Components

```tsx
import { usePage } from '@inertiajs/react';

export default function MyComponent() {
    const { auth } = usePage().props as { auth: { user: any } };
    const user = auth.user;

    // Check if user has permission
    const canEditUsers =
        user.permissions?.some((p) => p.name === 'edit users') || user.roles?.some((r) => r.permissions?.some((p) => p.name === 'edit users'));

    return <div>{canEditUsers && <button>Edit User</button>}</div>;
}
```

## API Endpoints

### Admin Routes

- `GET /admin` - Admin dashboard (requires admin role)
- `GET /admin/users` - User management (requires admin role)
- `GET /admin/roles` - Role management (requires admin role)
- `GET /admin/permissions` - Permission management (requires admin role)

### Alternative Permission-Based Route

- `GET /admin/dashboard-alt` - Dashboard access (requires 'view dashboard' permission)

## Testing

Run the permission system tests:

```bash
php artisan test tests/Feature/AdminAccessTest.php
```

Test the permission system manually:

```bash
php artisan test:permissions
```

## Adding New Permissions

1. Add the permission to the seeder:

```php
// In database/seeders/RoleAndPermissionSeeder.php
$permissions = [
    // ... existing permissions
    'new_permission_name',
];
```

2. Assign to appropriate roles:

```php
$adminRole->givePermissionTo('new_permission_name');
$managerRole->givePermissionTo('new_permission_name');
```

3. Use in your application:

```php
// Backend
if ($request->user()->can('new_permission_name')) {
    // Allow action
}

// Frontend
<Can permission="new_permission_name">
    <NewFeature />
</Can>
```

## Security Notes

- Always validate permissions on the backend, even if you hide UI elements
- Use middleware to protect routes at the application level
- Frontend permission checks are for UX only, not security
- Regularly audit roles and permissions to ensure least-privilege access
