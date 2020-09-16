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
     public function save_tbl_city(Request $request)
	{
    
		$city=new tbl_city_list();
        $city->city_name=$request->input("city_name");
        $city->company_id=$request->input("company_id");
        $city->save();
        return "1";
		
	}
     public function get_tbl_city(Request $request)
	{	
		 $city_list = tbl_city_list::where("company_id","=",$request->input("company_id"))->get();
		 $header = array (
					'Content-Type' => 'application/json; charset=UTF-8',
					'charset' => 'utf-8');

		 return response()->json($city_list, 200, $header, JSON_UNESCAPED_UNICODE);
		
	}
    public function get_tbl_city_by_id(Request $request)
	{
	    $city = tbl_city_list::find($request->input("city_id"));
	    $header = array (
				    'Content-Type' => 'application/json; charset=UTF-8',
				    'charset' => 'utf-8');

        return response()->json($city, 200, $header, JSON_UNESCAPED_UNICODE);

	}
    public function update_tbl_city(Request $request)
	{
		$city = tbl_city_list::find($request->input("city_id"));
		$city->city_name = $request->input("city_name");
		$city->save();
		return 1;
	}
    public function delete_tbl_city(Request $request)
	{
		$city = tbl_city_list::find($request->input("city_id"));
		$city->delete();
		return "1";
	}
}
