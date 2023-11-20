import Vue from 'vue'
import App from './App'

import store from './store'

import {toastMsg} from '@/common/js/index.js'
import conFilters from '@/common/js/filter'

//公共过滤器
for (let key in conFilters){ 
 Vue.filter(key,conFilters[key])
} 

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.toastMsg = toastMsg

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
