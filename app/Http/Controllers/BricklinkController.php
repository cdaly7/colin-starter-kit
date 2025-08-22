<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BricklinkController extends Controller
{
    public function orders(BricklinkApiService $bricklink): JsonResponse
    {
        $orders = $bricklink->getOrders();
        return response()->json($orders);
    }

    public function index()
    {
        // This method can be used to display a list of orders or any other relevant data
        return view('bricklink.orders');
    }
}