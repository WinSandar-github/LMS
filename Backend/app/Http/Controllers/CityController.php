<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\tbl_city_list;

class CityController extends Controller
{
     public function saveTblCity(Request $request)
	{
		$city=new tbl_city_list();
        $city->city_name=$request->input("city_name");
        $city->save();
        return "1";
		
	}
}
