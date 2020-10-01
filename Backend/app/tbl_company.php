<?php

namespace App;


use Illuminate\Database\Eloquent\Model;
class tbl_company extends Model
{
    protected $table = 'tbl_company';
    protected $primaryKey = 'id';
    public function users()
    {
        return $this->hasOne('App\User','company_id');
    }
    public function delivery()
    {
        return $this->hasMany('App\tbl_delivery','id');
    }
}
