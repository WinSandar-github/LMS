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

Route::post('saveCompany', array('middleware' => 'cors', 'uses' => 'RegisterController@saveCompany'));
Route::post('updateCompany', array('middleware' => 'cors', 'uses' => 'RegisterController@updateCompany'));
Route::post('loginValidate', array('middleware' => 'cors', 'uses' => 'CompanyLoginController@loginValidate'));
//for delivery
Route::post('saveDelivery', array('middleware' => 'cors', 'uses' => 'DeliveryController@saveDelivery'));
Route::post('getDelivery', array('middleware' => 'cors', 'uses' => 'DeliveryController@getDelivery'));
Route::post('getDeliverDetailsByDeliveryId', array('middleware' => 'cors', 'uses' => 'DeliveryController@getDeliverDetailsByDeliveryId'));
Route::post('updateDelivery', array('middleware' => 'cors', 'uses' => 'DeliveryController@updateDelivery'));
Route::post('deleteDelivery', array('middleware' => 'cors', 'uses' => 'DeliveryController@deleteDelivery'));
Route::post('getDeliveryByStatus', array('middleware' => 'cors', 'uses' => 'DeliveryController@getDeliveryByStatus'));
Route::post('getDeliveryById', array('middleware' => 'cors', 'uses' => 'DeliveryController@getDeliveryById'));
//for deliverdetails
Route::post('saveDeliverDetail', array('middleware' => 'cors', 'uses' => 'DeliveryController@saveDeliverDetail'));
Route::post('updateDeliverDetail', array('middleware' => 'cors', 'uses' => 'DeliveryController@updateDeliverDetail'));
Route::post('deleteDeliverDetail', array('middleware' => 'cors', 'uses' => 'DeliveryController@deleteDeliverDetail'));
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
//For Goodreceipt CRUD
Route::post('createGoodRecipt',array('middleware'=>'cors','uses'=>'GoodreceiptController@createGoodRecipt'));
Route::post('getGoodReceipt/{imcompleteOrderStatus}',array('middleware'=>'cors','uses'=>'GoodreceiptController@getGoodReceipt'));
Route::post('showGoodReceiptInfo',array('middleware'=>'cors','uses'=>'GoodreceiptController@showGoodReceiptInfo'));
Route::post('updateGoodReceipt',array('middleware'=>'cors','uses'=>'GoodreceiptController@updateGoodReceipt'));
Route::post('deleteGoodReceipt',array('middleware'=>'cors','uses'=>'GoodreceiptController@deleteGoodReceipt'));
//For Goodreceiptdetail CRUD
Route::post('createGoodReciptDetails',array('middleware'=>'cors','uses'=>'GoodreceiptController@createGoodReciptDetails'));
Route::post('getGoodReceiptDetail',array('middleware'=>'cors','uses'=>'GoodreceiptController@getGoodReceiptDetail'));
Route::post('getGoodReceiptInvoice',array('middleware'=>'cors','uses'=>'GoodreceiptController@getGoodReceiptInvoice'));
Route::post('showGoodReceiptDetailInfo',array('middleware'=>'cors','uses'=>'GoodreceiptController@showGoodReceiptDetailInfo'));
Route::post('updateGoodReceiptDetail',array('middleware'=>'cors','uses'=>'GoodreceiptController@updateGoodReceiptDetail'));
Route::post('deleteGoodReceiptDetail',array('middleware'=>'cors','uses'=>'GoodreceiptController@deleteGoodReceiptDetail'));
//for invoice
Route::post('getCompanyInfoBydeliveryId',array('middleware'=>'cors','uses'=>'DeliveryController@getCompanyInfoBydeliveryId'));
Route::post('getInvoiceDetailsBydeliveryId',array('middleware'=>'cors','uses'=>'DeliveryController@getInvoiceDetailsBydeliveryId'));
Route::post('getInvoiceDetailsByorderId',array('middleware'=>'cors','uses'=>'DeliveryController@getInvoiceDetailsByorderId'));
//for GoodInOut
Route::post('getGoodInOutByCompanyId',array('middleware'=>'cors','uses'=>'GoodInOutController@getGoodInOutByCompanyId'));
Route::post('getInvoiceDetailsByorderNo',array('middleware'=>'cors','uses'=>'DeliveryController@getInvoiceDetailsByorderNo'));
Route::post('getCompanyDetailBydeliveryId',array('middleware'=>'cors','uses'=>'DeliveryController@getCompanyDetailBydeliveryId'));
//for statementcarlist
Route::post('saveStatementCarList',array('middleware'=>'cors','uses'=>'StatementCarListController@saveStatementCarList'));
//For Order
Route::post('createOrder',array('middleware'=>'cors','uses'=>'OrderController@createOrder'));
Route::post('getOrder/{deliveryStatus}',array('middleware'=>'cors','uses'=>'OrderController@getOrder'));
Route::post('getOrderDetail',array('middleware'=>'cors','uses'=>'OrderController@getOrderDetail'));
Route::post('deleteOrder',array('middleware'=>'cors','uses'=>'OrderController@deleteOrder'));
//for order by companyId
Route::post('getOrderNoBycompanyId', array('middleware' => 'cors', 'uses' => 'DeliveryController@getOrderNoBycompanyId'));
//for goodReceipt by orderNo
Route::post('getGoodReceiptByorderNo', array('middleware' => 'cors', 'uses' => 'DeliveryController@getGoodReceiptByorderNo'));
//for orderstatus by orderId
Route::post('updateOrderStatusByorderId', array('middleware' => 'cors', 'uses' => 'DeliveryController@updateOrderStatusByorderId'));
//for get orderdetail by orderno
Route::post('getOrderDetailsByorderNo', array('middleware' => 'cors', 'uses' => 'DeliveryController@getOrderDetailsByorderNo'));
//for update order by orderId
Route::post('updateOrderByorderId', array('middleware' => 'cors', 'uses' => 'DeliveryController@updateOrderByorderId'));
//For vipCustomer
Route::post('getVipCustomer',array('middleware'=>'cors','uses'=>'GoodreceiptController@getVipCustomer'));
Route::post('getVipCustomerInfo',array('middleware'=>'cors','uses'=>'GoodreceiptController@getVipCustomerInfo'));
//for get statementcarlist
Route::post('getStatmentCarList',array('middleware'=>'cors','uses'=>'StatementCarListController@getStatmentCarList'));

//For user
Route::post('createUser',array('middleware'=>'cors','uses'=>'UserController@createUser'));
Route::post('getUser',array('middleware'=>'cors','uses'=>'UserController@getUser'));
Route::post('showUserInfo',array('middleware'=>'cors','uses'=>'UserController@showUserInfo'));
Route::post('updateUser',array('middleware'=>'cors','uses'=>'UserController@updateUser'));
Route::post('deleteUser',array('middleware'=>'cors','uses'=>'UserController@deleteUser'));
//For rule
Route::post('getRule',array('middleware'=>'cors','uses'=>'RuleController@getRule'));
Route::post('createRule',array('middleware'=>'cors','uses'=>'RuleController@createRule'));
Route::post('showRuleDetail',array('middleware'=>'cors','uses'=>'RuleController@showRuleDetail'));
Route::post('updateRule',array('middleware'=>'cors','uses'=>'RuleController@updateRule'));
Route::post('deleteRule',array('middleware'=>'cors','uses'=>'RuleController@deleteRule'));
//For Password Reset
Route::post('resetPassword', array('middleware' => 'cors', 'uses' => 'CompanyLoginController@resetPassword'));
Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
?>
