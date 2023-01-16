<template>
	<div class="login-container">
		<el-form ref="loginForm" class="login-form" :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left">
			<div class="title-container">
				<h3 class="title">登录</h3>
			</div>
			<el-form-item prop="username">
				<el-input ref="username" v-model="loginForm.username" type="text" name="username" tabindex="1" auto-complete="on" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input ref="password" v-model="loginForm.password" type="password" name="password" tabindex="2" auto-complete="on" placeholder="密码" @keyup.enter.native="handleLogin"></el-input>
			</el-form-item>
			<el-button class="login-btn" type="primary" @click="handleLogin">登录</el-button>
			<div class="tips">
				<span>用户名: admin</span>
				<span>密码: 任意密码</span>
			</div>
		</el-form>
	</div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
	name: 'Login',
	data () {
		const validateUsername = (rule, value, callback) => {
			if (!validUsername(value)) {
				callback(new Error('请输入正确的用户名'))
			} else {
				callback()
			}
		}
		const validatePassword = (rule, value, callback) => {
			if (value.length < 6) {
				callback(new Error('密码长度不能小于6'))
			} else {
				callback()
			}
		}
		return {
			loginForm: {
				username: 'admin',
				password: '111111'
			},
			loginRules: {
				username: [{ required: true, trigger: 'blur', validator: validateUsername }],
				password: [{ required: true, trigger: 'blur', validator: validatePassword }]
			},
			loading: false,
			redirect: undefined
		}
	},
	watch: {
		$route: {
			handler (route) {
				this.redirect = route.query.redirect
			},
			immediate: true
		}
	},
	methods: {
		handleLogin () {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true
					this.$store.dispatch('user/login', this.loginForm).then(() => {
						this.$router.push({ path: this.redirect || '/' })
						this.loading = false
					}).catch(() => {
						this.loading = false
					})
				} else {
					console.log('验证未通过!')
					return false
				}
			})
		}
	}
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

// /* 修复input 背景不协调 和光标变色 */
// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .login-container .el-input input {
//     color: $cursor;
//   }
// }

.login-container{
	.el-input{
		display: inline-block;
		height: 47px;
		width: 85%;
		input{
			height: 47px;
			color: $light_gray;
			border: 0px;
			border-radius: 0px;
			background: transparent;
			padding: 12px 5px 12px 15px;
			-webkit-appearance: none;
			caret-color: $cursor;
			&:-webkit-autofill{
				box-shadow: 0 0 0px 1000px $bg inset !important;
				-webkit-text-fill-color: $cursor !important;
			}
		}
	}
	.el-form-item{
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
	}
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container{
	width: 100%;
	height: 100%;
	background: $bg;
	overflow: hidden;
	.login-form{
		position: relative;
		width: 520px;
		max-height: 100%;
		padding: 160px 35px 0;
		margin: 0 auto;
		overflow: hidden;
	}
	.login-btn{
		width: 100%;
		margin-bottom: 30px;
	}
	.tips{
		font-size: 14px;
		color: #fff;
		margin-bottom: 10px;
		span{
			&:first-of-type{
				margin-right: 16px;
			}
		}
	}
	.title-container{
		position: relative;
		.title{
			font-size: 26px;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
	}
}
</style>
