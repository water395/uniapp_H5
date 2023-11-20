<template>
	<view class="u-whfill u-bgwhite flex-column-start-center u-text-c" style="padding: 100rpx 48rpx 0 48rpx;">

		<view class="u-wfull u-mb40 flex-row-center-center u-bg-f5" style="height: 654rpx; padding: 20rpx;">
			<view class="cardBox u-whfull u-color-white  flex-column-end-center">
				<view class="u-size-28  area">仅限广州、深圳、东莞、佛山门店使用</view>
			</view>
		</view>
		<view class="u-size-42 u-mb40" style="font-weight: bold;">面包新语370元生日礼券</view>
		
		<view class="flex-row-start-center u-relative u-wfull  u-border-bottom-e5 u-ptb20" style="height: 100rpx;">
			<view @click="totips" class="u-color-333 u-size-28">+86
				<text class="iconfont icon-arrow-down u-size-28 u-ml10"></text>
			</view>
			
			<view class="u-ml10 u-plr20">
				<input type="number" maxlength="11" v-model="loginForm.phone"  placeholder="请输入手机号" placeholder-style="color:#999"/>
			</view>
		</view>
		
		<view class="flex-row-between-center u-wfull u-mb60 u-border-bottom-e5 u-ptb20" style="height: 100rpx;">
			<view>
				<input type="number"  placeholder="请输入验证码" v-model="loginForm.smsCode" maxlength="6"  placeholder-style="color:#999"/>
			</view>
			<view class="u-color-theme u-size-28 u-relative">
				<text class="code" @click="getPhoneCde">{{timeText ? '('+timeText+'s)后重发' : '获取验证码'}}</text>
			</view>
		</view>

		<view class="btn-row  u-bg-orange u-br100 u-color-white" style="width: 100%;">
				<view class="btn  u-size-28   u-br40 flex-row-center-center" style="height: 120rpx; width: 100%;" @click="bindLogin">
                    <text>领券登录</text>
                    <!-- <view class="go_img u-ml10"></view> -->
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
				timeText:0, //倒计数
				loginForm: {
					phone: '', 
					smsCode: '' // 验证码
				 },
			}
		},
		methods: {
			...mapActions(['userLogin']),

			// 验证码
			getPhoneCde() {

				if(!this.loginForm.phone && this.timeText <= 0){
					this.toastMsg('请输入手机号码')
					return false
				}

				if(this.timeText > 0) {
					return false
				}

				this.countDown()

				// 发送短信
				Api.phoneSms({"phone" : this.loginForm.phone},'get').then(res => {
					this.toastMsg('验证码已发送');
				}).catch(err =>{})
			},

			// 倒计时
			countDown() {
				this.timeText = 60
				setInterval(()=>{
					if(this.timeText > 0) {
						this.timeText -= 1
					}else {
						this.timeText = 0
					}
				},1000)
			},

			async bindLogin() { //用户登录
				if(!this.loginForm.phone) {
				  this.toastMsg('请输手机号码')
				  return false
				}
				if(!this.loginForm.smsCode || this.loginForm.smsCode.length != 6) {
				  this.toastMsg('请输入6位的验证码')
				  return false
				}
				let res = await this.userLogin(this.loginForm);
				if(res){
					uni.navigateTo({url: '../main/home'})
				}
			},
			
		},
		onReady() {
			// this.initPosition();
			// #ifdef MP-WEIXIN
			this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
.cardBox{
    background-image: url(../../static/img//roll.png);
	background-position: left bottom;
	background-size: 100% auto;
	background-color: #f4fbff;

}
.icon{
	background-image: url(../../static/img//appIcon.png);
	background-position: left bottom;
	background-size: 100% auto;
	background-color: #f4fbff;
}

.go_img{
    width: 42rpx;
    height: 42rpx;
    background-image: url(../../static/img/go.png);
	background-position: left bottom;
	background-size: 100% auto;
}
.area{
	height: 60rpx; 
	background: #000000;
	opacity: 0.5;
	width: 100%;
	line-height: 60rpx;
}
.tipsRadius{
    width: 80rpx;
    height: 80rpx;
    border-radius: 100%;
}
.btn-row {
		.btn {
			
		}
	}
</style>
