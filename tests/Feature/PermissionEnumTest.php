<?php

namespace Tests\Feature;

use App\Enums\PermissionEnum;
use Tests\TestCase;

class PermissionEnumTest extends TestCase
{
    /** @test */
    public function it_has_all_required_permissions()
    {
        // Test that all permissions exist
        $this->assertTrue(defined(PermissionEnum::class . '::VIEW_USERS'));
        $this->assertTrue(defined(PermissionEnum::class . '::CREATE_USERS'));
        $this->assertTrue(defined(PermissionEnum::class . '::UPDATE_USERS'));
        $this->assertTrue(defined(PermissionEnum::class . '::DELETE_USERS'));
        
        $this->assertTrue(defined(PermissionEnum::class . '::VIEW_ROLES'));
        $this->assertTrue(defined(PermissionEnum::class . '::CREATE_ROLES'));
        $this->assertTrue(defined(PermissionEnum::class . '::UPDATE_ROLES'));
        $this->assertTrue(defined(PermissionEnum::class . '::DELETE_ROLES'));
        
        $this->assertTrue(defined(PermissionEnum::class . '::VIEW_PERMISSIONS'));
        $this->assertTrue(defined(PermissionEnum::class . '::CREATE_PERMISSIONS'));
        $this->assertTrue(defined(PermissionEnum::class . '::UPDATE_PERMISSIONS'));
        $this->assertTrue(defined(PermissionEnum::class . '::DELETE_PERMISSIONS'));
        
        $this->assertTrue(defined(PermissionEnum::class . '::VIEW_DASHBOARD'));
        $this->assertTrue(defined(PermissionEnum::class . '::VIEW_ADMIN_DASHBOARD'));
        
        $this->assertTrue(defined(PermissionEnum::class . '::VIEW_PRODUCTS'));
        $this->assertTrue(defined(PermissionEnum::class . '::CREATE_PRODUCTS'));
        $this->assertTrue(defined(PermissionEnum::class . '::UPDATE_PRODUCTS'));
        $this->assertTrue(defined(PermissionEnum::class . '::DELETE_PRODUCTS'));
        
        $this->assertTrue(defined(PermissionEnum::class . '::VIEW_ORDERS'));
        $this->assertTrue(defined(PermissionEnum::class . '::CREATE_ORDERS'));
        $this->assertTrue(defined(PermissionEnum::class . '::UPDATE_ORDERS'));
        $this->assertTrue(defined(PermissionEnum::class . '::DELETE_ORDERS'));
        
        $this->assertTrue(defined(PermissionEnum::class . '::VIEW_REPORTS'));
        $this->assertTrue(defined(PermissionEnum::class . '::CREATE_REPORTS'));
    }
    
    /** @test */
    public function it_returns_correct_values()
    {
        $this->assertEquals('view users', PermissionEnum::VIEW_USERS->value);
        $this->assertEquals('create users', PermissionEnum::CREATE_USERS->value);
        $this->assertEquals('update users', PermissionEnum::UPDATE_USERS->value);
        $this->assertEquals('delete users', PermissionEnum::DELETE_USERS->value);
        
        $this->assertEquals('view roles', PermissionEnum::VIEW_ROLES->value);
        $this->assertEquals('create roles', PermissionEnum::CREATE_ROLES->value);
        $this->assertEquals('update roles', PermissionEnum::UPDATE_ROLES->value);
        $this->assertEquals('delete roles', PermissionEnum::DELETE_ROLES->value);
        
        $this->assertEquals('view dashboard', PermissionEnum::VIEW_DASHBOARD->value);
        $this->assertEquals('view admin dashboard', PermissionEnum::VIEW_ADMIN_DASHBOARD->value);
        
        $this->assertEquals('view products', PermissionEnum::VIEW_PRODUCTS->value);
        $this->assertEquals('create products', PermissionEnum::CREATE_PRODUCTS->value);
        $this->assertEquals('update products', PermissionEnum::UPDATE_PRODUCTS->value);
        $this->assertEquals('delete products', PermissionEnum::DELETE_PRODUCTS->value);
    }
    
    /** @test */
    public function it_returns_correct_labels()
    {
        $this->assertEquals('View Users', PermissionEnum::VIEW_USERS->label());
        $this->assertEquals('Create Users', PermissionEnum::CREATE_USERS->label());
        $this->assertEquals('Update Users', PermissionEnum::UPDATE_USERS->label());
        $this->assertEquals('Delete Users', PermissionEnum::DELETE_USERS->label());
        
        $this->assertEquals('View Roles', PermissionEnum::VIEW_ROLES->label());
        $this->assertEquals('Create Roles', PermissionEnum::CREATE_ROLES->label());
        $this->assertEquals('Update Roles', PermissionEnum::UPDATE_ROLES->label());
        $this->assertEquals('Delete Roles', PermissionEnum::DELETE_ROLES->label());
        
        $this->assertEquals('View Dashboard', PermissionEnum::VIEW_DASHBOARD->label());
        $this->assertEquals('View Admin Dashboard', PermissionEnum::VIEW_ADMIN_DASHBOARD->label());
        
        $this->assertEquals('View Products', PermissionEnum::VIEW_PRODUCTS->label());
        $this->assertEquals('Create Products', PermissionEnum::CREATE_PRODUCTS->label());
        $this->assertEquals('Update Products', PermissionEnum::UPDATE_PRODUCTS->label());
        $this->assertEquals('Delete Products', PermissionEnum::DELETE_PRODUCTS->label());
    }
    
    /** @test */
    public function it_returns_all_values()
    {
        $values = PermissionEnum::values();
        
        $this->assertContains('view users', $values);
        $this->assertContains('create users', $values);
        $this->assertContains('update users', $values);
        $this->assertContains('delete users', $values);
        
        $this->assertContains('view roles', $values);
        $this->assertContains('create roles', $values);
        $this->assertContains('update roles', $values);
        $this->assertContains('delete roles', $values);
        
        $this->assertContains('view dashboard', $values);
        $this->assertContains('view admin dashboard', $values);
        
        $this->assertContains('view products', $values);
        $this->assertContains('create products', $values);
        $this->assertContains('update products', $values);
        $this->assertContains('delete products', $values);
        
        // Check that we have the expected number of permissions
        $this->assertCount(24, $values);
    }
    
    /** @test */
    public function it_returns_all_labels()
    {
        $labels = PermissionEnum::labels();
        
        $this->assertArrayHasKey('view users', $labels);
        $this->assertArrayHasKey('create users', $labels);
        $this->assertArrayHasKey('update users', $labels);
        $this->assertArrayHasKey('delete users', $labels);
        
        $this->assertEquals('View Users', $labels['view users']);
        $this->assertEquals('Create Users', $labels['create users']);
        $this->assertEquals('Update Users', $labels['update users']);
        $this->assertEquals('Delete Users', $labels['delete users']);
        
        // Check that we have the expected number of labels
        $this->assertCount(24, $labels);
    }
    
    /** @test */
    public function it_groups_permissions_by_category()
    {
        $userPermissions = PermissionEnum::userPermissions();
        $this->assertCount(4, $userPermissions);
        $this->assertContains(PermissionEnum::VIEW_USERS, $userPermissions);
        $this->assertContains(PermissionEnum::CREATE_USERS, $userPermissions);
        $this->assertContains(PermissionEnum::UPDATE_USERS, $userPermissions);
        $this->assertContains(PermissionEnum::DELETE_USERS, $userPermissions);
        
        $rolePermissions = PermissionEnum::rolePermissions();
        $this->assertCount(4, $rolePermissions);
        $this->assertContains(PermissionEnum::VIEW_ROLES, $rolePermissions);
        $this->assertContains(PermissionEnum::CREATE_ROLES, $rolePermissions);
        $this->assertContains(PermissionEnum::UPDATE_ROLES, $rolePermissions);
        $this->assertContains(PermissionEnum::DELETE_ROLES, $rolePermissions);
        
        $dashboardPermissions = PermissionEnum::dashboardPermissions();
        $this->assertCount(2, $dashboardPermissions);
        $this->assertContains(PermissionEnum::VIEW_DASHBOARD, $dashboardPermissions);
        $this->assertContains(PermissionEnum::VIEW_ADMIN_DASHBOARD, $dashboardPermissions);
        
        $productPermissions = PermissionEnum::productPermissions();
        $this->assertCount(4, $productPermissions);
        $this->assertContains(PermissionEnum::VIEW_PRODUCTS, $productPermissions);
        $this->assertContains(PermissionEnum::CREATE_PRODUCTS, $productPermissions);
        $this->assertContains(PermissionEnum::UPDATE_PRODUCTS, $productPermissions);
        $this->assertContains(PermissionEnum::DELETE_PRODUCTS, $productPermissions);
    }
}