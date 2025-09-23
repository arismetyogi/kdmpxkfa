<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedCategories();
        $this->seedProducts();
    }

    private function seedCategories(): void
    {
        $filePath = database_path('seeders/data/categories.csv');

        if (! file_exists($filePath)) {
            $this->command->error("CSV file not found: $filePath");

            return;
        }

        $header = null;
        $data = [];

        if (($handle = fopen($filePath, 'r')) !== false) {
            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                if (! $header) {
                    $header = $row; // first row as header
                } else {
                    $data[] = array_combine($header, $row);
                }
            }
            fclose($handle);
        }

        foreach ($data as $item) {
            Category::updateOrCreate(
                ['id' => $item['id']],
                [
                    'main_category' => $item['main_category'] ?? null,
                    'subcategory1' => $item['subcategory1'] ?? null,
                    'subcategory2' => $item['subcategory2'] ?? null,
                ]
            );
        }

        $this->command->info('Categories seeded successfully!');
    }

    private function seedProducts(): void
    {
        $filePath = database_path('seeders/data/products.csv');

        if (! file_exists($filePath)) {
            $this->command->error("CSV file not found: $filePath");

            return;
        }

        $header = null;
        $data = [];

        if (($handle = fopen($filePath, 'r')) !== false) {
            while (($row = fgetcsv($handle,0, ',')) !== false) {
                if (! $header) {
                    $header = $row;
//                    dd($header);
                } else {
                    $data[] = array_combine($header, $row);
                }
            }
            fclose($handle);
        }

        foreach ($data as $item) {
            $baseName = trim($item['name'] ?? 'Unknown Product');
            $baseSlug = Str::slug($baseName);

            // ensure unique name
            $name = $baseName;
            $counter = 1;
            while (Product::where('name', $name)->exists()) {
                $name = $baseName." ($counter)";
                $counter++;
            }

            // ensure unique slug
            $slug = $baseSlug;
            $counter = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = $baseSlug.'-'.$counter;
                $counter++;
            }

            Product::updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'sap_code' => $item['sap_code'],
                    'name' => $name,
                    'slug' => $slug,
                    'description' => $item['description'] ?? '',
                    'dosage' => $item['dosage'] ? json_decode($item['dosage'], true) : null,
                    'pharmacology' => $item['pharmacology'] ?? '',
                    'price' => (float) ($item['price'] ?? 1.00),
                    'base_uom' => $item['base_uom'] ?? '',
                    'order_unit' => $item['order_unit'] ?? '',
                    'content' => (int) ($item['content'] ?? 1),
                    'weight' => (int) ($item['weight'] ?? 100),
                    'length' => $item['length'] ?? null,
                    'width' => $item['width'] ?? null,
                    'height' => $item['height'] ?? null,
                    'brand' => $item['brand'] ?? 'no brand',
                    'category_id' => $item['category_id'] ?? null,
                    'is_active' => true,

                    // additional informative columns
                    'usage_direction' => $item['usage_direction'] ?? '',
                    'contraindication' => $item['contraindication'] ?? '',
                    'adverse_effects' => $item['adverse_effects'] ?? '',
                    'caution' => $item['caution'] ?? '',
                    'storage' => $item['storage'] ?? '',
                    'registration_number' => $item['registration_number'] ?? '',
                    'dosage_form' => $item['dosage_form'] ?? '',
                    'active_ingredients' => $item['active_ingredients'] ? json_decode($item['active_ingredients'], true) : null,
                ]
            );
        }

        $this->command->info('Products seeded successfully!');
    }
}
