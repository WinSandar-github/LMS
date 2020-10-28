<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\User;
use App\tbl_company;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      tbl_company::create([
          'id'=>'1',
          'name' => 'admincompany',
          'email' => 'admin@gmail.com',
          'phone' =>'09-111111111',
          'address'=>'yangon',
          'ref_initials'=>'ADM',
      ]);
      User::create([
          'full_name' => 'admin',
          'email' => 'admin@gmail.com',
          'password' => Hash::make('12345678'),
          'phone_no' =>'09-12345678',
          'address'=>'yangon',
          'company_id'=>'1',
          'api_key'=>Str::random(40),
      ]);

    }
}
