import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
	baseURL: '',
	withCredentials: true,
	timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
	config => {
		// config包含请求的相关信息,可以在请求发送之前做一些自定义处理,例如给每个请求加上token
		if (store.getters.token) {
			config.headers['Example-Token'] = getToken()
		}
		return config
	},
	error => {
		// 请求出错的话,可以做一些处理
		console.log(error)
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	response => {
		const res = response.data

		// 一般请求成功返回的code是0
		if (res.code !== 0) {
			Message({
				message: res.msg || '出错啦!',
				type: 'error',
				duration: 5000
			})

			// 自定义一些code值,实际需要和后端沟通确定,例如50008代表token不存在,50012代表其他用户登录该账号,50014代表token过期,返回这三种code,让用户重新登录
			if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
				MessageBox.confirm('你已被强制登出,你可以停留在当前页面或重新登录', '确认登出', {
					confirmButtonText: '重新登录',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					store.dispatch('user/resetToken').then(() => {
						location.reload()
					})
				})
			}
			return Promise.reject(new Error(res.msg || '出错啦!'))
		} else {
			return res
		}
	},
	error => {
		console.log('错误:' + error)
		Message({
			message: error.message,
			type: 'error',
			duration: 5000
		})
		return Promise.reject(error)
	}
)

export default service
