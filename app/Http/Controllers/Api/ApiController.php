<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BricklinkApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function inventories(BricklinkApiService $bricklink, Request $request): JsonResponse
    {
        $category_id = $request->query('category_id');
        $item_type = $request->query('item_type');
        $item_no = $request->query('item_no');
        $inventories = $bricklink->getInventories($category_id, $item_type);
        if (isset($item_no)) {
            Log::info("filtering items by: item_no: $item_no");
            $inventories['data'] = array_filter($inventories['data'], function ($inventory) use ($item_no) {
                return stripos($inventory['item']['no'], $item_no) !== false;
            });
            // Reindex the array to ensure it's a sequential array
            $inventories['data'] = array_values($inventories['data']);
        }
        Log::info("Fetched inventories with category_id: $category_id, item_type: $item_type, item_no: $item_no");
        return response()->json($inventories);
    }

    public function inventory(BricklinkApiService $bricklink, $inventoryId): JsonResponse
    {
        $inventory = $bricklink->getInventory($inventoryId);
        return response()->json($inventory);
    }

    public function updateBricklinkInventoryItem(Request $request, $inventoryId): JsonResponse
    {
        Log::info("Trying to update Bricklink inventory item: {$inventoryId}");
        $inventoryItem = \App\Models\BricklinkInventory::find($inventoryId);
        if (!$inventoryItem) {
            return response()->json(['error' => 'Inventory item not found'], 404);
        }
        $quantity = $request->input('quantity');
        $unit_price = $request->input('unit_price');
        $data = [];
        if (isset($quantity)) {
            $data['quantity'] = '+' . $quantity;
        }
        if (isset($unit_price)) {
            $data['unit_price'] = floatval($unit_price);
        }
        if (empty($data)) {
            return response()->json(['error' => 'No data provided to update'], 400);
        }
        // Log::info("about to call the Bricklink API: {$data['unit_price']}, {$data['quantity']}");
        $bricklink = new BricklinkApiService();
        $updatedInventory = $bricklink->putInventory($inventoryId, $data);
        \App\Models\BricklinkInventory::updateOrCreate(
                ['id' => $updatedInventory['data']['inventory_id']],
                    [
                        'quantity' => $updatedInventory['data']['quantity'],
                        'unit_price' => $updatedInventory['data']['unit_price'],
                    ]
                );
        return response()->json($updatedInventory);
    }

    public function updateInventoryItem(Request $request, $inventoryId): JsonResponse
    {
        $quantity = $request->input('quantity');
        $unit_price = $request->input('unit_price');
        $inventoryItem = \App\Models\BricklinkInventory::find($inventoryId);
        if (!$inventoryItem) {
            return response()->json(['error' => 'Inventory item not found'], 404);
        }
        if (isset($quantity)) {
            $inventoryItem->quantity = $quantity;
        }
        if (isset($unit_price)) {
            $inventoryItem->unit_price = $unit_price;
        }
        $inventoryItem->save();
        return response()->json($inventoryItem);
    }

    public function orders(BricklinkApiService $bricklink): JsonResponse
    {
        $orders = $bricklink->getOrders();
        return response()->json($orders);
    }

    public function orderItems(BricklinkApiService $bricklink, $orderId): JsonResponse
    {
        $orderDetails = $bricklink->getOrderItems($orderId);
        return response()->json($orderDetails);
    }

    public function localOrders(): JsonResponse
    {
        // Use a join statment later
        $orders = \App\Models\Order::all();
        for ($i = 0; $i < count($orders); $i++) {
            $orderId = $orders[$i]->id;
            $orderItems = \App\Models\OrderItem::where('order_id', $orders[$i]->id)->get();
            $itemCount = count($orderItems);
            $orders[$i]->items = $orderItems;
        }
        return response()->json($orders);
    }

    public function localOrderItems($orderId): JsonResponse
    {
        $orderItems = \App\Models\OrderItem::where('order_id', $orderId)->get();
        Log::info("geting itemw with order ID = $orderId"); 
        Log::info($orderItems);
        return response()->json($orderItems);
    }
    
    public function uniqueInventoryCategories(): JsonResponse
    {
        $categories = \App\Models\Category::all()->keyBy('id');
        $inventoryCategories = \App\Models\BricklinkInventory::select('category_id')
            ->distinct()
            ->get();
        foreach ($inventoryCategories as $inventory) {
            $categoryId = $inventory->category_id;
            if (isset($categories[$categoryId])) {
            $inventory->category_name = $categories[$categoryId]->name;
            } else {
            $inventory->category_name = 'Unknown Category';
            }
        }
        return response()->json($inventoryCategories);
    }

    public function updateLocalOrderItems(Request $request, $orderId, $itemId): JsonResponse
    {
        Log::info("Updating order item: Order ID = $orderId, Item ID = $itemId");
        $ispacked = $request->input('is_packed');
        Log::info("request.input:  $ispacked");
        $orderItem = \App\Models\OrderItem::where('order_id', $orderId)->where('id', $itemId)->first();
        Log::info("OrderItem is update:  $orderItem");
        $orderItem->is_packed = $request->get('is_packed');
        $orderItem->picked_quantity = $request->get('picked_quantity');
        $orderItem->save();
        return response()->json($orderItem);    
    }

    public function colors(): JsonResponse
    {
        $orders = \App\Models\Color::all();
        return response()->json($orders);
    }

    public function categories(): JsonResponse
    {
        $orders = \App\Models\Category::all();
        return response()->json($orders);
    }
}