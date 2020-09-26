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
    protected $header = array(
					'Content-Type' => 'application/json; charset=UTF-8',
					'charset' => 'utf-8');
    protected $successMessage=array('message'=>'success.');
    protected $errorMessage=array('message'=>'there is error occur.');
    protected $dataMessage=array('message'=>'there is no data.');
    
    public function createCity(Request $request)
	{
        try{
            $city=new tbl_city_list();
            $city->city_name=$request->input("cityName");
            $city->company_id=$request->input("companyId");
            $city->save();
            return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
           
        }catch (\Exception $e) {
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
			
	}
    public function getCity(Request $request)
	{
        $cityList = tbl_city_list::where("company_id","=",$request->input("companyId"))->get();
        if(sizeof($cityList)){
            return response()->json($cityList, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
        }
		
	}
    public function getCityInfo(Request $request)
	{
         $city = tbl_city_list::find($request->input("cityId"));
         if(empty($city)){
            return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($city, 200, $this->header, JSON_UNESCAPED_UNICODE);
         }
	
	}
    public function updateCity(Request $request)
	{
        try{
            $city = tbl_city_list::find($request->input("cityId"));
		    $city->city_name = $request->input("cityName");
            $city->save();
            return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
	}
    public function deleteCity(Request $request)
	{
        $city = tbl_city_list::find($request->input("cityId"));
        if($city->delete()){
             return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
	}
}
