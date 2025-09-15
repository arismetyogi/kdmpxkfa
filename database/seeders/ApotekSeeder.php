<?php

namespace Database\Seeders;

use App\Models\Apotek;
use Illuminate\Database\Seeder;

class ApotekSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = database_path('seeders/data/apoteks.csv');

        if (! file_exists($filePath)) {
            $this->command->error("CSV file not found: $filePath");

            return;
        }

        $header = null;
        $data = [];

        if (($handle = fopen($filePath, 'r')) !== false) {
            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                //                $this->command->info("Processing $row[0]");
                //                break;
                if (! $header) {
                    $header = array_map(function ($h) {
                        return trim(preg_replace('/^\xEF\xBB\xBF/', '', $h)); // hapus BOM kalau ada
                    }, $row);
//                    $this->command->info('CSV Header: '.json_encode($header));
                } else {
                    if (count($row) === count($header)) {
                        $data[] = array_combine($header, array_map('trim', $row));
                    } else {
                        $this->command->warn('Skipped row: '.implode(',', $row));
                    }
                }
            }
            fclose($handle);
        }

        foreach ($data as $item) {
            Apotek::forceCreate([
                'branch' => $item['branch'],
                'sap_id' => $item['sap_id'],
                'name' => $item['name'] ?? null,
                'address' => $item['address'] ?? null,
                'phone' => (string) $item['phone'] ?? null,
                'latitude' => (float) $item['latitude'] ?? null,
                'longitude' => (float) $item['longitude'] ?? null,
                'zipcode' => (string) $item['zipcode'] ?? null,
            ]);
        }

        $this->command->info('Apotek seeded successfully!');
    }
}
