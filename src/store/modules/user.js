import { login, logout, getInfo, getRouter } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { finByUserId } from '@/api/system/acount/index'
import { constantRoutes } from '../../router/index'

const state = {
  token: getToken(),
  user: '',
  name: '',
  buttonList: [],
  routerList: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_BUTTONLIST: (state, buttonList) => {
    state.buttonList = buttonList
  },
  SET_ROUTERLIST: (state, routerList) => {
    state.routerList = routerList
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username, password: password }).then(response => {
        const { data } = response
        setToken(data.token)
        commit('SET_TOKEN', data.token)
        commit('SET_NAME',data.trueName)
        window.localStorage.setItem('name',data.trueName)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      finByUserId(`1`).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录...')
        }
        const { name } = data
        commit('SET_USER', name)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getRouter({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRouter().then(res => {
        let data = res.data
        commit('setButtonList', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  setRouterList({ commit }, routerList) {
    commit('SET_ROUTERLIST', constantRoutes.concat(routerList))
  },
  setName({ commit }, name) {
    commit('SET_NAME', name)
  },
  setButtonList({ commit }, buttonList) {
    commit('SET_BUTTONLIST',buttonList)
  },

  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  resetToken({ commit }) {
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
