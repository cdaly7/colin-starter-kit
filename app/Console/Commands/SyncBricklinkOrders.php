<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\BricklinkApiService;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Color;
use App\Models\Category;

class SyncBricklinkOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bricklink:sync-orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync orders and order items from BrickLink API to local database';

    /**
     * Execute the console command.
     */
    public function handle(BricklinkApiService $bricklink)
    {
        $ordersData = $bricklink->getOrders();

        if (!isset($ordersData['data'])) {
            $this->error('No orders data found.');
            return;
        }

        foreach ($ordersData['data'] as $order) {
            // Upsert order
            $localOrder = Order::updateOrCreate(
                ['id' => $order['order_id']], // Assuming order_id is unique
                [
                    'id' => $order['order_id'],
                    'status' => $order['status'],
                    'buyer' => $order['buyer_name'] ?? '',
                    'grand_total' => $order['cost']['grand_total'],
                    'total_items' => $order['total_count'],
                    'date_ordered' => $order['date_ordered'],
                ]
            );
            $allCategories = Category::all()->keyBy('id');
            $allColors = Color::all()->keyBy('id');
            // Fetch and upsert order items
            $this->info('Getting all items for OrderId: ' . $order['order_id']);            
            $itemsData = $bricklink->getOrderItems($order['order_id']);
            $orderItems = $itemsData['data'][0];
            $this->info('Order Length: ' . count($orderItems));
            if (isset($orderItems)) {
                foreach ($orderItems as $item) {
                    $orderItemId = $order['order_id'] . $item['item']['no'] . $item['color_id'] . $item['new_or_used'];
                    OrderItem::updateOrCreate(
                        [
                            'id' => $orderItemId, // Assuming order_id is unique
                        ],
                        [
                            'id' => $orderItemId,
                            'name' => $item['item']['name'],
                            'inventory_id' => $item['inventory_id'],
                            'order_id' => $order['order_id'],
                            'item_no' => $item['item']['no'],
                            'total_quantity' => $item['quantity'],
                            'picked_quantity' => 0,
                            'is_packed' => false,
                            'problem' => null,
                            'color_id' => $item['color_id'],
                            'color_name' => $allColors->has($item['color_id']) ? $allColors[$item['color_id']]->name : 'Unknown',
                            'condition' => $item['new_or_used'],
                            'category_id' => $item['item']['category_id'],
                            'type' => $item['item']['type'],
                            'category_name' => $allCategories->has($item['item']['category_id']) ? $allCategories[$item['item']['category_id']]->name : 'Unknown',
                        ]
                    );
                }
            }
        }
        $this->info('BrickLink orders and items synced successfully.');
    }
}

