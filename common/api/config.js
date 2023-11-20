
/*使用方式
 *引入：{login} 
 *调用：login({}).then(res => { todu })
 */

import UserApiUrls  from './urls/user'


const apiUrl = {
	// 用户
	...UserApiUrls,
}  
export default apiUrl