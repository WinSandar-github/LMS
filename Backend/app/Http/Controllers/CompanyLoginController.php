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
			$user = tbl_company::with('users')->where('id','=',auth::user()->company_id)->get();

			if(sizeof($user)){
				return response()->json($user, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
			}
			else{
                        
			    return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
		    }
		}
    }
}
?>
