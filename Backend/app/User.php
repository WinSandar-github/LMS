<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'full_name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    protected $table = 'users';
    public function goodReceipt()
    {
        return $this->hasMany('App\tbl_good_receipt');
    }
    public function order()
    {
        return $this->hasMany('App\tbl_order');
    }
     public function company()
    {
        return $this->belongsTo('App\tbl_company','id');
    }
    public function delivery()
    {
        return $this->hasMany('App\tbl_delivery','id');
    }
    
}
