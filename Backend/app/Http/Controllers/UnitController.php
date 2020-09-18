<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\tbl_unit;

class UnitController extends Controller
{
    protected $header = array(
					'Content-Type' => 'application/json; charset=UTF-8',
					'charset' => 'utf-8');
    protected $successMessage=array('message'=>'success.');
    protected $errorMessage=array('message'=>'there is error occur.');
    protected $dataMessage=array('message'=>'there is no data.');

    public function createUnit(Request $request)
	{
        try{
            $unit=new tbl_unit();
            $unit->unit_name=$request->input("unit_name");
            $unit->company_id=$request->input("company_id");
            $unit->save();
            return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
           
        }catch (\Exception $e) {
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
			
	}
    public function getUnit(Request $request)
	{
        try{
            $unit = tbl_unit::where("company_id","=",$request->input("company_id"))->get();
            if(sizeof($unit)){
                return response()->json($unit, 200, $this->header, JSON_UNESCAPED_UNICODE);
            }
            else{
                return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
            }
        }catch (\Exception $e) {
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
		
	}
    public function showUnitInfo(Request $request)
	{
         try{
             $unit = tbl_unit::find($request->input("unit_id"));
             if(empty($unit)){
                return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
             }
             else{
                return response()->json($unit, 200, $this->header, JSON_UNESCAPED_UNICODE);
             }
         }catch (\Exception $e) {
             return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
         }
	
	}
    public function updateUnit(Request $request)
	{
        try{
            $unit = tbl_unit::find($request->input("unit_id"));
		    $unit->unit_name = $request->input("unit_name");
            $unit->save();
            return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
	}
    public function deleteUnit(Request $request)
	{
        try{
            $unit = tbl_unit::find($request->input("unit_id"));
            $unit->delete();
            return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
	}
   
}
