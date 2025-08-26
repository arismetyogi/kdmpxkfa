<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sku' => $this->faker->unique()->uuid(),
            'name' => $this->faker->words(3, true),
            'slug' => $this->faker->slug(),
            'category' => $this->faker->unique()->slug(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'weight' => $this->faker->numberBetween(100, 1000),
            'length' => $this->faker->numberBetween(2, 30),
            'width' => $this->faker->numberBetween(2, 30),
            'height' => $this->faker->numberBetween(5, 20),
            'is_active' => $this->faker->randomElement([true, false]),
        ];
    }
}
