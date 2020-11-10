<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

      User::create([
          'full_name' => 'admin',
          'email' => 'admin@agga.io',
          'password' => Hash::make('admin1234'),
          'phone_no' =>'09-12345678',
          'address'=>'yangon',
          'company_id'=>'1',
          'api_key'=>Str::random(40),
      ]);

    }
}
