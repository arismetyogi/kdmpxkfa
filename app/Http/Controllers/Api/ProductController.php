<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\HasApiReponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use HasApiReponse;

    public function index(Request $request)
    {
        $faker = fake();
        // Dummy Data
        $dummyCategories = [];
        for ($i = 0; $i < 5; $i++) {
            $dummyCategories[] = [
                'id' => $faker->unique()->numberBetween(1, 5),
                'name' => $faker->word,
            ];
        }

        $dummyProducts = [];
        for ($i = 0; $i < 19; $i++) {
            $dummyProducts[] = [
                'id' => $faker->unique()->randomNumber(5),
                'sku' => $faker->unique()->uuid(),
                'name' => $faker->words(3, true),
                'category' => $faker->randomNumber(collect($dummyCategories)->count()),
                'price' => $faker->randomFloat(2, 10, 1000),
                'weight' => $faker->numberBetween(100, 1000),
                'length' => $faker->numberBetween(2, 30),
                'width' => $faker->numberBetween(2, 30),
                'height' => $faker->numberBetween(5, 20),
                'is_active' => $faker->randomElement([true, false]),
            ];
        }

        return $this->successResponse($dummyProducts);
    }
}
