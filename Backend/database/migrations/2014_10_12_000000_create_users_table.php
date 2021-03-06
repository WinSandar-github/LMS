<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('display_name',64);
            $table->string('full_name',64);
            $table->string('email',125)->unique();
            $table->string('password',125);
            $table->string('nrc_passport',125);
            $table->string('phone_no',20);
            $table->string('address',125);
            $table->date('birthday');
            $table->string('avatar',255);
            $table->string('gender',255);
            $table->string('role',255);
            $table->string('api_key',225);
            $table->bigInteger('company_id');
            $table->timestamps();
        });
        Artisan::call('db:seed',[
               '--class' => UserSeeder::class
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
