<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\BricklinkApiService;
use App\Models\Color;
use App\Models\Category;

class SyncBricklinkColorsCategories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bricklink:sync-colors-categories';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync colors, and categories from BrickLink API to local database';

    /**
     * Execute the console command.
     */
    public function handle(BricklinkApiService $bricklink)
    {
        // Sync Colors
        $colorsData = $bricklink->getColors();
        //$this->info('colorsData: ' . json_encode($colorsData));
        if (isset($colorsData['data'])) {
            //$this->info('colorsData: ' . json_encode($colorsData['data']));
            foreach ($colorsData['data'] as $color) {
                $this->info($color['color_name']);
                Color::updateOrCreate(
                    ['id' => $color['color_id']],
                    [
                        'id' => $color['color_id'],
                        'name' => $color['color_name'],
                    ]
                );
            }
            $this->info('Colors synced successfully.');
        } else {
            $this->warn('No colors data found.');
        }

        // Sync Categories
        $categoriesData = $bricklink->getCategories();
        if (isset($categoriesData['data'])) {
            $this->info('categoriesData: ' . json_encode($categoriesData['data']));
            foreach ($categoriesData['data'] as $category) {
                Category::updateOrCreate(
                    ['id' => $category['category_id']],
                    [
                        'id' => $category['category_id'],
                        'name' => $category['category_name'],
                    ]
                );
            }
            $this->info('Categories synced successfully.');
        } else {
            $this->warn('No categories data found.');
        }

        $this->info('BrickLink colors and categories synced successfully.');
    }
}

