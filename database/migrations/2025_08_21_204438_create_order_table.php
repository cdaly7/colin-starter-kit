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

        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('status'); // Foreign key to items table
            $table->integer('buyer'); // Quantity of the item in the order
            $table->float('grand_total'); // Number of items picked
            $table->integer('total_items'); // Number of items packed
            $table->string('date_ordered'); // Problem with the item in the order
            $table->timestamps(); // Adds `created_at` and `updated_at` columns
            // Add more column definitions as needed
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->string('id'); // Foreign key to orders table
            $table->string('order_id'); // Foreign key to orders table
            $table->string('item_no'); 
            $table->integer('total_quantity'); // Quantity of the item in the order
            $table->integer('picked_quantity'); // Number of items picked
            $table->boolean('is_packed'); // Number of items packed
            $table->string('problem')->nullable(); // Problem with the item in the order
            $table->string('color')->nullable(); // Color of the item in the order
            $table->string('condition'); // Condition of the item in the order
            $table->string('category_id'); // Condition of the item in the order
            $table->string('name'); // name of the item
            $table->timestamps(); // Adds `created_at` and `updated_at` columns
            // Add more column definitions as needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('order_items');
    }
};
