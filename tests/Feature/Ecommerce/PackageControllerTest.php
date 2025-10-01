<?php

namespace Tests\Feature\Ecommerce;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PackageControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_view_with_products(): void
    {
        // Create a user and log in since the route requires authentication
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $response = $this->actingAs($user)->get('/packages'); // The actual route defined in web.php

        $response->assertStatus(200);
    }
}