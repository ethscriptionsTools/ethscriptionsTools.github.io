<template>
  <div class="main">
    <perc-header/>
    <div class="content-main">
      <!-- title text -->
      <div style="padding: 1.25rem">
        <nya-container
            v-for="(item, index) in $store.state.login.tools"
            :key="index"
            :icon="item.icon"
            :title="item.title"
        >
          <template v-for="(tool, index2) in item.list">
            <!--是外链的情况-->
            <template v-if="tool.link">
              <a
                  :key="index2"
                  target="_blank"
                  :title="tool.desc"
                  :href="tool.linkUrl"
                  class="nya-btn"
                  :class="[tool.hot, {'badge': tool.hot}]"
              >
                <div style="display: flex;flex-direction: row;align-items: center">
                  <img style="width: 50px;height: 50px;margin-right: 10px;border-radius: 50%"
                       :src="tool.icon">
                  <div> {{ tool.name }}
                    <div class="desc">
                      {{ tool.desc }}
                    </div>
                  </div>
                </div>
                <div v-if="item.social" class="vsocial">
                  <a v-if="tool.twitter.length>0" title="Twitter" href="https://twitter.com/Ethscriptions"
                     target="_blank" rel="noopener noreferrer">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-twitter"/>
                    </svg>
                  </a>
                  <a v-if="tool.telegram.length>0" title="Telegram" href="https://t.me/ethscriptions"
                     target="_blank" rel="noopener noreferrer">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-telegram"/>
                    </svg>
                  </a>
                  <a v-if="tool.github.length>0" title="GitHub"
                     href="https://github.com/EthscriptionsTools" target="_blank"
                     rel="noopener noreferrer">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-github"/>
                    </svg>
                  </a>
                </div>

              </a>
            </template>
            <!--不是外链的情况-->
            <template v-else>
              <router-link
                  :key="index2"
                  target="_blank"
                  :title="tool.desc"
                  :to="tool.path"
                  class="nya-btn"
                  :class="[tool.hot, {'badge': tool.hot}]"
              >
                <div style="display: flex;flex-direction: row;align-items: center">
                  <img style="width: 50px;height: 50px;margin-right: 10px;border-radius: 50%"
                       :src="tool.icon">
                  <div> {{ tool.name }}
                    <div class="desc">
                      {{ tool.desc }}
                    </div>
                  </div>
                </div>
              </router-link>
            </template>
          </template>
        </nya-container>
      </div>
      <deploy-dialog ref="deposit" @refresh="getData"/>
      <mint-dialog ref="mint"/>
    </div>
    <perc-footer/>
  </div>
</template>

<script>
import PercHeader from './header.vue'
import PercFooter from './footer.vue'
import {mapState} from 'vuex'
import web3Utils from '../utils/web3utils/util'
import {BigNumber as BNumber} from 'bignumber.js'
import dayjs from 'dayjs'
import DeployDialog from '../components/common/DeployDialog.vue'
import MintDialog from '../components/common/MintDialog.vue'
import * as types from '@/store/mutation_types'

const cols = [
  {
    label: 'Tick',
    prop: 'tick',
    width: '140'
  },
  {
    label: 'Contract',
    prop: 'contract',
    width: '160'
  },
  {
    label: 'Deploy Time',
    prop: 'deployTime',
    width: '170',
    noTip: true
  },
  {
    label: 'HC/LPM',
    prop: 'hcLpm',
    width: '180',
    noTip: true
  },
  {
    label: 'Rollup Size',
    prop: 'rollupSize',
    width: '120'
  },
  {
    label: 'Frozen Time',
    prop: 'frozenTime',
    width: '130'
  },
  {
    label: 'Condition',
    prop: 'condition',
    width: '130'
  },
  {
    label: 'Funding Rate',
    prop: 'fundingRate',
    width: '140'
  },
  {
    label: 'Progress',
    prop: 'progress',
    width: '130'
  }
]
export default {
  name: 'Index',
  components: {PercHeader, PercFooter, DeployDialog, MintDialog},
  computed: {
    ...mapState({
      isLogin: state => state.login.isLogin,
      userAddress: state => state.login.userAddress,
      userInfo: state => state.login.userInfo,
      web3Bean: state => state.login.web3Bean,
      tools: state => state.login.tools
    })
  },
  filters: {
    formatAddress(address = '') {
      const addLen = address.length
      return addLen ? address.slice(0, 6) + '...' + address.slice(addLen - 4) : ''
    },
    formatNum(num) {
      let res = '0'
      if (num) {
        const value = Math.trunc(num)
        res = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      }
      return res + ''
    }
  },
  data() {
    return {
      address: process.env.VUE_APP_FACTORY_CONTRACT_ADDRESS,
      tick: '',
      cols,
      curTab: 0,
      tabs: [
        {label: 'ALL', value: 0},
        {label: 'IN-PROGRESS', value: 1},
        {label: 'ENDED', value: 2}
      ],
      tableData: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 5
      }
    }
  },
  created() {
  },
  mounted() {
    console.log('mounted', this.userAddress, this.userAddress == 'null', this.isLogin)
    if (this.userAddress == 'null' || !this.isLogin) {
      var userAddress = null
      this.$store.commit(types.LOGIN_STATUS, false)
      this.$store.commit(types.SET_USER_ADDRESS, userAddress)
      localStorage.setItem('loginStatus', false)
      localStorage.setItem('walletAddress', userAddress)
    }
    this.getData()
  },
  watch: {},
  methods: {
    goAddress(event, address = this.address) {
      window.open(process.env.VUE_APP_EXPLORER_SCAN_URL + 'address/' + address, '_blank')
    },
    copyAddress(event, address = this.address) {
      this.$utils.copy(address, event)
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getData()
    },
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage
      this.getData()
    },
    getData() {
      this.getIncriptionList(this.page.currentPage, this.page.pageSize, this.curTab)
    },
    changeTab(item) {
      this.curTab = item.value
      this.page.currentPage = 1
      this.getIncriptionList(this.page.currentPage, this.page.pageSize, this.curTab)
    },
    getIncriptionList: function (page, size, type) {
      web3Utils.getIncriptionList(this.userAddress, page, size, type, result => {
        let data = []
        for (let i = 0; i < result['inscriptions_'].length; i++) {
          let item = result['inscriptions_'][i]
          let total = result['totalSupplies_'][i]
          if (item[0].length > 0) {
            let project = {
              tick: item[0],
              name: item[1],
              contract: item.addr,
              deployTime: dayjs(new Date(Number((item['timestamp'] + '').slice(0, (item['timestamp'] + '').length) + '') * 1000)).format('YYYY-MM-DD HH:mm:ss'),
              hc: new BNumber((item['cap'] + '').slice(0, (item['cap'] + '').length)).dividedBy(1e18).toString(),
              lpm: new BNumber((item['limitPerMint'] + '').slice(0, (item['limitPerMint'] + '').length)).dividedBy(1e18).toString(),
              rollupSize: (item['maxMintSize'] + '').slice(0, (item['maxMintSize'] + '').length),
              frozenTime: (item['freezeTime'] + '').slice(0, (item['freezeTime'] + '').length) / 60 + 'Min',
              condition: 'Free',
              fundingRate: new BNumber((item['crowdFundingRate'] + '').slice(0, (item['crowdFundingRate'] + '').length)).dividedBy(1e18).toString() + ' BNB',
              // progress: 10
              progress: new BNumber((total + '').slice(0, (total + '').length))
                  .multipliedBy('100')
                  .dividedBy(new BNumber((item['cap'] + '').slice(0, (item['cap'] + '').length)))
                  .toFixed(2)
            }
            console.log(project)
            data.push(project)
          }
        }
        this.tableData = data
        this.page.total = Number((result['total_'] + '').slice(0, (result['total_'] + '').length))
      })
    },
    showDialog(type, data) {
      const isLogin = this.$isLogin()
      if (isLogin) {
        this.$refs[type].init(data || undefined)
      }
    }
  }
}
</script>
<style lang="scss">
.content-main {
  span.mb {
    display: block;
    margin-bottom: 15px;
  }

  table {
    width: 100%;
    table-layout: auto;
  }

  ._ad {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nya-btn {
    position: relative;
    margin: 7px;
    width: calc(25% - 20px);
    //text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 0.3s ease;
    font-size: 18px;
    border-radius: 10px;
    box-shadow: 0 0.0625rem 0.5rem 0.0625rem rgba(0, 0, 0, .05);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px 0px rgba(10, 14, 29, 0.04),
      0px 8px 64px 0px rgba(10, 14, 29, 0.08);
    }

    @media (max-width: 1050px) {
      width: calc(33% - 14px);
    }

    @media (max-width: 900px) {
      width: calc(100% / 2 - 14px);
    }

    @media (max-width: 700px) {
      box-shadow: none;
      margin: 5px;
      width: calc(98% - 10px);
    }

    .vsocial {
      margin-top: 5px;
      margin-left: 50px;
      display: flex;
      align-items: center;

      a {
        color: inherit;
      }

      .icon {
        cursor: pointer;
        $iconSize: 26px;
        width: $iconSize;
        height: $iconSize;
        margin: 0 7px;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
        background-color: rgba($color: #fff, $alpha: 0.65);
        color: #222831;
        border-radius: 50%;
        padding: 5px;
        box-shadow: 8px 14px 38px rgba(39, 44, 49, 0.06),
        1px 3px 8px rgba(39, 44, 49, 0.03);
      }
    }
  }

  .pay {
    width: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-around;

    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0;
      list-style: none;
      padding: 10px;

      .name {
        text-align: center;
        font-size: 25px;
        font-weight: bold;
        margin-top: 5px;
      }

      .address {
        margin: 2rem 0 5px;
      }

      img {
        width: 200px;
        max-width: 100%;
      }
    }
  }

  .badge {
    &::after {
      content: '';
      position: absolute;
      top: 5px;
      right: 5px;
      color: #fff;
      font-weight: lighter;
      text-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.2);
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    &.new::after {
      background-color: var(--theme-success);
    }

    &.hot::after {
      background-color: var(--theme-danger);
    }

    &.dev::after {
      background-color: #ffb525;
    }

    &.recommend::after {
      background-color: var(--theme);
    }
  }

  .badge-info {
    display: inline-flex;
    align-items: center;

    .badge {
      display: inline-flex;
      margin-right: 20px;
      align-items: center;

      &::after {
        position: relative;
        left: auto;
        margin-left: 10px;
        top: auto;
        display: inline-block;
      }
    }
  }
}

</style>

<style scoped lang="less">
@import '../assets/style/variables.less';

.main, .content-main {
  height: 100vh;
  width: 100%;
}

.content-main {
  padding: 90px 0;
  overflow-y: auto;
  //   :-webkit-scrollbar {
  //     display: none;
  // }
}

i {
  margin: 0 4px;
  cursor: pointer;
}

.banner {
  color: #fff;
  max-width: 600px;
  margin: 0 auto;
  padding: 35px;
  text-align: center;

  .slogan {
    margin-top: 20px;
  }

  img {
    width: 100px;
    height: 100px;
    vertical-align: middle;
  }

  .banner-title {
    line-height: 1.2;
    text-transform: capitalize;
    font-size: 40px;
  }

  .des {
    line-height: 30px;
    max-width: 530px;
    margin: 10px auto;
  }

  .address {
    font-size: 16px;
    margin: 10px 0 30px;
  }

  .btns button {
    width: 150px;
  }
}

.card {
  color: #fff;
  max-width: 90%;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0px 0px 20px rgba(127, 186, 125, 0.55);
  border-radius: 11px;
  padding: 20px;
  background-color: rgba(127, 186, 125, 0.55);

  .search-input {
    width: 70%;
    margin-top: 10px;

    /deep/ .el-input-group__append {
      background: transparent;
      border: none;
      padding-left: 10px;

      i {
        font-size: 22px;
        font-weight: bold;
        color: #ffffffaa;
      }
    }

    /deep/ input {
      border-radius: 20px !important;
      background: rgba(255, 255, 255, 0.2) !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
      color: #fff;
      font-size: 16px !important;

      &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #0e0e0e !important;
      }

      &:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #0e0e0e !important;
      }

      &::-ms-input-placeholder {
        /* Microsoft Edge */
        color: #0e0e0e !important;
      }
    }
  }

  .page-input {
    width: 92%;
    margin-top: 10px;

    /deep/ .el-input-group__append {
      background: transparent;
      border: none;
      padding-left: 10px;

      i {
        font-size: 22px;
        font-weight: bold;
        color: @baseColor;
      }
    }

    /deep/ input {
      border-radius: 20px !important;
      background: rgba(255, 255, 255, 0.2) !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
      color: #fff;
      font-size: 16px !important;

      &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #0e0e0e !important;
      }

      &:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #0e0e0e !important;
      }

      &::-ms-input-placeholder {
        /* Microsoft Edge */
        color: #0e0e0e !important;
      }
    }
  }
}

.group-tabs {
  background: rgba(255, 255, 255, 0.15);
  width: fit-content;
  margin-left: auto;
  padding: 10px;
  border-radius: 30px;

  .group-tab {
    display: inline-block;
    font-size: 15px;
    color: #fff;
    border-radius: 50px;
    background: transparent;
    position: relative;
    z-index: 1;
    padding: 10px 20px;
    min-width: 40px;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;

    &.active {
      background: @btnColor;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2) !important;
    }
  }
}

.el-table {
  width: 100%;
  margin-top: 10px;
  background: transparent;

  &::before {
    height: 0 !important;
  }

  .primary-text {
    color: @textColor;
    font-size: 22px;
  }

  .sub-text {
    color: #f2f2f2;
    font-size: 14px;
  }

  /deep/ .el-progress__text {
    color: #fff;
    font-weight: bold;
  }
}

.el-pagination {
  margin-top: 10px;

  /deep/ button {
    height: 28px;
    width: 28px;
    min-width: 28px;
    border-radius: 50%;
    background: @baseColor;
    color: #fff;
    margin-right: 8px;
    text-align: center;

    i {
    }
  }

  /deep/ li {
    height: 28px;
    width: 28px;
    min-width: 28px;
    border-radius: 50%;
    background: @baseColor;
    color: #fff;
    margin-right: 8px;
  }

  /deep/ li.active {
    background: #2c3e50 !important;
  }
}

@media only screen and (max-width: 600px) {
  .banner {
    padding: 25px 10px;

    .address {
      font-size: 12px;
    }
  }

  .card {
    padding: 25px 15px;

    .group-tabs {
      margin: auto;
    }

    .group-tab {
      font-size: 12px;
      border-radius: 25px;
      padding: 6px 15px;
      min-width: 50px;
    }

    .search-input {
      width: 100%;
      margin: 0 0 10px;
    }
  }

  .mint-table {
    font-size: 14px !important;
  }
}
</style>
<style lang="less">
.mint-table {
  font-size: 16px !important;

  tr {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid #7fba7d;
    color: #fff;
    border-color: #7fba7d !important;

    &:hover > td {
      background: rgba(255, 255, 255, 0.1) !important;
    }

    td {
      background: rgba(255, 255, 255, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
  }

  .el-table__fixed-right,
  .el-table__fixed-right::before {
    background: #68aa62 !important;
  }

  th {
    background: #68aa62 !important;
    border: 0px solid #fff;
    color: #fff;
    border-color: #68aa62 !important;
  }
}
</style>
<style lang="scss">
/* 屏幕小于1024px */
@media screen and (max-width: 1024px) {
  .dialog-bottom,
  .dialog-user {
    .el-dialog {
      width: 99% !important;
      position: absolute !important;
      margin: 0 0.5% 0px !important;
      bottom: 0px;
      border-radius: 10px 10px 0 0;
    }
  }

  .dialog-loading {
    .el-dialog {
      width: 200px !important;
      height: 200px;
      position: absolute !important;
      margin: 0 calc(50% - 100px) 0px !important;
      bottom: calc(50% - 100px);
      border-radius: 20px;
    }
  }
}

/* 屏幕大于1024px */
@media screen and (min-width: 1024px) {
  .dialog-bottom,
  .dialog-user {
    .el-dialog {
      border-radius: 10px;
      width: 35%;
      display: table;
    }
  }

  .dialog-loading {
    .el-dialog {
      width: 200px !important;
      height: 200px;
      position: absolute !important;
      margin: 0 calc(50% - 100px) 0px !important;
      bottom: calc(50% - 100px);
      border-radius: 20px;
      display: table;
    }
  }
}

//header样式
.dialog-user {
  .el-dialog {
    .el-dialog__header {
      .el-dialog__title {
        font-size: 15px;
        font-weight: bold;
      }

      .el-dialog__close {
        font-weight: bold;
      }
    }

    .el-dialog__body {
      padding: 0;
      margin: 20px 20px !important;
      border-radius: 10px !important;
      border: 1px solid #ced0d9 !important;

      .deposit-input-div {
        margin: 10px;
        align-items: center;

        .icon-div {
          display: flex;
          align-items: center;
          font-weight: bold;

          .hqtYUO {
            width: 24px;
            height: 24px;
            background: radial-gradient(white 50%, rgba(255, 255, 255, 0) calc(75% + 1px), rgba(255, 255, 255, 0) 100%);
            border-radius: 50%;
            box-shadow: black 0px 0px 1px;
            border: 0px solid rgba(255, 255, 255, 0);
          }
        }
      }
    }
  }
}
</style>
