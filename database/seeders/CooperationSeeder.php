<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CooperationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = database_path('seeders/data/koperasi_kdmp.csv');

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
                    $coopData = [
                        'name' => $data['name'] ?? null,
                        'village' => $data['village'] ?? null,
                        'district' => $data['district'] ?? null,
                        'city' => $data['city'] ?? null,
                        'province' => $data['province'] ?? null,
                        'status' => $data['status'] ?? null,
                        'area' => $data['area'] ?? null,
                    ];

                    $batch[] = $coopData;

                    // When batch reaches desired size, insert it
                    if (count($batch) >= $batchSize) {
                        $this->insertOrIgnoreCooperations($batch);
                        $processed += count($batch);
                        $this->command->getOutput()->write("\rProgress: $processed/$totalRows");
                        $batch = [];
                    }
                }
            }

            // Insert remaining records
            if (!empty($batch)) {
                $this->insertOrIgnoreCooperations($batch);
                $processed += count($batch);
                $this->command->getOutput()->write("\rProgress: $processed/$totalRows");
            }

            fclose($handle);
        }

        $this->command->info("\nCooperations seeded successfully! ($processed records)");
    }

    private function insertOrIgnoreCooperations(array $batch): void
    {
        DB::table('koperasi_master')->upsert(
            $batch,
            ['name'], // unique columns to check for conflicts
            ['village', 'district', 'city', 'province', 'status', 'area'] // columns to update if conflict occurs
        );
    }

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
