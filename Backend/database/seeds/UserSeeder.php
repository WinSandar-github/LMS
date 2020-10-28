<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
          'email' => 'admin@gmail.com',
          'password' => Hash::make('12345678'),
          'phone' =>'09-111111111',
          'address'=>'yangon',
      ]);
      tbl_company::create([
          'name' => 'admincompany',
          'email' => 'admin@gmail.com',
          'phone' =>'09-111111111',
          'address'=>'yangon',
      ]);
    }
}
