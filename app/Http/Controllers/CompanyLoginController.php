<?php
namespace App\Http\Controllers;

use DB;

use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use File;
use Hash;
use DateTime;
use Session;
use Auth;
use Mail;
use App\tbl_company;
use App\tbl_users;
use App\User;
class CompanyLoginController extends Controller
{

public function loginValidate(Request $request)
	{
    $user_data = json_decode($request->getContent(), true);

		$user=tbl_users::where('email','=',$user_data['email'] )
					->where('password','=',$user_data['password'])

					->get();


			$header = array (
								'Content-Type' => 'application/json; charset=UTF-8',
								'charset' => 'utf-8');

			return response()->json($user, 200, $header, JSON_UNESCAPED_UNICODE);
  }
	}
 ?>
