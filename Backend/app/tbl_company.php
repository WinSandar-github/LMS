<?php

namespace App;
use Illuminate\Database\Eloquent\Model;
class tbl_company extends Model
{
  protected $table = 'tbl_company';
  public function user()
  {
      return $this->hasOne('App\User','company_id');
  }

}
