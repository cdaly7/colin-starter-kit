<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BricklinkApiService;
use Illuminate\Http\JsonResponse;

class ApiController extends Controller
{
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
        $orders = \App\Models\Order::all();
        return response()->json($orders);
    }

    public function localOrderItems($orderId): JsonResponse
    {
        $orderItems = \App\Models\OrderItem::where('order_id', $orderId)->get();
        return response()->json($orderItems);
    }
}