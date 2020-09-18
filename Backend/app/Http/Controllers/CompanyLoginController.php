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
protected $header = array ('Content-Type' => 'application/json; charset=UTF-8','charset' => 'utf-8');
protected $successMessage=array('message'=>'success.');
protected $errorMessage=array('message'=>'there is error occur.');
protected $dataMessage=array('message'=>'there is no data.');
public function loginValidate(Request $request)
	{

		try{
			$user_data = json_decode($request->getContent(), true);
			$email = $user_data['email'];
			$password = $user_data['password'];
			$data=  array(
				'email' => $email,
				'password' => $password
			);
			if(auth::attempt($data))
				{
						$user = auth::user();
						$company_id=$user->company_id;

						$get_data = DB::table('users')
											->join('tbl_company', 'company_id', '=', 'tbl_company.id')
											->where('users.company_id','=',$company_id)
											->where('tbl_company.id','=',$company_id)
					          	->select('users.*', 'tbl_company.*')
											->get();
						if(sizeof($get_data)){
					        return response()->json($get_data, 200, $this->header, JSON_UNESCAPED_UNICODE);
					      }
					  else{
					      return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
							}
					}
				}catch (\Exception $e) {
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
					}
  }
}
?>
