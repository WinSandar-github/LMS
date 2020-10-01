<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetDefaultValuesInOrderdetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::table('tbl_order_details', function (Blueprint $table) {
            $table->integer('product_qty')->default(0)->change();
            $table->integer('unit_price')->default(0)->change();
            $table->integer('product_weight')->default(0)->change();
            $table->integer('remark')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tbl_order_details', function (Blueprint $table) {
            //
        });
    }
}
