<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>

<style>
	/* 头条小程序需要把 iconfont 样式放到组件外 */
	@import "components/m-icon/m-icon.css";

	/*每个页面公共css */
	page {
		min-height: 100%;
		font-size: 16px;
	}

</style>
<style lang='scss'>
	@import "@/common/style/index.scss";
</style>