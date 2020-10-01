<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_order extends Model
{
    protected $table = 'tbl_order';
     public function userByOrder()
    {
        return $this->belongsTo('App\User','user_id');
    }
}
