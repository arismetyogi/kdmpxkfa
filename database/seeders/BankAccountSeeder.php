<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BankAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = database_path('seeders/data/bank_accounts.csv');

        if (! file_exists($filePath)) {
            $this->command->error("CSV file not found: $filePath");

            return;
        }

        // Get total number of rows for progress tracking
        $totalRows = $this->getTotalRows($filePath) - 1; // Subtract 1 for header
        $this->command->info("Processing $totalRows Bank Accounts...");

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
                        'branch_code' => $data['branch_code'] ?? null,
                        'account_number' => $data['account_no'] ?? null,
                        'account_name' => $data['account_name'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    $batch[] = $regionData;

                    // When batch reaches desired size, insert it
                    if (count($batch) >= $batchSize) {
                        $this->insertOrIgnoreBankAccounts($batch);
                        $processed += count($batch);
                        $this->command->getOutput()->write("\rProgress: $processed/$totalRows");
                        $batch = [];
                    }
                }
            }

            // Insert remaining records
            if (!empty($batch)) {
                $this->insertOrIgnoreBankAccounts($batch);
                $processed += count($batch);
                $this->command->getOutput()->write("\rProgress: $processed/$totalRows");
            }

            fclose($handle);
        }

        $this->command->info("\nBank Accounts seeded successfully! ($processed records)");
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

    private function insertOrIgnoreBankAccounts(array $batch): void
    {
        DB::table('bank_accounts')->upsert(
            $batch,
            ['branch_code'], // unique columns to check for conflicts
            ['account_number' , 'account_name',  'updated_at'] // columns to update if conflict occurs
        );
    }
}
