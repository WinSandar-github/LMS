<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::post('/saveTblCompany', array('middleware' => 'cors', 'uses' => 'RegisterController@saveTblCompany'));
Route::post('/loginValidate', array('middleware' => 'cors', 'uses' => 'CompanyLoginController@loginValidate'));
Route::post('createCity',array('middleware'=>'cors','uses'=>'CityController@createCity'));
Route::post('getCity',array('middleware'=>'cors','uses'=>'CityController@getCity'));
Route::post('getCityInfo',array('middleware'=>'cors','uses'=>'CityController@getCityInfo'));
Route::post('updateCity',array('middleware'=>'cors','uses'=>'CityController@updateCity'));
Route::post('deleteCity',array('middleware'=>'cors','uses'=>'CityController@deleteCity'));
//For Unit CRUD
Route::post('createUnit',array('middleware'=>'cors','uses'=>'UnitController@createUnit'));
Route::post('getUnit',array('middleware'=>'cors','uses'=>'UnitController@getUnit'));
Route::post('showUnitInfo',array('middleware'=>'cors','uses'=>'UnitController@showUnitInfo'));
Route::post('updateUnit',array('middleware'=>'cors','uses'=>'UnitController@updateUnit'));
Route::post('deleteUnit',array('middleware'=>'cors','uses'=>'UnitController@deleteUnit'));



