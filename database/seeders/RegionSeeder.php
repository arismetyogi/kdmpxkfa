<?php

namespace Database\Seeders;

use App\Models\Region;
use App\Models\RegionDetail;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedRegions();
        $this->seedRegionsLevel1And2();
    }

    private function seedRegions(): void
    {
        $filePath = database_path('seeders/data/regions.csv');

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
            Region::updateOrCreate(
                [
                    'code' => $item['code'] ?? null,
                    'name' => $item['name'] ?? null,
                ]
            );
        }

        $this->command->info('Regions seeded successfully!');
    }

    private function seedRegionsLevel1And2(): void
    {
        $filePath = database_path('seeders/data/region_level1_2.csv');

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
            RegionDetail::updateOrCreate(
                [
                    'code' => $item['code'] ?? null,
                    'name' => $item['name'] ?? null,
                    'capital' => $item['capital'] ?? null,
                    'latitude' => (float)$item['lat'] ?? null,
                    'longitude' => (float)$item['long'] ?? null,
                    'elevation' => (float)$item['elv'] ?? null,
                    'timezone' => (int)$item['timezone'] ?? null,
                    'area' => (float)$item['area'] ?? null,
                    'population' => (int)$item['population'] ?? null,
                    'path' => $item['path'] ?? null,
                ]
            );
        }

        $this->command->info('Regions seeded successfully!');
    }
}
