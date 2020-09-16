<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_users extends Model
{
  protected $table = 'tbl_users';
  protected $primaryKey = 'id';
  protected $fillable=['full_name','email','password','created_at','updated_at'];
}
