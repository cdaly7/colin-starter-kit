<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('orders', function () {
        return Inertia::render('orders/index');
    })->name('orders');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('foo', function () {
        return Inertia::render('foo/index');
    })->name('foo');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('inventory', function () {
        return Inertia::render('inventory/index');
    })->name('inventory');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('items', function () {
        return Inertia::render('items/index');
    })->name('items');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('items-to-pick', function () {
        return Inertia::render('items-to-pick/index');
    })->name('items');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
