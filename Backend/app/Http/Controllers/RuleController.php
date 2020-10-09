<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\tbl_rule;

class RuleController extends Controller
{
     public function getRule(Request $request)
     {
           $rule = tbl_rule::where("company_id","=",request("companyId"))
                            ->get();
           if(sizeof($rule)){
                return response()->json($rule, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
           }
           else{
               return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
           }
     }
     public function createRule(Request $request)
     {
          try{
                $Data = json_decode($request->getContent(), true);
                for($rule = 0; $rule < count($Data); $rule++) {
                  $ruleData=new tbl_rule();
                  $ruleData->description=$Data[$rule]["description"];
                  $ruleData->company_id=$Data[$rule]["companyId"];
                  $ruleData->save();
                }
                return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
          }catch (\Exception $e) {
                return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
          }
     }
    public function showRuleDetail(Request $request)
    {
         $rule = tbl_rule::find(request("ruleId"));
         if(empty($rule)){
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($rule, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
    public function updateRule(Request $request)
	{
        try{
            $rule = tbl_rule::find(request("ruleId"));
            $rule->description=request("description");
            $rule->save();
            return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
    public function deleteRule(Request $request)
	{
        $rule = tbl_rule::find(request("ruleId"));
        if($rule->delete()){
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
}
