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
       $company_name=$request->input('name');
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
       $company->name=$request->input('name');
       $company->address=$request->input('address');
       $company->phone=$request->input('phone');
       $file_ext=$request->input('ext');
       $company->email=$request->input('email');
       $company->ref_initials = strtoupper($ref_initials);
       $company->save();
       $file_name=$company->id.".".$file_ext;
       $request->file('logo')->storeAs('public/company_logo',$file_name);
       $company->logo=$file_name;
       $company->save();

       $user=new User();
       $user->full_name=$request->input('full_name');
       $user->phone_no=$request->input('phone');
       $user->address=$request->input('address');
       $user->company_id=$company->id;
       $user->email=$request->input('email');
       $user->password=Hash::make($request->input('password'));
       $user->api_key=str_random(40);
       $user->save();
      return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
   }catch (\Exception $e){
     return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getCompany(Request $request)
  {
      $company = tbl_company::with('user')
                            ->where('id','=',$request->input("company_id"))
                            ->get();
      if(sizeof($company)){
          return response()->json($company,200, config('common.header'),JSON_UNESCAPED_UNICODE);
      }
      else{
          return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
  }
  public function updateCompany(Request $request)
  {
    if($request->input("company_id")){
        try{
            $updateCompany = tbl_company::find($request->input("company_id"));
            $string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $company_name=$request->input('name');
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
            $updateCompany->name=$request->input('name');
            $updateCompany->address=$request->input('address');
            $updateCompany->phone=$request->input('phone');
            $file_ext=$request->input('ext');
            $newfile=$ref_initials.".".$file_ext;
            $oldfile= $request->input('logo');
            if($oldfile==$newfile){
              $updateCompany->logo=$oldfile;
            }else{
              $updateCompany->logo=$newfile;
              Storage::move('public/company_logo/'.$oldfile, 'public/company_logo/'.$newfile);
            }
            $updateCompany->ref_initials = strtoupper($ref_initials);
            $updateCompany->save();

            if($request->input('address') || $request->input('phone')){
              $updateUser=User::find($request->input("company_id"));
              $updateUser->phone_no=$request->input('phone');
              $updateUser->address=$request->input('address');
              $updateUser->save();
            }else{
              $updateUser=User::find($request->input("company_id"));
              $updateUser->phone_no=$request->input('phone');
              $updateUser->address=$request->input('address');
              $updateUser->save();
            }
            return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }else{
        try{
            $updateCompanyByLogo = tbl_company::find($request->input("companyId"));
            $file_name=$request->input("companyId").".".$request->input('ext');
            $request->file('logo')->storeAs('public/company_logo',$file_name);
            $updateCompanyByLogo->logo=$file_name;
            $updateCompanyByLogo->save();
            return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
  }

}
 ?>
