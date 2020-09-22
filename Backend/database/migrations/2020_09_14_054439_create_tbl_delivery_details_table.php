<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblDeliveryDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_delivery_details', function (Blueprint $table) {
            $table->id();
            $table->string('to_city_name',250);
            $table->bigInteger('good_receipt_id');
            $table->bigInteger('good_receipt_detail_id');
            $table->string('receiver_name',255);
            $table->string('product_name',255);
            $table->bigInteger('quantity');
            $table->bigInteger('total_quantity');
            $table->string('weight',50);
            $table->string('remark',225);
            $table->bigInteger('delivery_id');
            $table->bigInteger('user_id');
            $table->bigInteger('company_id');
            $table->bigInteger('order_details_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_delivery_details');
    }
}
