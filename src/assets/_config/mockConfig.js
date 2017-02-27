
// 模拟请求 模拟数据 对应表
module.exports ={
  "front/sh/QRCodeimg":{
    "001":"QRCodeimg.json"   //活动二维码接口
  },
  "front/sh/user": "user.json",//用户信息模拟json
  "front/sh/user!session":{
  	"u001":"loginSession.json"
  },
  "front/sh/mcds!execute": {
    "mri002":"execute.json"//对应模拟地址front/sh/mcds!execute?uid=mri002
  },
  /*
  * @YSG
  * */
  "front/sh/groupbuy!index":{           //----团购----
    "001":"activityList.json"           //查看活动列表
    ,"002":"changeActivityState.json"   //修改活动状态(暂停、启用)
    ,"003":"actIssue.json"              //新增
    ,"004":"actGroupDetails.json"       //查看
    ,"005":"actIssue.json"       //更新
  },
  "front/sh/seckill!execute":{            //----秒杀----
    "001":"actIssue.json"               //新增
    ,"002":"actSeckillDetails.json"     //查看
    ,"003":"actIssue.json"              //更新
    ,"005":"seckillDetails.json"             //秒杀H5数据
  },
  "front/sh/seckill!execute":{
  "004":"seckillList.json"           //秒杀活动参与
  },
  "front/sh/luckdraw!execute": {         //----抽奖----
    "lu001": "actIssue.json"             //新增
    , "lu003": "actLuckdrawDetails.json"   //查看
    , "lu002": "actIssue.json"            //更新
  },
  "front/sh/luckdraw!stats": {         //----抽奖----
    "lu001": "luckdrawStats.json"             //新增
  },
  /*
   * @ZG
   * */
  "front/sh/sign!execute":{       //----签到----
    "si001": "creatSignIn.json", //新增
    "si002": "updateSignIn.json", //更改
    "si003": "checkSignIn.json", //查看
    //h5端接口
    "si005": "H5SignHistory.json", //记录
    "si006": "H5Sign.json"          //签到
  },
  "front/sh/resources!index":{
    "s001":"resList.json", //资源列表
    "g001":"resDetailList.json",//资源发放明细列表
    "r001":"mcdsList.json"//商品选择
    ,"sm001":"resGoodsList.json"      //@ YGS DON’T DEL
    ,"sa001":"resGoodsListMore.json"  //@ YGS DON’T DEL
  },
  /*
   * @YY
   * */
  "front/sh/campaign!execute":{
    "m001":"templateList.json" ,   //模板列表接口
    "003":"newPropagate.json"   //新建宣传活动接口
  },
  "front/sh/campaign!index":{
    "003":"newPropagate.json" ,  //新建宣传活动接口
    "004":"propaDetail.json" ,      //宣传活动详情接口
    "005":"updatePropa.json"     //宣传活动更新接口
  },
  "front/sh/user!index":{
    "m001":"user.json",
    "003":"accountList.json" ,//账号列表接口
    "004":"newChannel.json",   //新增渠道接口
    "005":"editAccount.json",  //编辑账号接口
    "006":"chaList.json",     //渠道列表接口
    "007":"accountInfo.json" , //查看账号接口
    "008":"chaInfo.json",    //查看渠道接口
    "009":"roleSelect.json",      //角色下拉框请求接口
    "010":"channelSelect.json",      //渠道下拉框请求接口
    "011":"accStatus.json"     //修改用户状态接口
  },
  "front/sh/user!saveUserAcct":{
    "001":"newAccount.json"   //新建账号接口
  },
  "front/sh/user!login":{
  "l001":"loginReturnData.json"   //登录接口
  },
  "front/sh/user!getImageCode":{
    "n001":"getCodePic.json"      //获取图片验证码接口
  }
};
