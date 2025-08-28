<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\ApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('/bricklink/colors', [ApiController::class, 'colors']);
Route::get('/bricklink/inventories', [ApiController::class, 'inventories']);
Route::get('/bricklink/categories', [ApiController::class, 'categories']);
Route::get('/bricklink/orders', [ApiController::class, 'orders']);
Route::get('/bricklink/orders/{orderId}/items', [ApiController::class, 'orderItems'])
    ->where('orderId', '[0-9]+');
Route::get('/categories', [ApiController::class, 'categories']);
Route::get('/local-orders', [ApiController::class, 'localOrders']);
Route::get('/local-orders/{orderId}/items', [ApiController::class, 'localOrderItems'])
    ->where('orderId', '[0-9]+');
Route::put('/local-orders/{orderId}/items/{itemId}', [ApiController::class, 'updateLocalOrderItems'])
    ->where('orderId', '[0-9]+')
    ->where('itemId', '[0-9]+|[a-zA-Z0-9_-]+');