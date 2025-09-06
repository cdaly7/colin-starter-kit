<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\BricklinkApiService;
use App\Models\BricklinkInventory;
use App\Models\Category;

class SyncBricklinkInventories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bricklink:sync-inventories';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync inventories from BrickLink API to local database';

    /**
     * Execute sync-colors-categories  in thee console command.
     */
    public function handle(BricklinkApiService $bricklink)
    {
        $inventoriesData = $bricklink->getInventories();

        if (!isset($inventoriesData['data'])) {
            $this->error('No bricklink inventories found.');
            return;
        }
        $this->info('inventoriesData Length: ' . count($inventoriesData['data']));
        $allCategories = Category::all()->keyBy('id');
        foreach ($inventoriesData['data'] as $inventory) {
            $this->info('Adding Inventory ' . $inventory['item']['name'] . ' - ' . $inventory['color_name']);
            
            BricklinkInventory::updateOrCreate(
                ['id' => $inventory['inventory_id']], // Assuming order_id is unique
                [
                    'id' => $inventory['inventory_id'],
                    'item_no' => $inventory['item']['no'],
                    'item_name' => $inventory['item']['name'],
                    'item_type' => $inventory['item']['type'],
                    'category_id' => $inventory['item']['category_id'],
                    'category_name' => $allCategories->has($inventory['item']['category_id']) ? $allCategories[$inventory['item']['category_id']]->name : 'Unknown',
                    'color_id' => $inventory['color_id'],
                    'new_or_used' => $inventory['new_or_used'],
                    'unit_price' => $inventory['unit_price'],
                    'quantity' => $inventory['quantity'],
                    'is_stock_room' => $inventory['is_stock_room'],
                    'date_created' => $inventory['date_created']
                ]
            );
        }
        $this->info('BrickLink inventories synced successfully.');
    }
}

