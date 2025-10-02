<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        $products = Cache::remember('package_products', 86400, function () { // Cache for 1 day (86400 seconds)
            // path file CSV (misalnya disimpan di storage/app/packages.csv)
            $path = database_path('seeders/data/package.csv');

            // Baca CSV
            $rows = array_map('str_getcsv', file($path));
            $header = array_shift($rows); // ambil header (KODE OBAT, QTY Pesan)

            $bundles = collect($rows)->map(function ($row) use ($header) {
                return array_combine($header, $row);
            });

            // Extract all sap_codes to fetch products in a single query
            $sapCodes = $bundles->pluck('KODE OBAT')->unique()->toArray();

            // Fetch all products in a single query with category relationship
            $productsMap = Product::with('category')->whereIn('sap_code', $sapCodes)->get()->keyBy('sap_code');

            // Build products array with additional fields using the fetched data
            return $bundles->map(function ($bundle) use ($productsMap) {
                $sapCode = $bundle['KODE OBAT'];
                $product = $productsMap->get($sapCode);

                if (!$product) {
                    return null; // skip kalau produk tidak ada
                }

                $maxQuantity = (int)$bundle['QTY Pesan'];
                $assignedQuantity = $maxQuantity;

                // Prepare resource array with product data and additional fields
                $resource = new ProductResource($product);
                $resourceArray = $resource->toArray(request());

                // Add the additional fields to the resource array
                $resourceArray['assignedQuantity'] = $assignedQuantity;
                $resourceArray['maxQuantity'] = $maxQuantity;

                return $resourceArray;
            })->filter()->values();
        });

        return Inertia::render('orders/Package', [
            'products' => $products
        ]);
    }
}
