import dayjs from 'dayjs'
import copy from './clicpboard'
const plugins = { day: dayjs }
const utils = {copy}
export default {
  install(Vue) {
    // 挂载插件
    Object.keys(plugins).forEach(key => {
      Vue.prototype['$' + key] = plugins[key]
    })
    // 挂载utils
    const $utils = {};
    Object.keys(utils).forEach(key => {
      $utils[key] = utils[key]
    })
    Vue.prototype.$utils = $utils
  }
}