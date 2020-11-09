<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_company', function (Blueprint $table) {
            $table->id();
            $table->string('name',45);
            $table->string('description',255);
            $table->string('address',125);
            $table->string('city',45);
            $table->string('state',45);
            $table->integer('zipcode');
            $table->string('logo',225);
            $table->string('phone',50);
            $table->string('email',125)->unique();
            $table->string('ref_initials',10);
            $table->timestamps();
        });
        Artisan::call('db:seed',[
            '--class' => CompanySeeder::class
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_company');
    }
}
