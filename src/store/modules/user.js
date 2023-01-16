import { login } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'

const state = {
	token: getToken(),
	name: '',
	avatar: ''
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
	}
}

const actions = {
	// 用户登录
	login ({ commit }, userInfo) {
		const { username, password } = userInfo
		return new Promise((resolve, reject) => {
			login({ username: username.trim(), password: password }).then(response => {
				const { data } = response
				commit('SET_TOKEN', data.token)
				setToken(data.token)
				resolve()
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 移除token
	resetToken ({ commit }) {
		return new Promise(resolve => {
			commit('SET_TOKEN', '')
			removeToken()
			resolve()
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
