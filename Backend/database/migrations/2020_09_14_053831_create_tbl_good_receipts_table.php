<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblGoodReceiptsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_good_receipt', function (Blueprint $table) {
            $table->id();
            $table->string('sender_name',125);
            $table->string('order_no',125);
            $table->string('phone_no',20);
            $table->string('remark',225);
            $table->string('attachment',225);
            $table->integer('status');
            $table->integer('cash_method');
            $table->string('city',45);
            $table->string('address',125);
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
        Schema::dropIfExists('tbl_good_receipt');
    }
}
