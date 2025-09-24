<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Product;
<<<<<<< HEAD
use Illuminate\Support\Facades\Storage;
=======
>>>>>>> KDMP/master
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
<<<<<<< HEAD
        // path file CSV (misalnya disimpan di storage/app/packages.csv)
        $path = database_path('seeders/data/package.csv');

        // Baca CSV
        $rows = array_map('str_getcsv', file($path));
        $header = array_shift($rows); // ambil header (KODE OBAT, QTY Pesan)

        $bundles = collect($rows)->map(function ($row) use ($header) {
            return array_combine($header, $row);
        });

        // Ambil produk berdasarkan sap_code dari CSV
        $products = $bundles->map(function ($bundle) {
            $product = Product::with('category')
                ->where('sap_code', $bundle['KODE OBAT'])
                ->first();

            if (!$product) {
                return null; // skip kalau produk tidak ada
            }

            $maxQuantity = (int) $bundle['QTY Pesan'];
            $assignedQuantity = $maxQuantity;

            return [
                'id' => $product->id,
                'sku' => $product->sku,
                'sap_code' => $product->sap_code,
                'name' => $product->name,
                'slug' => $product->slug,
                'category_id' => $product->category_id,
                'price' => $product->price,
                'weight' => $product->weight,
                'base_uom' => $product->base_uom,
                'order_unit' => $product->order_unit,
                'content' => $product->content,
                'image' => $product->getFirstImageUrl(),
                'description' => $product->description,
                'is_active' => $product->is_active,
                'assignedQuantity' => $assignedQuantity,
                'maxQuantity' => $maxQuantity,
            ];
        })->filter()->values(); // buang null

        return Inertia::render('orders/Package', [
            'products' => $products
        ]);
    }
}
=======
        // Fetch random products from the database
        $products = Product::with('category')
            ->inRandomOrder()
            ->take(8)
            ->get()
            ->map(function ($product) {
                // Set assignedQuantity to always be the same as maxQuantity
                $maxQuantity = rand(1, 5);
                $assignedQuantity = $maxQuantity;

                return [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'category_id' => $product->category_id,
                    'price' => $product->price,
                    'weight' => $product->weight,
                    'base_uom' => $product->base_uom,
                    'order_unit' => $product->order_unit,
                    'content' => $product->content,
                    'image' => $product->getFirstImageUrl(),
                    'description' => $product->description,
                    'is_active' => $product->is_active,
                    'assignedQuantity' => $assignedQuantity,
                    'maxQuantity' => $maxQuantity,
                ];
            })->toArray();

        return Inertia::render('orders/Package', [
            'products' => $products,
        ]);
    }
}
>>>>>>> KDMP/master
