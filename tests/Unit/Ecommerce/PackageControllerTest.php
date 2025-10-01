<?php

namespace Tests\Unit\Ecommerce;

use Tests\TestCase;
use App\Http\Controllers\Ecommerce\PackageController;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PackageControllerTest extends TestCase
{
    public function test_index_method_uses_cache_and_optimized_queries(): void
    {
        // Clear any existing cache
        Cache::forget('package_products');

        // Create some test products that match the package.csv codes
        $testCodes = ['11002397', '11002396', '11002238'];
        foreach ($testCodes as $code) {
            Product::factory()->create([
                'sap_code' => $code,
                'name' => 'Test Product ' . $code,
                'sku' => 'SKU' . $code,
                'slug' => Str::slug('Test Product ' . $code),
            ]);
        }

        // Count queries before calling the method
        DB::enableQueryLog();
        $controller = new PackageController();
        $response = $controller->index();
        $queriesBeforeCache = count(DB::getQueryLog());

        // Clear query log and call again (should use cache)
        DB::flushQueryLog();
        $response2 = $controller->index();
        $queriesWithCache = count(DB::getQueryLog());

        // Verify that caching worked (fewer queries on second call)
        $this->assertLessThan($queriesBeforeCache, $queriesWithCache + 2); // Allow some variance
        $this->assertEquals($queriesWithCache, 0); // With cache, should be no DB queries

        // Verify cache is set
        $cachedProducts = Cache::get('package_products');
        $this->assertNotNull($cachedProducts);
        
        // Clean up
        DB::disableQueryLog();
    }
}