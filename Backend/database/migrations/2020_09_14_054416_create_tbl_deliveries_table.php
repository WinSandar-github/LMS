<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblDeliveriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_delivery', function (Blueprint $table) {
            $table->id();
            $table->string('depart_from',125);
            $table->string('depart_to',125);
            $table->date('start_dt');
            $table->date('end_dt');
            $table->integer('arrived');
            $table->string('driver_name',45);
            $table->string('driver_phone',20);
            $table->string('car_no',20);
            $table->string('remark',225);
            $table->integer('status');
            $table->bigInteger('order_id');
            $table->bigInteger('user_id');
            $table->bigInteger('company_id');
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
        Schema::dropIfExists('tbl_delivery');
    }
}
