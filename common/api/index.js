import axios from '@/common/plug/gangdiedao-uni-axios'
import apiUrl from './config'
import store from '@/store'

// axios 配置
axios.defaults.timeout = 10000;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.baseURL = 'https://fsatestdapi.freshfans.cn'
//    uEnvDev
if (process.env.NODE_ENV === 'development') {
    // TODO

	 //axios.defaults.baseURL = 'http://xffdevapi.freshfans.cn'
	 axios.defaults.baseURL = 'https://fsatestdapi.freshfans.cn'

}
// uEnvProd
if (process.env.NODE_ENV === 'production') {
    // TODO
	// axios.defaults.baseURL = 'https://wxm-api2.freshfans.cn' //生产环境2
	axios.defaults.baseURL = 'https://wxm-api.freshfans.cn' // 生产环境
	// axios.defaults.baseURL = 'https://fsatestdapi.freshfans.cn'
	
	
	
}


/**
 * 请求接口日志记录
 */
function _reqlog(req) {
    if (process.env.NODE_ENV === 'development') {
				// console.log('====================================  Ajax Begin ===========================================')
				// const { url, baseURL, params, method, data } = req
				// console.log('接口地址：', baseURL + url)
				// console.log('请求方式：', method)
				// console.log('params参数：', params)
				// console.log('data参数：', data)
				
    }
    //TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
    if (process.env.NODE_ENV === 'development') {
			// console.log('====================================  Ajax End ===========================================')
		}
}

//请求前拦截
axios.interceptors.request.use((config) => {
	// console.log('request拦截')
    //tode
    if (/put|post|patch/.test(config.method)) {
        //config.data = QS.stringify(config.data)
    }
	if (!config.headers.noLoading) {
		uni.showLoading({
			title:'加载中',
			mask: true
		})
	} else {
		delete config.headers.noLoading
	}
	// let devicInfo = store.getters.deviceInfo
	// if(!devicInfo && uni.getStorageSync('deviceInfo')) {
	// 	devicInfo = uni.getStorageSync('deviceInfo')
	// }
	// const attrs = ['deviceNo', 'licenseCode', 'licensePassword', 'storeId']
	// console.log('devicInfo:',devicInfo)
	// if (devicInfo) {
	// 	attrs.forEach(attr => {
	// 	  console.log('attr:',attr)
	// 	  devicInfo[attr] && (config.headers[attr] = devicInfo[attr])
	// 	})
	// }
	console.log('config:',config)
	_reqlog(config);
    return config;
}, (error) => { 
	_reqlog(error);
    return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use((res) => {
	uni.hideLoading()
	_reslog(res)
	if (res.status == 200) {
		return res.data;
	}
}, (error) => {
	uni.hideLoading()
    switch (error.response.status) {
		case 401:
			let pageList = getCurrentPages()
			let currentpage = pageList[pageList.length -1].$route.fullPath
			uni.navigateTo({ 
				url: '/pages/login/login?redirect=' + encodeURIComponent(currentpage)
			})
			break;
		case 500: 
			uni.showToast({
				title: '出错了，请稍后尝试',
				icon: 'none',
				duration: 2000
			})
			console.warn(error.response)
		break;
        default:
            //
				uni.showToast({
					title: '出错了',
					icon: 'none',
					duration: 2000
				})
            break;
    }
	_reslog(error)
	return Promise.reject(error.response);
});

var serviceList = {}
for (let api in apiUrl) {
    serviceList[api] = (params, method = 'get', config = {}) => {
        return new Promise((resolve, reject) => {
			const opts = {
				method,
				url: apiUrl[api],
			}
			method.toLowerCase() === 'get' && (opts.params = params)
			if (method.toLowerCase() === 'post') {
				opts.data = params
				config.params && (opts.params = config.params)
			}
			!config.headers && (config.headers = {})
			if (uni.getStorageSync('token')) {
				config.headers['Authorization'] = uni.getStorageSync('token')
			}
			config.headers && (opts.headers = config.headers)
			axios(opts)
				.then(response => {
					resolve(response)
				}, err => {
					reject(err)
				})
				.catch((error) => {
						uni.hideLoading()
						reject(error)
					})
        })
    }
}

export default serviceList


