<?php

namespace App\Services;

use GuzzleHttp\Client; 
use GuzzleHttp\HandlerStack; 
use GuzzleHttp\Subscriber\Oauth\Oauth1;

class BricklinkApiService
{
    protected $client;

    public function __construct()
{
    $stack = HandlerStack::create();

    $middleware = new Oauth1([
        'consumer_key'    => config('services.bricklink.consumer_key'),
        'consumer_secret' => config('services.bricklink.consumer_secret'),
        'token'           => config('services.bricklink.token'),
        'token_secret'    => config('services.bricklink.token_secret'),
        'signature_method'=> Oauth1::SIGNATURE_METHOD_HMAC,
    ]);

    $stack->push($middleware);

    $this->client = new Client([
        'base_uri' => 'https://api.usps.com/tracking/v3',
        'handler'  => $stack,
        'auth'     => 'oauth',
    ]);
}

public function getInventories()
{
    $response = $this->client->get("inventories");
    return json_decode($response->getBody(), true);
}

public function getInventory($inventoryId)
{
    $response = $this->client->get("inventories/{$inventoryId}");
    return json_decode($response->getBody(), true);
}

public function getItem($type, $no)
{
    $response = $this->client->get("items/{$type}/{$no}");
    return json_decode($response->getBody(), true);
}

public function getOrders()
{
    $response = $this->client->get("orders?filed=false");
    return json_decode($response->getBody(), true);
}

public function getColors()
{
    $response = $this->client->get("colors");
    return json_decode($response->getBody(), true);
}

public function getCategories()
{
    $response = $this->client->get("categories");
    return json_decode($response->getBody(), true);
}

public function getOrder($orderId)
{
    $response = $this->client->get("orders/{$orderId}");
    return json_decode($response->getBody(), true);
}           

public function getOrderItems($orderId)
{
    $response = $this->client->get("orders/{$orderId}/items");
    return json_decode($response->getBody(), true);
}
}