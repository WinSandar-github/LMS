<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblGoodReceiptDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_good_receipt_details', function (Blueprint $table) {
            $table->id();
            $table->string('product_name',125);
            $table->decimal('qty', 20, 2);
            $table->string('unit',50);
            $table->string('remark',250);
            $table->string('weight',50);
            $table->bigInteger('good_receipt_id');
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
        Schema::dropIfExists('tbl_good_receipt_details');
    }
}
