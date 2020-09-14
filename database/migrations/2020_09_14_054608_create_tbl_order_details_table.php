<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblOrderDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_order_details', function (Blueprint $table) {
            $table->id();
            $table->string('product_name',125);
            $table->decimal('quantity',20, 2);
            $table->decimal('product_qty',20,2);
            $table->string('unit',50);
            $table->bigInteger('unit_price');
            $table->bigInteger('product_price');
            $table->string('weight',125);
            $table->string('product_weight',125);
            $table->string('remark',250);
            $table->bigInteger('total');
            $table->bigInteger('order_id');
            $table->bigInteger('user_id');
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
        Schema::dropIfExists('tbl_order_details');
    }
}
