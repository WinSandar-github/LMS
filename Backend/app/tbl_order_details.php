<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_order_details extends Model
{
  protected $table = 'tbl_order_details';
  public function order()
  {
      return $this->belongsTo('App\tbl_order','id');
  }
  public function unitByorderDetail()
  {
     return $this->belongsTo('App\tbl_unit','unit');
  }

}
