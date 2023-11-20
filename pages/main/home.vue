<template>
	<view class="u-whfill u-bgwhite flex-column-start-center u-text-c" style="padding: 100rpx 48rpx 0 48rpx;">
        
        <view class="u-wfull flex-row-center-center u-mb40">
            <text class="u-size-42" style="font-weight: bold" v-if="accId != ''">欢迎您，工号：{{ workId  }}</text>
			<text class="u-size-42" style="font-weight: bold" v-else>{{ workId }}</text>
        </view>

		<view class="u-wfull u-mb40 flex-row-center-center u-bg-f5" style="height: 654rpx; padding: 20rpx;">
			<view class="cardBox u-whfull u-color-white  flex-column-end-center">
				<view class="u-size-28  area">仅限广州、深圳、东莞、佛山门店使用</view>
			</view>
		</view>


		<view class="u-size-42 u-mb40" style="font-weight: bold;">面包新语370元生日礼券</view>

        <view class="btn-row u-mb40" v-if="showId == 0">
				<view class="btn u-size-42 u-bg-orange u-color-white u-br10 flex-row-center-center"
				@click="receiveCard" style="width: 320rpx; height: 120rpx; font-weight: bold;border-radius: 60rpx;">
                    <text>领劵激活</text>
                </view>
		</view>

        

        <view class="u-wfull flex-row-center-center u-mb100" v-if="showId == 1">
            <text class="u-size-24 u-color-666" @click="getSchemeCode" style="font-weight: bold">您有生日礼券待领取，立即前往 ></text>
        </view>


		<view class="btn-row u-border-grey u-br100" style="width: 100%;">
				<view class="btn  u-size-28   u-br40 flex-row-around-center"  @click="getSchemeCode" style="height: 120rpx; width: 100%;">
					<view class="tipsRadius u-bgwhite icon"></view>
                    <text>前往微信小程序进行消费</text>
                    <view class="go_img u-ml10"></view>
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
	import mInput from '../../components/m-input.vue'
	import Api from '@/common/api/index.js'

	export default {
		components: {
			mInput
		},
		data() {
			return {
				accId: uni.getStorageSync('accId') || '' , // 员工号
				workId: "",
				showId : 0  // 控制页面渲染内容
			}
		},
		created() {
			this.bindcheckUser()
		},
		watch: {
		},
		methods: {
			...mapActions(['checkUser','getSchemeCode',"checkUserQw"]),

			//身份验证
			async bindcheckUser() { 
				let code = uni.getStorageSync('code')
				//  判断手机登录还是免密登录
				if(code.length != 0 && code != null && code != undefined) {
					if(uni.getStorageSync("appType") == 'code'){
						await this.checkUserQw({code:code})
					}else{
						await this.checkUser({ code : code}) 
					}
					uni.removeStorageSync("code");
					uni.removeStorageSync("appType");
				}

				this.workId = uni.getStorageSync('accId').slice(3) || "无法获取员工号";
			    console.log(this.workId);
				this.accId =  uni.getStorageSync('accId') || "" ;


			    if(this.accId){
				try{
					let  res  = await Api.hasReceived({ "accId" : this.accId },'get');  // 领取状态
					if( (res.data != null && res.data != undefined && res.data != null)) {
						let { status }  = res.data 
					    // status 0/null/undefined : 未兑换未领取  1: 已兑换未领取  2：已兑换已领取
					    if( status == 2){
							this.getSchemeCode(); // 页面跳转 -小程序
						}
					    this.showId = status || 0;
					}else {
						this.showId = 0;
					}
				}catch(e){
					console.log(e)
				}}
 				
			},

			// 兑换领取-跳转页面
			async receiveCard(){
				uni.navigateTo({url: '../result/result'});
			}


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
