var HOST = process.env.VUE_APP_URL
// var HOST = "/api";
export default {
  HOST,
  /**
     * @method GET
     * @params banner
     * @return {"status":200, "msg":"success"}
     */
  // 富文本
  getPrivacyAgreementById: HOST + '/sys/muban/getRichById', // 富文本

  getMallClassIndex: HOST + '/app/tMallClass/getMallClassIndex', // 查询分类
  getMallGoodList: HOST + '/app/tMallGoods/getMallGoodList', // 查询商品列表
  getMallGoodById: HOST + '/app/tMallGoods/getMallGoodById', // 查询商品详情
  buyGoodById: HOST + '/app/tMallGoodsLog/buyGood', // 兑换商品
  orderList: HOST + '/app/tMallGoodsLog/listApp', // 兑换商品列表
  messageList: HOST + '/sys/muban/getMessageList', // 兑换商品列表
  getUserData: HOST + '/sys/user/getUserData', // 获取用户信息
  userList: HOST + '/system/tAppCustomerServiceUser/userList',
  selectUserType: HOST + '/system/tAppCustomerServiceUser/selectUserType',
  upload: HOST + '/sys/common/upload',
  sendCode: HOST + '/sys/user/randomCacheCode',
  getDictItemSingle: HOST + '/sys/dict/getDictTextSigle',
  changeLiveUser: HOST + '/system/tAppCustomerService/appUserAddCustomerServiceByPhone',
  addUser: HOST + '/sys/user/add',
  getUserInfo: HOST + '/sys/user/getUserInfo',
  changePassword: HOST + '/sys/user/changePassword',
  updateUserStatus: HOST + '/sys/user/frozenBatch',
  editIntegral: HOST + '/sys/user/editIntegral',
  loginLogList: HOST + '/sys/log/list',
  liveLogList: HOST + '/system/tAppLiveLog/list',
  selectTAppLiveLogStatistics: HOST + '/system/tAppLiveLog/selectTAppLiveLogStatistics',
  goodLogList: HOST + '/app/tMallGoodsLog/list',
  editGoodLog: HOST + '/app/tMallGoodsLog/edit',
  changeLivePassword: HOST + '/sys/user/changeLivePassword'

}
