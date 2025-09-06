<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bricklink_inventories', function (Blueprint $table) {
            $table->id();
            $table->string('item_no');
            $table->string('item_name');
            $table->string('item_type');
            $table->string('category_id');
            $table->string('color_id');
            $table->string('new_or_used');
            $table->float('unit_price');
            $table->integer('quantity');
            $table->boolean('is_stock_room');
            $table->string('date_created');
            $table->timestamps(); // Adds `created_at` and `updated_at` columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
