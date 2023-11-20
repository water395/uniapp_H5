<template>
	<view class="content">
		<!-- <view v-if="hasLogin" class="home">
			<view class="sao-box u-panel-auto flex-row-center u-bg-theme">
				<view class="sao-btn flex-column-center u-color-white">
					<text class="iconfont u-size-50 icon-saoyisao"></text>
					<text class="u-size-26">首页</text>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import filter from '@/common/js/filter.js'
	export default {
		onLoad() {
			let { citicbank_token , code} = filter.getQueryObject() || {};  //获取链接参数code
			console.log(`citicbank_token:${citicbank_token},code:${code},身份code:${citicbank_token || code}`);
			if(uni.getStorageSync('accId')){
				uni.setStorageSync("accId","")
			}
			if( citicbank_token || code ){
				uni.setStorageSync("appType",citicbank_token ? "citicbank_token" : "code")
				uni.setStorageSync('code', citicbank_token ||  code) ;
				uni.navigateTo({url: '../main/home'});
			}else{
				uni.navigateTo({url: '../login/login'});
			}

		},
	}
</script>

<style lang="scss">
.home {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	.sao-box {
		width: 140rpx;
		height: 140rpx;
		border-radius: 100%;
		border: 8rpx solid #98B7E6;
	}
}

</style>
