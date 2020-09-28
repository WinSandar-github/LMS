<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditDatatypeVarcharToIntegerForUnitInGoodreceiptdetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tbl_good_receipt_details', function (Blueprint $table) {
             $table->bigInteger('unit')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tbl_good_receipt_details', function (Blueprint $table) {
            //
        });
    }
}
