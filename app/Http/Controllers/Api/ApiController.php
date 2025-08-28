<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BricklinkApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function inventories(BricklinkApiService $bricklink): JsonResponse
    {
        $inventories = $bricklink->getInventories();
        return response()->json($inventories);
    }

    public function inventory(BricklinkApiService $bricklink, $inventoryId): JsonResponse
    {
        $inventory = $bricklink->getInventory($inventoryId);
        return response()->json($inventory);
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