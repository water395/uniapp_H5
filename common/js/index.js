import moment from 'moment'
import axios from '@/common/plug/gangdiedao-uni-axios'
import { mapWebKey } from '@/common/js/constant.js'
const NOLOADING = {
	headers: {noLoading: true}
}

/*
* @desc url参数解析为数组
* @demo 栗子： {a:1,b:1} => '?a=1&b=1'
*/
export function objToUrl (obj, unEncodeURI = false) {
  let result = []
  for (let name of Object.keys(obj)) {
    let value = obj[name]
    result.push(name + '=' + (unEncodeURI ? value : encodeURIComponent(value)))
  }
  if (result.length) {
    return '?' + result.join('&')
  } else {
    return ''
  }
}


/*
* @desc url参数解析为对象
* @demo 栗子： '?a=1&b=2' => {a:1,b:2}
*/
export function urlParseToJson (url) {
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}

/*
* @desc 确认并跳转到授权页面
*/
export const navigateToAuthPage =  async (jumpMethod = 'navigateTo', back = true, params = {}) => {
	const modal = await uni.showModal({
		title: '提示',
		content: '请重新授权登录',
		confirmText: '好的',
		showCancel: false
	})
	if (modal && modal[1] && modal[1].confirm) {
		let opts = {}
		back && (opts.back = true)
		opts = Object.assign(opts, params)
		uni[jumpMethod]({
			url: `/pages/auth/index` + objToUrl(opts)
		})
	}
}

/*
* @desc 加载中
*/
export const showLoading = () => {
	uni.showLoading({
		mask: true,
		title: '加载中'
	})
}

// 提示
export const toastMsg = (msg) => {
	uni.showToast({
		title: msg || '',
		icon: 'none'
	})
}

/*
* rpx to px
*/
export const rpx2px = (val) => {
	return val / 750 * wx.getSystemInfoSync().windowWidth
}

/*
* @desc 保留2位小数
*/
export const toDecimal2 = (v = 0)  =>  {
  var f = parseFloat(v);
  if (isNaN(f)) {
    return '0.00';
  }
  var f = Math.round(v * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s
}

/*
* 深克隆
*/ 
export function deepClone (obj) {
  const result = typeof obj.splice === 'function' ? [] : {}
  let key
  if (obj && typeof obj === 'object') {
    for (key in obj ) {
        if (obj[key] && typeof obj[key] === 'object') {
            result[key] = deepClone(obj[key])
        } else {
            result[key] = obj[key]
        }
    }
    return result
  }
  return obj
}

/*
* 补0
*/
export function pad(value) {
  return ('00' + value).substr(('' + value).length)
}

/*
* 倒计时
*/
export function countTime(time,diffTime = 0, cb, out) {
		var date = new Date();
		var now = date.getTime()      
		var end = (new Date(moment(time))).getTime()

		var leftTime = end - now - diffTime;  //时间差                              
		var d, h, m, s, ms;
		if(leftTime >= 0) {
				d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
				h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
				m = Math.floor(leftTime / 1000 / 60 % 60)
				s = Math.floor(leftTime / 1000 % 60)
				ms = Math.floor(leftTime % 1000)
				if(ms < 100) {
						ms = "0" + ms;
				}
				if(s < 10) {
						s = "0" + s;
				}
				if(m < 10) {
						m = "0" + m;
				}
				if(h < 10) {
						h = "0" + h;
				}
				cb({
					h,
					m,
					s,
					ms
				})
		} else {
			out()
		}
		// 递归每秒调用countTime方法，显示动态时间效果
		return leftTime
}

//高度信息和位置信息
export function getNavBarHeight() {
	// #ifdef MP-WEIXIN
	let systemInfo = uni.getSystemInfoSync();
	let rect = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
	let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
	let height = gap + rect.height;
	let top = rect.top;
	// #endif
	
	// #ifdef H5
	let height = 44
	let top = 0
	// #endif
	
	return {
		height,
		top
	}
}

/*
*
* 广告跳转处理
*/
export function adJumpHandle({linkType, linkUrl, linkAppType, appId} = {}) {
	if (linkType == 2) {
		// 跳转http链接
		// #ifdef MP
		uni.navigateTo({
			url: '/storehouse/webview/index?url=' + linkUrl
		})
		// #endif
		
		// #ifdef H5
		window.open(linkUrl)
		// #endif
	} else if (linkType == 1 && linkAppType == 1) {
		// 自身小程序页面跳转
		const whileNames = ['/pages/index/index', '/pages/order/index', '/pages/user/index']
		if (whileNames.includes(linkUrl)) {
			uni.switchTab({
				url: linkUrl
			})
		} else {
			uni.navigateTo({
				url: linkUrl
			})
		}
	} else if (linkType == 1 && linkAppType == 2) {
		// 跳转到别的小程序
		uni.navigateToMiniProgram({
		  appId,
		  path: linkUrl || '',
			// envVersion: '',
		  extraData: {},
		  success(res) {
		    // 打开成功
				console.log('navigateToMiniProgram  res', res)
		  },
			complete(res) {
				console.log('complete res', res)
			}
		})
	}
}

/*
* 阿拉伯 =》 中文数字
*/
export function num2Zh(number) {
  var chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  var chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
  var chnUnitChar = ['', '十', '百', '千']

  function SectionToChinese(section) {
    var strIns = ''; var chnStr = ''
    var unitPos = 0
    var zero = true
    while (section > 0) {
      var v = section % 10
      if (v === 0) {
        if (!zero) {
          zero = true
          chnStr = chnNumChar[v] + chnStr
        }
      } else {
        zero = false
        strIns = chnNumChar[v]
        strIns += chnUnitChar[unitPos]
        chnStr = strIns + chnStr
      }
      unitPos++
      section = Math.floor(section / 10)
    }
    return chnStr
  }

  function NumberToChinese(num) {
    var unitPos = 0
    var strIns = ''; var chnStr = ''
    var needZero = false

    if (num === 0) {
      return chnNumChar[0]
    }

    while (num > 0) {
      var section = num % 10000
      if (needZero) {
        chnStr = chnNumChar[0] + chnStr
      }
      strIns = SectionToChinese(section)
      strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0]
      chnStr = strIns + chnStr
      needZero = (section < 1000) && (section > 0)
      num = Math.floor(num / 10000)
      unitPos++
    }

    return chnStr
  }
  return NumberToChinese(number)
}

/*
* 是否数字
*/
export function myIsNum(value) {
  value = parseFloat(value)
  return typeof value === 'number' && !isNaN(value)
}

export function outLocationTip({
	ok = () => {}, 
	cancel = () => {},
	okScopeLocation = () => {},
	showCancel= true
} = {}) {
	uni.showModal({
		title: '地理位置未授权',
		content: '如需使用鲜范小程序,请开启您手机中的定位授权, 开启后重新打开小程序',
		confirmText: '去授权',
		confirmColor: '#F0AD4E',
		showCancel,
		success: ({confirm}) => {
			ok()
			if (confirm) {
				uni.openSetting({
					success(res) {
						if (res.authSetting && res.authSetting['scope.userLocation']) {
							okScopeLocation()
						} else {
							outLocationTip({
								ok,
								cancel, 
								okScopeLocation
							})
						}
					}
				})
			} else {
				cancel()
			}
		}
	})
}


export function sum (array) {
  if (!array.length) {
    return 0
  }
  return array.reduce((total, number) => total + number)
}

// 经纬度解析位置信息
export function regeo({
	longitude,
	latitude,
}, ok = () => {}) {
	axios
	  .get(`https://restapi.amap.com/v3/geocode/regeo?key=${mapWebKey}&location=${longitude},${latitude}`, NOLOADING)
	  .then(res => {
			if  (res.info == 'OK') {
				uni.setStorageSync('location_info', res.regeocode)
				ok(res.regeocode.addressComponent)
			}
	  }, e => {
			console.log(e)
		})
}

// 根据经纬度,周边搜索 : https://lbs.amap.com/api/webservice/guide/api/search/
export function mapAroundPoints({
	longitude,
	latitude,
	citylimit = true,
	city = ''
}, ok = () => {}, fail = () => null) {
	axios
	  .get(`https://restapi.amap.com/v3/place/around?city=${city}&citylimit=${citylimit}&key=${mapWebKey}&location=${longitude},${latitude}&extensions=all`, NOLOADING)
	  .then(res => {
			if  (res.info == 'OK') {
				ok(res.pois)
			}
	  }, e => {
			console.log(e)
			fail(e)
		})
}

// 根据经纬度,关键字搜索 : https://lbs.amap.com/api/webservice/guide/api/search/
export function keywordMapPoints({
	keyword = '',
	citylimit = true,
	city = '',
	page = 1
}, ok = () => {}) {
	axios
	  .get(`https://restapi.amap.com/v3/place/text?page=${page}&city=${city}&citylimit=${citylimit}&key=${mapWebKey}&keywords=${keyword}&extensions=all`, NOLOADING)
	  .then(res => {
			if  (res.info == 'OK') {
				ok(res.pois)
			}
	  }, e => {
			console.log(e)
		})
}

// 地理编码
export function mapNGegeo(address = ''){
	return new Promise((resolve, reject) => {
		axios
		  .get(`https://restapi.amap.com/v3/geocode/regeo?key=${mapWebKey}&address=${address}`, NOLOADING)
		  .then(res => {
				if  (res.info == 'OK') {
					resolve(res.geocodes)
				} else {
					reject(res)
				}
		  }, e => {
				reject(e)
			})
	})
}

// 逆地理编码: https://lbs.amap.com/api/webservice/guide/api/georegeo
// 根据经纬度,查到对应的省市区
export function mapGegeo({
	longitude,
	latitude
}, ok = () => {}) {
	axios
	  .get(`https://restapi.amap.com/v3/geocode/regeo?key=${mapWebKey}&location=${longitude},${latitude}&extensions=all`, NOLOADING)
	  .then(res => {
			if  (res.info == 'OK') {
				ok(res.regeocode.addressComponent)
			}
	  }, e => {
			console.log(e)
		})
}

// 计算元素高度
export function calcEl(scope, id, ok = () => {}){
	scope.$nextTick(() => {
		uni.createSelectorQuery().in(scope)
			.select(`#${id}`)
			.boundingClientRect(rect => {
				if (!!rect) {
					ok(rect)
				}
			})
			.exec()
	})
}

// export  function debounce(fn, delay){
//   var timer = null; // 声明计时器
//   return function() {
//     var context = this;
//     var args = arguments;
//     clearTimeout(timer);
//     timer = setTimeout(function () {
//       fn.apply(context, args);
//     }, delay);
//   };
// }

export function debounce(func, time, {
  leading = true,
  context = null
} = {}) {
  let timer
  const _debounce = (...args) => {
    if (timer) clearTimer(timer)
    if (leading && !timer) {
      timer = setTimeout(null, time)
      func.apply(context, args)
    } else {
      timer = setTimeout(() => {
      	func.apply(context, args)
        timer = null
      }, time)
    }
  }
  _debounce.cancel = () => {
    clearTimer(timer)
    timer = null
  }
  return _debounce
}


// 经纬度,剪切
export function cutLonLatVal(value) {
	value = String(value)
	let [prevVal, nextVal] = value.split('.')
	nextVal = nextVal.slice(0, 5)
	return Number([prevVal, nextVal].join('.'))
}

// 验证手机号
export function validatePhone(phone) {
	return /^1[3456789]\d{9}$/.test(phone)
}


// 检验是否在营业时间 
export function checkBusinessTime(businessHoursStart, businessHoursEnd) {
	if (!businessHoursStart || !businessHoursEnd) {
		return false
	} 
	let result = false
	const ntime =  moment().locale('zh-cn').format('HH:mm')
	const [h, m] = ntime.split(':')
	const [sh, sm] = businessHoursStart.split(':')
	const [eh, em] = businessHoursEnd.split(':')
	if (Number(h) > Number(sh) && Number(h) < Number(eh)) {
		result = true
	}
	if (Number(h) == Number(sh) && Number(m) >= Number(sm)) {
		result = true
	}
	if (Number(h) == Number(eh) && Number(m) <= Number(sm)) {
		result = true
	}
	return result
}

// 去重
export function unique(arr, key) {
	if (!key) {
		return Array.from(new Set(arr))
	}
	const results = arr.reduce((prev, next) => {
		if (!Array.isArray(prev)) return []
		return prev.map(o => o[key]).includes(next[key]) ? prev : [...prev, next]
	}, [])
	return results
}


// 嗅探访问
export function sniffGet(path = []) {
	return (target) => {
		path.reduce((prev, next) => {
			(prev && prev[next]) ? prev[next] : null
		}, target)
	}
}


const _fixedFloat = (a, b, sign) => {
  function padding0 (p) {
    var z = ''
    while (p--) {
      z += '0'
    }
    return z
  }
  function handle (x) {
    var y = String(x)
    var p = y.lastIndexOf('.')
    if (p === -1) {
      return [y, 0]
    } else {
      return [y.replace('.', ''), y.length - p - 1]
    }
  }
  // v 操作数1, w 操作数2, s 操作符, t 精度
  function operate (v, w, s, t) {
      switch (s) {
        case '+':
          return (v + w) / t
        case '-':
          return (v - w) / t
        case '*':
          return (v * w) / (t * t)
        case '/':
          return (v / w)
      }
  }
  var c = handle(a)
  var d = handle(b)
  var k = 0

  if (c[1] === 0 && d[1] === 0) {
    return operate(+c[0], +d[0], sign, 1)
  } else {
  k = Math.pow(10, Math.max(c[1], d[1]))
  if (c[1] !== d[1]) {
    if (c[1] > d[1]) {
      d[0] += padding0(c[1] - d[1])
    } else {
      c[0] += padding0(d[1] - c[1])
    }
  }
    return operate(+c[0], +d[0], sign, k)
  }
}
export const calc = { 
  // 加
  plus: (a, b) => {
    return _fixedFloat(a, b, '+')
  },
  // 减
  minus: (a, b) => {
    return _fixedFloat(a, b, '-')
  },
  // 乘
  multiply: (a, b) => {
    return _fixedFloat(a, b, '*')
  },
  // 除
  division: (a, b) => {
    return _fixedFloat(a, b, '/')
  }
}

export function remoteLoad(url, hasCallback) {
  return createScript(url)
  /**
   * 创建script
   * @param url
   * @returns {Promise}
   */
  function createScript(url) {
    const scriptElement = document.createElement('script')
    document.body.appendChild(scriptElement)
    const promise = new Promise((resolve, reject) => {
      scriptElement.addEventListener('load', e => {
        removeScript(scriptElement)
        if (!hasCallback) {
          resolve(e)
        }
      }, false)

      scriptElement.addEventListener('error', e => {
        removeScript(scriptElement)
        reject(e)
      }, false)

      if (hasCallback) {
        window.____callback____ = function() {
          resolve()
          window.____callback____ = null
        }
      }
    })

    if (hasCallback) {
      url += '&callback=____callback____'
    }

    scriptElement.src = url

    return promise
  }

  /**
   * 移除script标签
   * @param scriptElement script dom
   */
  function removeScript(scriptElement) {
    document.body.removeChild(scriptElement)
  }
}

// 访问
export const smartVisit = (obj, paths) => {
  if (Array.isArray(paths)) {
    return paths.reduce((prev, cur) => {
      if (prev && prev[cur]) {
        return prev[cur]
      } else {
        return null
      }
    }, obj)
  } else {
    return null
  }
}
