<?php

namespace Database\Seeders;

use App\Models\Region;
use App\Models\RegionDetail;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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

        // Get total number of rows for progress tracking
        $totalRows = $this->getTotalRows($filePath) - 1; // Subtract 1 for header
        $this->command->info("Processing $totalRows regions...");

        $header = null;
        $batch = [];
        $batchSize = 1000; // Process in batches of 1000
        $processed = 0;

        if (($handle = fopen($filePath, 'r')) !== false) {
            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                if (! $header) {
                    $header = $row; // first row as header
                } else {
                    $data = array_combine($header, $row);
                    
                    // Prepare data for insert
                    $regionData = [
                        'code' => $data['code'] ?? null,
                        'name' => $data['name'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    
                    $batch[] = $regionData;
                    
                    // When batch reaches desired size, insert it
                    if (count($batch) >= $batchSize) {
                        $this->insertOrIgnoreRegions($batch);
                        $processed += count($batch);
                        $this->command->getOutput()->write("\rProgress: $processed/$totalRows");
                        $batch = [];
                    }
                }
            }
            
            // Insert remaining records
            if (!empty($batch)) {
                $this->insertOrIgnoreRegions($batch);
                $processed += count($batch);
                $this->command->getOutput()->write("\rProgress: $processed/$totalRows");
            }
            
            fclose($handle);
        }

        $this->command->info("\nRegions seeded successfully! ($processed records)");
    }

    private function seedRegionsLevel1And2(): void
    {
        $filePath = database_path('seeders/data/region_level1_2.csv');

        if (! file_exists($filePath)) {
            $this->command->error("CSV file not found: $filePath");

            return;
        }

        // Get total number of rows for progress tracking
        $totalRows = $this->getTotalRows($filePath) - 1; // Subtract 1 for header
        $this->command->info("Processing $totalRows region details...");

        $header = null;
        $batch = [];
        $batchSize = 1000; // Process in batches of 1000
        $processed = 0;

        if (($handle = fopen($filePath, 'r')) !== false) {
            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                if (! $header) {
                    $header = $row; // first row as header
                } else {
                    $data = array_combine($header, $row);
                    
                    // Prepare data for insert with proper type casting
                    $regionDetailData = [
                        'code' => $data['code'] ?? null,
                        'name' => $data['name'] ?? null,
                        'capital' => $data['capital'] ?? null,
                        'latitude' => isset($data['lat']) && $data['lat'] !== '' ? (float) $data['lat'] : null,
                        'longitude' => isset($data['long']) && $data['long'] !== '' ? (float) $data['long'] : null,
                        'elevation' => isset($data['elv']) && $data['elv'] !== '' ? (float) $data['elv'] : null,
                        'timezone' => isset($data['timezone']) && $data['timezone'] !== '' ? (int) $data['timezone'] : null,
                        'area' => isset($data['area']) && $data['area'] !== '' ? (float) $data['area'] : null,
                        'population' => isset($data['population']) && $data['population'] !== '' ? (int) $data['population'] : null,
                        'path' => $data['path'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    
                    $batch[] = $regionDetailData;
                    
                    // When batch reaches desired size, insert it
                    if (count($batch) >= $batchSize) {
                        $this->insertOrIgnoreRegionDetails($batch);
                        $processed += count($batch);
                        $this->command->getOutput()->write("\rProgress: $processed/$totalRows");
                        $batch = [];
                    }
                }
            }
            
            // Insert remaining records
            if (!empty($batch)) {
                $this->insertOrIgnoreRegionDetails($batch);
                $processed += count($batch);
                $this->command->getOutput()->write("\rProgress: $processed/$totalRows");
            }
            
            fclose($handle);
        }

        $this->command->info("\nRegion details seeded successfully! ($processed records)");
    }

    /**
     * Insert regions using bulk insert with ON DUPLICATE KEY UPDATE to handle duplicates
     */
    private function insertOrIgnoreRegions(array $batch): void
    {
        DB::table('regions')->upsert(
            $batch,
            ['code'], // unique columns to check for conflicts
            ['name', 'updated_at'] // columns to update if conflict occurs
        );
    }

    /**
     * Insert region details using bulk insert with ON DUPLICATE KEY UPDATE to handle duplicates
     */
    private function insertOrIgnoreRegionDetails(array $batch): void
    {
        DB::table('region_details')->upsert(
            $batch,
            ['code'], // unique columns to check for conflicts
            ['name', 'capital', 'latitude', 'longitude', 'elevation', 'timezone', 'area', 'population', 'path', 'updated_at'] // columns to update if conflict occurs
        );
    }

    /**
     * Get total number of rows in CSV file
     */
    private function getTotalRows(string $filePath): int
    {
        $count = 0;
        $handle = fopen($filePath, 'r');
        if ($handle) {
            while (fgetcsv($handle, 1000, ',') !== false) {
                $count++;
            }
            fclose($handle);
        }
        return $count;
        }

}
