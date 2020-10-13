<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Arr;
use File;
use Hash;
use DateTime;
use Session;
use Auth;
use DB;
use App\tbl_company;
use App\User;
class CompanyLoginController extends Controller
{
	public function loginValidate(Request $request)
	{
		$user_data = json_decode($request->getContent(), true);
	  $email = $user_data['email'];
		$password = $user_data['password'];
		$data=  array(
			'email' => $email,
			'password' => $password
		);
		if(auth::attempt($data))
			{
				$companyUser = tbl_company::with('user')->where('id','=',auth::user()->company_id)->get();

				if(sizeof($companyUser)){
					return response()->json($companyUser, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
				}
				else{

				    return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
			    }
			}
    }
    public function resetPassword(Request $request){
        $userByemail=User::where('email', request('Username'))->first();
        $userByName=User::where('full_name', request('Username'))->first();
        if($userByemail){
            return $this->updatePassword($userByemail,request('password'));
        }
        else if($userByName){
            return $this->updatePassword($userByName,request('password'));
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function updatePassword($user,$password){
        try{
            $user->password=Hash::make(request('password'));
            $user->save();
            $company = tbl_company::with('user')->where('id','=',$user->company_id)->get();
            return response()->json($company, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e){
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
     }
}
?>
