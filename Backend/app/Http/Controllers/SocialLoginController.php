<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\tbl_company;
use App\User;

class SocialLoginController extends Controller
{
    public function createCompanyByGoogle(Request $request)
	{
        try{
            $getCompany=tbl_company::where('email',"=",$request->email)->first();
            if($getCompany){
                  $companyUser = tbl_company::with('user')->where('id','=',$getCompany->id)->get();
                  return response()->json($companyUser, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
           else{
                $company=new tbl_company();
                $company->email=$request->email;
                $company->save();
                $user=new User();
                $user->full_name=$request["name"];
                $user->email =$request["email"];
                $user->company_id=$company->id;
                $user->save();
                $companyUser = tbl_company::with('user')->where('id','=',$company->id)->get();
                return response()->json($companyUser, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
           }
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
       
    }
}
