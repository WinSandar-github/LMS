<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblStatementCarListsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_statement_car_list', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('car_no',30);
            $table->bigInteger('total_price');
            $table->bigInteger('commission');
            $table->bigInteger('commission_value');
            $table->bigInteger('labour');
            $table->bigInteger('advance');
            $table->bigInteger('land');
            $table->bigInteger('final_price');
            $table->bigInteger('cash_total');
            $table->bigInteger('all_total');
            $table->integer('status');
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
        Schema::dropIfExists('tbl_statement_car_list');
    }
}
