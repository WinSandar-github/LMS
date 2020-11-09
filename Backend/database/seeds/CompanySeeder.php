<?php

use Illuminate\Database\Seeder;
use App\tbl_company;
class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        tbl_company::create([
          'name' => 'company',
          'email' => 'admin@agga.io',
          'phone' =>'09-111111111',
          'address'=>'yangon',
          'ref_initials'=>'ADM',
      ]);
    }
}
