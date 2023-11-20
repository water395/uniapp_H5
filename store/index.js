import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/common/api/index.js'
import {toastMsg} from '@/common/js/index.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		// token: uni.getStorageSync('token') || '', //用户token
		// deviceInfo: uni.getStorageSync('deviceInfo') || '', //设备信息
		// hasLogin: uni.getStorageSync('hasLogin') || false, //是否登录
		// hasDevice: uni.getStorageSync('hasDevice') || false, //是否设备验证
		// forcedLogin: false,
		// userName: "",
		accId : ''// 工号
	},
	mutations: {
		// setLogin(state,token) {
		// 	uni.setStorageSync('token',token)
		// 	uni.setStorageSync('hasLogin',true)
		// 	state.token = token
		// 	state.hasLogin = true;
		// },
		// setDeviceInfo(state,info) {
		// 	uni.setStorageSync('deviceInfo',info)
		// 	uni.setStorageSync('hasDevice',true)
		// 	state.hasDevice = true
		// 	state.deviceInfo = info
		// },
		setAccid(state,accId){
			uni.setStorageSync('accId',accId)
			state.accId = accId
		}
		
	},
	actions:{
		userLogin({commit},loginInfo){ //用户登录
			return new Promise((resolve,reject) => {
				Api.userLogin(loginInfo,'post').then(res=> {
					console.log('登录信息：',res)
					if(res.code == 200) {
						let { data } = res
						let accId = data
						commit('setAccid',accId)
						resolve(true)
					}else {
						toastMsg(res.msg)
						setTimeout(()=> {
							resolve(false)
						},1000)
					}
				}).catch(err=> {
					console.log('登录报错信息：',err)
					reject(err)
				})
			})
		},

		checkUserQw({commit},checkUserInfo){ //身份验证
			return new Promise((resolve,reject) => {
				Api.checkUserQw(checkUserInfo,'get').then(res=> {
					console.log('身份验证：',res)
					if(res.code == 200) {
						let { data } = res
						let accId = data
						commit('setAccid',accId)
						resolve(true)
					}else {
						toastMsg(res.msg)
						setTimeout(()=> {
							resolve(false)
						},1000)
					}
				}).catch(err=> {
					console.log('身份验证报错信息：',err)
					reject(err)
				})
			})
		},

		checkUser({commit},checkUserInfo){ //身份验证
			return new Promise((resolve,reject) => {
				Api.checkUser(checkUserInfo,'get').then(res=> {
					console.log('身份验证：',res)
					if(res.code == 200) {
						let { data } = res
						let accId = data
						commit('setAccid',accId)
						resolve(true)
					}else {
						toastMsg(res.msg)
						setTimeout(()=> {
							resolve(false)
						},1000)
					}
				}).catch(err=> {
					console.log('身份验证报错信息：',err)
					reject(err)
				})
			})
		},

		getSchemeCode({commit}){ //短连接
			return new Promise((resolve,reject) => {
				Api.getSchemeCode({"accId" : uni.getStorageSync('accId') },'get').then(res=> {
					console.log('短链接信息：',res)
					if(res.code == 200) {
						let { data } = res
						var urlScheme = "";
						if (res.code == 200 && data) {
							urlScheme = `weixin://dl/business/?t=${data}`;
							console.log(urlScheme)
							location.href = urlScheme;
						}
						resolve(true)
					}else {
						toastMsg(res.msg)
						setTimeout(()=> {
							resolve(false)
						},1000)
					}
				}).catch(err=> {
					console.log('短链接信息：',err)
					reject(err)
				})
			})
		},
	}
})

export default store
