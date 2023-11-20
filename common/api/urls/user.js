export default {
	// 校验身份
    checkUser :'/usc/xsx/checkUser',

	// 企业微信
	checkUserQw:'/usc/xsx/checkUserQw',

	// 通过手机号获取员工号
	userLogin : '/usc/xsx/getAccIdByPhone',

	//获取验证码
	phoneSms: '/amc/auth/phoneSms',

	// 查询是否有兑换过的卡券
	hasReceived : '/usc/xsx/hasReceived',

	//领取卡券
	receiveCard:'/usc/xsx/receiveCard',

	//短地址
	getSchemeCode : '/usc/xsx/getSchemeCode'
	
}