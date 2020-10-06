<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_delivery_details extends Model
{
  protected $table = 'tbl_delivery_details';
  public function delivery()
  {
      return $this->belongsTo('App\tbl_delivery','id');
  }


}
