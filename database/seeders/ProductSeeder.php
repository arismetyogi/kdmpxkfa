<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedCategories();
        $this->seedProducts();
    }

    public function seedCategories(): void
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
            Category::forceCreate([
                'id' => $item['id'],
                'main_category' => $item['main_category'] ?? null,
                'subcategory1' => $item['subcategory1'] ?? null,
                'subcategory2' => $item['subcategory2'] ?? null,
            ]);
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
            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                if (! $header) {
                    $header = $row;
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

            Product::create([
                'sku' => $item['sku'],
                'name' => $name,
                'slug' => $slug,
                'description' => $item['description'] ?? '',
                'dosage' => $item['dosage'] ? json_decode($item['dosage'], true) : null,
                'pharmacology' => $item['pharmacology'] ?? '',
                'price' => $item['price'] ?? 1.00,
                'base_uom' => $item['base_uom'] ?? '',
                'order_unit' => $item['order_unit'] ?? '',
                'content' => $item['content'] ?? 1,
                'weight' => $item['weight'] ?? 100,
                'length' => $item['length'] ?? null,
                'width' => $item['width'] ?? null,
                'height' => $item['height'] ?? null,
                'brand' => $item['brand'] ?? null,
            ]);
        }

        $this->command->info('Products seeded successfully!');
    }
}
