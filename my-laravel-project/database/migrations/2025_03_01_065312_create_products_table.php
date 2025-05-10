<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('products', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->string('asset_number');
        $table->unsignedBigInteger('vendor_id');
        $table->string('vendor_name');
    
        $table->unsignedBigInteger('category_id');
        $table->unsignedBigInteger('major_id');   // Put after category_id
        $table->unsignedBigInteger('minor_id');   // Put after major_id
    
        $table->decimal('asset_cost', 10, 2);
        $table->date('date_added');
        $table->string('deprn_method_code');
        $table->decimal('original_cost', 10, 2);
        $table->decimal('current_cost', 10, 2);
        $table->decimal('accumulated_deprn', 10, 2);
        $table->decimal('deprn_amount', 10, 2);
        $table->decimal('ytd_deprn', 10, 2);
        $table->string('period_name');
        $table->integer('quantity');
        $table->integer('life_in_months');
        $table->string('description');
        $table->string('cost_account_description');
        $table->string('accumulated_account_description');
    
        $table->timestamps();
    });
    
}


public function down()
{
    Schema::table('products', function (Blueprint $table) {
        $table->dropForeign(['category_id']); // Drop foreign key first
        $table->dropForeign(['major_id']);
        $table->dropForeign(['minor_id']);
    });

    Schema::dropIfExists('products'); // Then drop the table
}
};
