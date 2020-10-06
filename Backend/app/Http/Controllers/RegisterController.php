<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use File;
use Hash;
use DateTime;
use Session;
use App\tbl_company;
use App\User;
class RegisterController extends Controller
{
  public function saveCompany(Request $request)
  {
    try{
       $string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
       $company_name=$request->input('companyname');
       $com_len=strlen($company_name);
       if($com_len==1){
         $str = str_shuffle($string);
         $ref_initials=$company_name[0].(substr($str,0,2));
         }
       else if($com_len==2){
         $str = str_shuffle($string);
         $ref_initials=$company_name[0].$company_name[1].(substr($str,0,1));
       }
       else{
         $ref_initials=$company_name[0].$company_name[1].$company_name[2];
       }
       $company=new tbl_company();
       $company->name=$request->input('companyname');
       $company->address=$request->input('companyaddress');
       $company->phone=$request->input('txt_phone');
       $file_ext=$request->input('ext');
       $file_name=$ref_initials.".".$file_ext;
       $request->file('img')->storeAs('public/company_logo',$file_name);
       $company->logo=$file_name;
       $company->ref_initials = strtoupper($ref_initials);
       $company->save();

       $user=new User();
       $user->display_name=$request->input('txt_name');
       $user->full_name=$request->input('txt_name');
       $user->phone_no=$request->input('txt_phone');
       $user->address=$request->input('companyaddress');
       $user->company_id=$company->id;
       $user->email=$request->input('txt_email');
       $user->password=Hash::make($request->input('txt_password'));
       $user->api_key=str_random(40);
       $user->save();
      return response()->json(config('common.successMessage'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
   }catch (\Exception $e){
     return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
}
 ?>
