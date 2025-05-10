<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->string('vendor_code', 50)->unique();
            $table->string('vendor_name', 255);
            $table->string('contact_number', 20);
            $table->string('vendor_email', 255);
            $table->string('vendor_address', 255);
            $table->string('business_name', 255);
            $table->string('business_number', 255);
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
