<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use File;
use Hash;
use DateTime;
use Session;
use App\tbl_company;
use App\tbl_users;
class RegisterController extends Controller{
  public function saveTblCompany(Request $request)
  {

            $company=new tbl_company();
           $company->name=$request->input('companyname');
           $company->address=$request->input('companyaddress');
           $company->description=$request->input('description');
           $company->city=$request->input('city');
           $company->state=$request->input('state');
           $company->zipcode=$request->input('zip_code');
           $company->phone=$request->input('txt_phone');
           $file_ext=$request->input('ext');

             foreach($request->file('img') as $file)

            {
              $name=$file->getClientOriginalName();
              $file->storeAs('public/images', $name);
				      $data= $name;
            }

             $company->logo=$data;
             $company->save();

            $user=new tbl_users();
            $user->display_name=$request->input('txt_name');
            $user->full_name=$request->input('txt_name');
            $user->nrc_passport=$request->input('nrc_passport');
            $user->phone_no=$request->input('txt_phone');
            $user->address=$request->input('companyaddress');
            $user->birthday=$request->input('birthday');
            $user->avatar=$request->input('avatar');
            $user->gender=$request->input('gender');
            $user->role=$request->input('txt_type');
            $user->company_id=$company->id;
            $user->email=$request->input('txt_email');
            $user->password=$request->input('txt_password');
            $user->save();

            return 1;
  }
}
 ?>
