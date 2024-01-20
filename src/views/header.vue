<template>
  <div class="suspension-bar">
    <div style="display:flex;flex-direction: row;align-items: center">
      <img src="@/assets/images/logo.png" class="logo-img"/>
      <div class="logo">
        Ethscriptions
        <span class="on">Tools</span>
      </div>
    </div>
    <div class="right">
      <div class="theme-btn">
        <div v-if="$store.state.login.dark" class="type-icon" @click="switchTheme">
          <i class="eva eva-sun-outline"></i>
        </div>
        <div v-else class="type-icon" @click="switchTheme">
          <i class="eva eva-moon-outline"></i>
        </div>
      </div>
      <!-- Connect -->
      <div class="link" @click="walletDialogVisible = isLogin === 'true' || isLogin === true">
        <div class="flex-between" v-if="isLogin === 'true' || isLogin === true">
          <el-button round type="success" class="wallet-address">{{ plusDian(userAddress, 6, 4, 3) }}</el-button>
        </div>
        <div class="flex-between" v-else>
          <el-button round type="success" class="wallet-address" @click="linkWallet">Connect Wallet</el-button>
        </div>
      </div>

      <el-dialog class="dialog-user" title="Account" :visible.sync="walletDialogVisible" :append-to-body="true"
                 style="bottom: 0px;z-index: auto;margin-top: 10vh">
        <div class="deposit-input-div">
          <div class="icon-div">
            <span>Connected</span>
            <el-button class="wallet-disconnect" type="primary" @click="exit">
              DISCONNECT
            </el-button>
          </div>
          <p class="wallet-address">{{ plusDian(userAddress, 6, 4, 3) }}</p>
          <div class="button-div">
            <span style="display: flex;align-items: center;cursor: pointer;" plain @click="copyAddress($event)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span class="button-text">Copy Address</span></span
            >
            <span style="display: flex;align-items: center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <a class="button-text" @click="goAddress($event)" target="_blank">View in scan</a>
            </span>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import web3Utils from 'utils/web3utils/util'
import * as types from './../store/mutation_types'
import {plusDian} from 'utils/util'

export default {
  name: 'Header',
  components: {},
  data() {
    return {
      drawerVisible: false,
      inviteCode: null,
      walletDialogVisible: false
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.login.isLogin,
      userAddress: state => state.login.userAddress,
      userInfo: state => state.login.userInfo,
      web3Bean: state => state.login.web3Bean,
      dark: state => state.login.dark
    })
  },
  watch: {
    dark(newData, oldData) {
      if (newData) {
        document.documentElement.style.setProperty('--t1', "#ffffff");
        document.documentElement.style.setProperty('--t2', "#1f1f1f");
        document.documentElement.style.setProperty('--t3', "#eaeaea");
        document.documentElement.style.setProperty('color', "#f6f6f6");
        document.body.classList.add('dark');
      } else {
        document.documentElement.style.setProperty('--t1', "#2f3e4c");
        document.documentElement.style.setProperty('--t2', "#ffffff");
        document.documentElement.style.setProperty('--t3', "#637080");
        document.documentElement.style.setProperty('color', "#2f3e4c");
        document.body.classList.remove('dark');
      }
    }
  },
  mounted() {
    if (Boolean(JSON.parse(localStorage.getItem('theme'))) === undefined) {
      // 初次访问使用系统设置，否则使用 localStorage
      this.$store.commit('SET_STORE', {
        key: 'dark',
        value: window.matchMedia('(prefers-color-scheme: dark)').matches
      });
    }

    // 使用期间更改主题时，切换
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addListener(({matches}) => {
          this.$store.commit('SET_STORE', {
            key: 'dark',
            value: matches
          });
        });

    if (this.$store.state.login.dark) {
      document.documentElement.style.setProperty('--t1', "#ffffff");
      document.documentElement.style.setProperty('--t2', "#1f1f1f");
      document.documentElement.style.setProperty('--t3', "#eaeaea");
      document.documentElement.style.setProperty('color', "#f6f6f6");

      document.body.classList.add('dark');
    } else {
      document.documentElement.style.setProperty('--t1', "#2f3e4c");
      document.documentElement.style.setProperty('--t2', "#ffffff");
      document.documentElement.style.setProperty('--t3', "#637080");
      document.documentElement.style.setProperty('color', "#2f3e4c");
      document.body.classList.remove('dark');
    }
  },
  methods: {
    switchTheme() {
      //白色-》黑色
      this.$store.commit('SET_STORE', {
        key: 'dark',
        value: !this.$store.state.login.dark
      });
      localStorage.setItem('theme', this.$store.state.login.dark)
    },
    goAddress(event, address = this.userAddress) {
      window.open(process.env.VUE_APP_EXPLORER_SCAN_URL + 'address/' + address.toLowerCase(), '_blank')
    },
    copyAddress(event, address = this.userAddress) {
      this.$utils.copy(address, event)
    },
    plusDian(a, b, c, d) {
      return plusDian(a, b, c, d)
    },
    async linkWallet() {
      if (this.web3Bean != null || (this.web3Bean != null && this.web3Bean.account.address != null && this.web3Bean.account.address.startsWith('0x'))) {
        this.connect().then(async () => {
          // await this.getBalance();
          // this.login()
        })
        // this.net()
      } else {
        this.$notify({
          title: "Connect Error",
          message: "Please check if the wallet is unlocked",
          type: 'error'
        })
      }
    },
    async connect() {
      await web3Utils.connect(account => {
        if (account !== '') {
          console.log('types', types)
          this.web3Bean.account.address = account
          this.$store.commit(types.WEB3BEAN, this.web3Bean)
          this.$store.commit(types.LOGIN_STATUS, true)
          this.$store.commit(types.SET_USER_ADDRESS, account)
          localStorage.setItem('walletAddress', account)
          localStorage.setItem('loginStatus', true)
        }
      })
    },
    exit() {
      this.walletDialogVisible = false
      var userAddress = null
      console.log('types', types)
      this.$store.commit(types.LOGIN_STATUS, false)
      this.$store.commit(types.SET_USER_ADDRESS, userAddress)
      localStorage.setItem('loginStatus', false)
      localStorage.setItem('walletAddress', userAddress)

      var userInfo = {}
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      this.$store.commit(types.USER_INFO, userInfo)
    },
    // copy success
    onCopy(e) {
      console.log('copy success！')
      this.$notify({
        title: 'Copy Success',
        type: 'success'
      })
    },
    // 复制失败
    onError(e) {
      this.$notify({
        title: 'Copy Error',
        type: 'error'
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '/src/assets/style/variables.less';

.suspension-bar {
  .right {
    display: flex;
    align-items: center;

    .social {
      font-size: 18px;
      height: 25px;
      margin-right: 20px;
    }
  }
}

.theme-btn {
  margin-right: 10px;
  transition: all 0.3s ease;
  //opacity: 0.8;
  @media (min-width: 600px) {
    &:hover {
      top: 0;
      opacity: 1;
    }
  }
  @media (max-width: 600px) {
    &:active {
      top: 0;
      opacity: 1;
    }
  }

  .type-icon {
    position: relative;
    width: 40px;
    height: 40px;
    background-color: @btnColor;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @btnTextColor;
    cursor: pointer;
    font-size: 20px;
  }
}

</style>
<style scoped lang="scss">
.el-button {
  cursor: pointer;
  text-align: center;
  font-weight: 500;
}

.fdex-binance {
  padding: 8px;
  display: flex;
  border-radius: 5px;
  border: 1px solid #0e0e0e;
  background: #fff;
}

.fdex-binance-smart-chain {
  height: 18px;
  width: 18px;
  background-color: #0e0e0e;
  -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuNTA0MjYgNy41NjM3NEw5IDQuMDY4TDEyLjQ5NzQgNy41NjUyNkwxNC41MzE0IDUuNTMxMjZMOSAwTDMuNDcwNCA1LjUyOTZMNS41MDQzMyA3LjU2MzZMNS41MDQyNiA3LjU2Mzc0Wk0wIDlMMi4wMzQwNyA2Ljk2NTY0TDQuMDY4IDguOTk5NTdMMi4wMzM5MyAxMS4wMzM2TDAgOVpNNS41MDQyNiAxMC40MzY1TDkgMTMuOTMyTDEyLjQ5NzMgMTAuNDM0OEwxNC41MzI0IDEyLjQ2NzdMMTQuNTMxNCAxMi40Njg4TDkgMThMMy40NzA0IDEyLjQ3MDRMMy40Njc1MiAxMi40Njc1TDUuNTA0NDcgMTAuNDM2M0w1LjUwNDI2IDEwLjQzNjVaTTEzLjkzMiA5LjAwMDg2TDE1Ljk2NjEgNi45NjY3OUwxOCA5LjAwMDcyTDE1Ljk2NiAxMS4wMzQ4TDEzLjkzMiA5LjAwMDg2WiIgZmlsbD0iIzQ0RjFBNiIvPgo8cGF0aCBkPSJNMTEuMDYyOSA4Ljk5ODk1SDExLjA2MzhMOSA2LjkzNUw3LjQ3NDU0IDguNDYwMDNMNy4yOTkyOSA4LjYzNTM1TDYuOTM3ODUgOC45OTY4Nkw2LjkzNDk3IDguOTk5NjdMNi45Mzc4NSA5LjAwMjYyTDkgMTEuMDY1MUwxMS4wNjQgOS4wMDExMUwxMS4wNjUgOC45OTk5NkwxMS4wNjMxIDguOTk4OTUiIGZpbGw9IiM0NEYxQTYiLz4KPC9zdmc+Cg==);
  mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuNTA0MjYgNy41NjM3NEw5IDQuMDY4TDEyLjQ5NzQgNy41NjUyNkwxNC41MzE0IDUuNTMxMjZMOSAwTDMuNDcwNCA1LjUyOTZMNS41MDQzMyA3LjU2MzZMNS41MDQyNiA3LjU2Mzc0Wk0wIDlMMi4wMzQwNyA2Ljk2NTY0TDQuMDY4IDguOTk5NTdMMi4wMzM5MyAxMS4wMzM2TDAgOVpNNS41MDQyNiAxMC40MzY1TDkgMTMuOTMyTDEyLjQ5NzMgMTAuNDM0OEwxNC41MzI0IDEyLjQ2NzdMMTQuNTMxNCAxMi40Njg4TDkgMThMMy40NzA0IDEyLjQ3MDRMMy40Njc1MiAxMi40Njc1TDUuNTA0NDcgMTAuNDM2M0w1LjUwNDI2IDEwLjQzNjVaTTEzLjkzMiA5LjAwMDg2TDE1Ljk2NjEgNi45NjY3OUwxOCA5LjAwMDcyTDE1Ljk2NiAxMS4wMzQ4TDEzLjkzMiA5LjAwMDg2WiIgZmlsbD0iIzQ0RjFBNiIvPgo8cGF0aCBkPSJNMTEuMDYyOSA4Ljk5ODk1SDExLjA2MzhMOSA2LjkzNUw3LjQ3NDU0IDguNDYwMDNMNy4yOTkyOSA4LjYzNTM1TDYuOTM3ODUgOC45OTY4Nkw2LjkzNDk3IDguOTk5NjdMNi45Mzc4NSA5LjAwMjYyTDkgMTEuMDY1MUwxMS4wNjQgOS4wMDExMUwxMS4wNjUgOC45OTk5NkwxMS4wNjMxIDguOTk4OTUiIGZpbGw9IiM0NEYxQTYiLz4KPC9zdmc+Cg==);
}

.flex-between {
  display: flex;
  cursor: pointer;
  justify-content: center;
}

.flex-between .wallet-address {
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
}

.logo {
  margin-left: 10px;
}

.logo-img {
  margin-left: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%
}

@media only screen and (max-width: 600px) {
  .logo-img {
    width: 30px;
    height: 30px;
    border-radius: 50%
  }
  .logo {
    display: flex;
    flex-direction: column;
    justify-content: left;
  }

  .flex-between .wallet-address {
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
  }
}

.deposit-input-div {
  display: block;

  .icon-div {
    display: flex;
    justify-content: space-between;

    .wallet-disconnect {
      margin-left: 10px;
      font-size: 12px;
      padding: 8px 12px;
      background: #0e0e0e;
      border: 1px solid #0e0e0e;
      border-radius: 15px;
      color: #fff;
    }
  }

  .wallet-address {
    line-height: 22px;
    overflow: hidden;
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #464646;
    font-weight: bold;
    max-width: 50%;
  }

  .button-div {
    display: flex;
    justify-content: space-between;

    .button-text {
      cursor: pointer;
      color: #606266;
      margin-left: 5px;
    }
  }
}
</style>
