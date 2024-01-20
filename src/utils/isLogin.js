import Store from '@/store/index.js'
import { Message } from 'element-ui'
const isLogin = function () {
  const status = Store.state.login.isLogin && JSON.parse(Store.state.login.isLogin)
  if (!status) {
    Message({
      message: "Please connect your wallet first",
      type: 'warning',
      showClose: true, size: 'middle'
    })
  }
  return status
}
export default isLogin
