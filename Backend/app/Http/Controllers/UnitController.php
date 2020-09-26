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
  public function createUnit(Request $request)
	{
        try{
            $unit=new tbl_unit();
            $unit->unit_name=$request->input("unitName");
            $unit->company_id=$request->input("companyId");
            $unit->save();
            return response()->json(config('common.successMessage'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
  public function getUnit(Request $request)
	{   
        $unit = tbl_unit::where("company_id","=",$request->input("companyId"))->get();
        if(sizeof($unit)){
            return response()->json($unit, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function showUnitInfo(Request $request)
	{
         $unit = tbl_unit::find($request->input("unitId"));
         if(empty($unit)){
            return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($unit, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
  public function updateUnit(Request $request)
	{
        try{
            $unit = tbl_unit::find($request->input("unitId"));
		    $unit->unit_name = $request->input("unitName");
            $unit->save();
            return response()->json(config('common.successMessage'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
  public function deleteUnit(Request $request)
	{
        $unit = tbl_unit::find($request->input("unitId"));
        if($unit->delete()){
           return response()->json(config('common.successMessage'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);}
        else{
             return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        } 
	}
}
?>
