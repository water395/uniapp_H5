export default {
	rmZero(val) {
		let regexp=/(?:\.0*|(\.\d+?)0+)$/
		if(!!val) {
			return val.replace(regexp,'$1')
		}else {
			return 0
		}
	},
	autoImage(val,w=81,h=81,m='fill'){
		let auto = '?x-oss-process=image/resize,m_'+m+',w_'+w+',h_'+h
		let defimg = getApp().globalData.imgUrl + '/freshfans/1584407932912xflogo.png'
		if(val) {
			return val + auto
		}else {
			return defimg
		}
	},

	getQueryObject() { // 获取链接参数对象
		let url = window.location.href;
		const search = url.substring(url.lastIndexOf('?') + 1)
		const obj = {}
		const reg = /([^?&=]+)=([^?&=]*)/g
		search.replace(reg, (rs, $1, $2) => {
		  const name = decodeURIComponent($1)
		  let val = decodeURIComponent($2)
		  val = String(val) 
		  obj[name] = val
		  return rs
		})
		return obj
	  }
}