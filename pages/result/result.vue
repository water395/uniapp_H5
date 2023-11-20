<template>
	<view>
		<view v class="u-whfill u-bgwhite flex-column-start-center u-text-c" v-if="status == 1" style="padding: 300rpx 24rpx 0 24rpx;">
        <view class="u-size-28  flex-column-center-center success_img u-mb30"></view>
        <view class="u-size-42 u-mb100" style="font-weight: bold;">恭喜您领券成功</view>
		<view class="btn-row u-border-grey u-br100">
				<view class="btn  u-size-28   u-br40 flex-row-center-center"  @click="getSchemeCode">
                    <text>前往面包新语微信小程序绑定生日礼券</text>
                    <view class="go_img u-ml10"></view>
                </view>
		</view>
	</view>

	<view v-if="status == 2"   class="u-whfill u-bgwhite flex-column-start-center u-text-c" style="padding: 300rpx 24rpx 0 24rpx;">
        <view class="u-size-28  flex-column-center-center fail_img u-mb30"></view>
        <view class="u-size-42 u-mb10" style="font-weight: bold;">领券失败</view>
        <view class="u-size-42 u-mb100" style="font-weight: bold;">{{ msg || '请确认生日账户额度后再次重试' }}</view>
		<view class="btn-row u-border-grey u-br100" @click="goback" >
				<view class="btn  u-size-28   u-br40 flex-row-center-center">
                    <text>返回上一页</text>
                    <view class="go_img u-ml10"></view>
                </view>
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
				status: 0,
				msg : '请确认生日账户额度后再次重试'
			}
		},
		computed: mapState([]),
		created() {
			this.receiveCard()
		},
		watch: {
		},
		methods: {
			...mapActions(['getSchemeCode']),
			async receiveCard(){
				try{
					let  res  = await Api.receiveCard({ "accId" : uni.getStorageSync('accId') },'get');  // 领取状态
					if(res.code == 200){
						this.status = 1;
					}else{
						this.msg = res.msg;
						this.status = 2;
					}
				}catch(e){

				}
			},

			goback(){
				this.$router.back()
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

.success_img{
    width: 335rpx;
    height: 230rpx;
    background-image: url(../../static/img/success.png);
	background-position: left bottom;
	background-size: 100% auto;
	// background-color: #f4fbff;
}
.fail_img {
    width: 335rpx;
    height: 230rpx;
    background-image: url(../../static/img/fail.png);
	background-position: left bottom;
	background-size: 100% auto;
}
.go_img{
    width: 42rpx;
    height: 42rpx;
    background-image: url(../../static/img/go.png);
	background-position: left bottom;
	background-size: 100% auto;
}

.btn-row {
		width: 700rpx;
		.btn {
			width: 100%;
            height: 100rpx;
		}
	}
</style>
