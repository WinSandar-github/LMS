<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameCityInGoodreceiptTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tbl_good_receipt', function (Blueprint $table) {
             $table->renameColumn('city', 'city_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tbl_good_receipt', function (Blueprint $table) {
             $table->renameColumn('city_id', 'city');
        });
    }
}
