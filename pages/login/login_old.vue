<template>
	<view class="content u-wfull">
		<view v-if="loginType == 1" class="input-group u-text-c">
			<view class="title u-color-333 u-size-38 u-weight-bold">鲜范门店设备验证</view>
			<view class="input-row flex-row-start-center u-br40 u-border-grey">
				<text class="tt iconfont icon-wode"></text>
				<input class="put" v-model="deviceForm.licenseCode" placeholder="授权码" type="text"/>
			</view>
			<view class="input-row flex-row-start-center u-br40 u-border-grey">
				<text class="tt iconfont icon-shouquanzu"></text>
				<input class="put"  v-model="deviceForm.licensePassword" placeholder="秘钥" type="password" />
			</view>
			<view class="btn-row">
				<text class="btn u-size-28 u-bg-theme u-color-white u-br40" @tap="bindDevice">登录设备</text>
			</view>
		</view>
		<view v-if="loginType == 2" class="input-group u-text-c">
			<view class="title u-color-333 u-size-38 u-weight-bold">门店管理登录</view>
			<view class="input-row flex-row-start-center u-br40 u-border-grey">
				<text class="tt iconfont icon-wode"></text>
				<input class="put" v-model="loginForm.username" placeholder="账户" type="text"/>
			</view>
			<view class="input-row flex-row-start-center u-br40 u-border-grey">
				<text class="tt iconfont icon-suo"></text>
				<input class="put" v-model="loginForm.password" placeholder="密码" type="password" />
			</view>
			<view class="input-row flex-row-start-center u-br40 u-border-grey">
				<text class="tt u-size-24 u-ml10 iconfont icon-yanzhengma"></text>
				<input class="put" v-model="loginForm.codeVal" placeholder="验证码" type="password" />
				<view class="code-img" @click="getCode">
					<image class="img" :src="imgCode"></image>
				</view>
			</view>
			<view class="btn-row">
				<text class="btn u-size-28 u-bg-theme u-color-white u-br40" @tap="bindLogin">登录设备</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions 
	} from 'vuex'
	import Api from '@/common/api/index.js'
	import mInput from '../../components/m-input.vue'

	export default {
		components: {
			mInput
		},
		data() {
			return {
				loginType: 1, //1:设备验证，2：登录
				deviceForm: { //设备信息
					licenseCode: '',
					licensePassword: ''
				},
				loginForm: { //用户登录信息
					username: '',
					password: '',
					loginSource: 2, //门店设备登录源
					storeId: '',
					codeVal: '',
					codeKey: ''
				 },
				imgCode: '', //验证码
				imgCodeKey: '',
				positionTop: 0,
				isDevtools: false,
			}
		},
		computed: mapState(['hasLogin','hasDevice','deviceInfo']),
		created() {
			if(!this.hasDevice) {
				this.loginType = 1
			}else if(!this.hasLogin) {
				this.loginType = 2
			}
		},
		watch: {
			loginType:{
				handler(val) {
					if(val == 2) {
						this.getCode()
					}
				},
				immediate: true
			}
		},
		methods: {
			...mapActions(['licenseCheck','login']),
			getCode() { //获取验证码
				Api.getImgCode().then(res => {
					this.imgCode = res.data.codeVal
					this.imgCodeKey = this.loginForm.codeKey = res.data.codeKey
				}).catch(err =>{})
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			async bindDevice() { //设备登录
				if(!this.deviceForm.licenseCode || !this.deviceForm.licensePassword) {
				  this.toastMsg('请输入授权码和秘钥')
				  return false
				}

				let bool = await this.licenseCheck(this.deviceForm)
				let deviceInfo = uni.getStorageSync('deviceInfo')
				console.log('设备信息',deviceInfo,bool)
				if(bool) {
					this.loginType = 2
				}
			},
			async bindLogin() { //用户登录
				if(!this.loginForm.username || !this.loginForm.password) {
				  this.toastMsg('请输入用户名和密码')
				  return false
				}
				if(!this.loginForm.codeVal || this.loginForm.codeVal.length != 4) {
				  this.toastMsg('请输入4位的验证码')
				  return false
				}
				this.loginForm.storeId = this.deviceInfo.storeId
				let bool = await this.login(this.loginForm)
				let token = uni.getStorageSync('token')
				console.log('登录token',token,bool)
				if(bool) {
					this.toMain();
				}else {
					this.getCode()
				}
			},
			toMain(userName) {
				let redirect = this.$route.params.redirect
				if (!redirect) {
					uni.reLaunch({
						url: '../main/main',
					});
				} else {
					uni.navigateBack();
				}
			
			}
		},
		onReady() {
			this.initPosition();
			// #ifdef MP-WEIXIN
			this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
.content {
	background-image: url(../../static/img/login_bg.png);
	background-position: left bottom;
	background-size: 100% auto;
	background-color: #f4fbff;
	.title {
		margin-top: 200rpx;
		margin-bottom: 80rpx;
	}
	.input-row {
		margin: 30rpx auto;
		width: 550rpx;
		height: 80rpx;
		text-align: left;
		.tt {
			display: inline-block;
			padding: 20rpx;
		}
		.put {
			border-left: 1rpx solid #999;
			padding-left: 40rpx;
		}
		.code-img {
			margin-right: 20rpx;
			width: 160rpx;
			height: 60rpx;
			.img {
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
	.btn-row {
		margin: 60rpx auto;
		width: 550rpx;
		.btn {
			display: inline-block;
			width: 550rpx;
			height: 80rpx;
			line-height: 80rpx;
		}
	}
}
</style>



