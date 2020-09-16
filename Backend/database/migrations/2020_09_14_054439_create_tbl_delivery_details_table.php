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
            $table->string('depart_to',50);
            $table->bigInteger('product_id');
            $table->bigInteger('quantity');
            $table->string('weight',50);
            $table->string('remark',225);
            $table->bigInteger('delivery_id');
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
