<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_delivery extends Model
{
  protected $table = 'tbl_delivery';
  public function user()
  {
      return $this->belongsTo('App\User','user_id');
  }
  public function companyDelivery()
  {
      return $this->belongsTo('App\tbl_company','company_id');
  }
  public function deliveryDetails()
  {
      return $this->hasMany('App\tbl_delivery_details','delivery_id');
  }

}
