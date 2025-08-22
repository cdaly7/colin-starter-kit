<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\BricklinkApiService;
use App\Models\Order;
use App\Models\OrderItem;

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

            // Fetch and upsert order items
            $itemsData = $bricklink->getOrderItems($order['order_id']);
            if (isset($itemsData['data'][0])) {
                $this->info('Order Item: ' . json_encode($itemsData['data']));
                foreach ($itemsData['data'][0] as $item) {
                    $orderItemId = $order['order_id'] . $item['item']['no'];
                    OrderItem::updateOrCreate(
                        [
                            'id' => $orderItemId, // Assuming order_id is unique
                        ],
                        [
                            'id' => $orderItemId,
                            'category_id' => $item['item']['category_id'],
                            'order_id' => $order['order_id'],
                            'item_no' => $item['item']['no'],
                            'name' => $item['item']['name'],
                            'total_quantity' => $item['quantity'],
                            'picked_quantity' => 0, 
                            'is_packed' => false,
                            'problem' => null,
                            'color' => $item['color_id'],
                            'condition' => $item['new_or_used'],
                        ]
                    );
                }
            }
        }
        $this->info('BrickLink orders and items synced successfully.');
    }
}

