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
    protected $header = array (
					'Content-Type' => 'application/json; charset=UTF-8',
					'charset' => 'utf-8');
    protected $successMessage=array('message'=>'success.');
    protected $errorMessage=array('message'=>'there is error occur.');
    protected $dataMessage=array('message'=>'there is no data.');
    
     public function createCity(Request $request)
	{
    
		$city=new tbl_city_list();
        $city->city_name=$request->input("city_name");
        $city->company_id=$request->input("company_id");
        if($city->save()){
          return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }
        else{
          return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }

		
	}
     public function getTblCity(Request $request)
	{
		 $city_list = tbl_city_list::where("company_id","=",$request->input("company_id"))->get();
         if(sizeof($city_list)){
            return response()->json($city_list, 200, $this->header, JSON_UNESCAPED_UNICODE);
         }
         else{
             return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
         }
		
		
	}
    public function getCityInfo(Request $request)
	{
	    $city = tbl_city_list::find($request->input("city_id"));
        if(empty($city)){
           return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
        }
        else{
          return response()->json($city, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }
      
		

	}
    public function updateTblCity(Request $request)
	{
		$city = tbl_city_list::find($request->input("city_id"));
		$city->city_name = $request->input("city_name");
		if($city->save()){
          return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }
        else{
          return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
	}
    public function deleteTblCity(Request $request)
	{
		$city = tbl_city_list::find($request->input("city_id"));
		if($city->delete()){
          return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }
        else{
          return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
	}
}
