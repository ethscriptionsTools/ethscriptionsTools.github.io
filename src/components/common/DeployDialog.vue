<template>
  <div>
    <el-dialog title="Deploy" class="dialog-deploy" :visible.sync="visible" width="45%" :before-close="handleClose"
               :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="140px" label-position="left" :rules="rules" :show-message="false"
               hide-required-asterisk>
        <!-- tick -->
        <el-form-item prop="tick">
          <template slot="label">
            Tick
            <el-tooltip popper-class="perc-pop" effect="light"
                        content="Please use a unique 4 characters word as token tick. All characters are lowercase"
                        placement="top">
              <img class="question-svg" src="@/assets/images/question.svg"/>
            </el-tooltip>
          </template>
          <el-input v-model="form.tick" maxlength="4" :show-word-limit="false" placeholder="4 characters like 'abcd'..."
                    clearable></el-input>
        </el-form-item>
        <!-- name -->
        <el-form-item prop="name">
          <template slot="label">
            Name
            <el-tooltip popper-class="perc-pop" effect="light"
                        content="Please use name to describe your token, the length must be less than 20."
                        placement="top">
              <img class="question-svg" src="@/assets/images/question.svg"/>
            </el-tooltip>
          </template>
          <el-input v-model="form.name" maxlength="20" :show-word-limit="false"
                    placeholder="Name of token(max 20 chars)" clearable></el-input>
        </el-form-item>
        <!-- hard cap -->
        <el-form-item label="Hard cap" prop="hardcap">
          <el-input v-model="form.hardcap" placeholder="0" clearable></el-input>
        </el-form-item>
        <!-- limit per mint -->
        <el-form-item prop="limit">
          <template slot="label">
            Limit Per Mint
            <el-tooltip popper-class="perc-pop" effect="light"
                        content="You will get this amount of tokens after each mint." placement="top">
              <img class="question-svg" src="@/assets/images/question.svg"/>
            </el-tooltip>
          </template>
          <el-input v-model="form.limit" placeholder="0" clearable></el-input>
        </el-form-item>
        <!-- more Setting -->
        <p @click="showMore = !showMore" class="more-tip">More Setting...</p>
        <template v-if="showMore">
          <!-- Rollup Size -->
          <el-form-item>
            <template slot="label">
              Rollup Size
              <el-tooltip popper-class="perc-pop" effect="light"
                          content="You can batch several mints in one transaction. This only available while non-frozen time"
                          placement="top">
                <img class="question-svg" src="@/assets/images/question.svg"/>
              </el-tooltip>
            </template>
            <el-input v-model="form.rollupSize" placeholder="1" clearable></el-input>
          </el-form-item>
          <!-- frozen Period -->
          <el-form-item>
            <template slot="label">
              Frozen Period
              <el-tooltip popper-class="perc-pop" effect="light"
                          content="Set frozen period for each mint (set 0 for non-frozen). Pay BNB tip to continue minting or wait for the frozen period to end"
                          placement="top">
                <img class="question-svg" src="@/assets/images/question.svg"/>
              </el-tooltip>
            </template>
            <el-input v-model="form.frozenPeriod" placeholder="600" clearable></el-input>
          </el-form-item>
          <!-- ERC20/NFT-->
          <el-form-item>
            <template slot="label">
              ERC20/NFT
              <el-tooltip popper-class="perc-pop" effect="light" content="Coming Soon..." placement="top">
                <img class="question-svg" src="@/assets/images/question.svg"/>
              </el-tooltip>
            </template>
            <el-input v-model="form.onlyContractAddress" readonly
                      placeholder="0x0000000000000000000000000000000000000000"></el-input>
          </el-form-item>
          <!-- Min Amount-->
          <el-form-item>
            <template slot="label">
              Min Amount
              <el-tooltip popper-class="perc-pop" effect="light" content="Coming Soon..." placement="top">
                <img class="question-svg" src="@/assets/images/question.svg"/>
              </el-tooltip>
            </template>
            <el-input v-model="form.onlyMinQuantity" readonly placeholder="0"></el-input>
          </el-form-item>
          <!-- Funding Rate Per Mint -->
          <el-form-item>
            <div slot="label" style="line-height:20px">
              Funding Rate Per Mint
              <el-tooltip popper-class="perc-pop" effect="light"
                          content="The crowdfunding price is denominated in BNB, with a single minting cost of 0.0001 BNB when 0.0001 is entered as input."
                          placement="top">
                <img class="question-svg" src="@/assets/images/question.svg"/>
              </el-tooltip>
            </div>
            <el-input v-model="form.fundingRate" placeholder="0" clearable></el-input>
          </el-form-item>
          <!-- Funding Address -->
          <el-form-item>
            <div slot="label" style="line-height:20px">
              Funding Address
              <el-tooltip popper-class="perc-pop" effect="light" content="The receiving address for donations"
                          placement="top">
                <img class="question-svg" src="@/assets/images/question.svg"/>
              </el-tooltip>
            </div>
            <el-input v-model="form.fundingAddress" placeholder="0" clearable></el-input>
          </el-form-item>
          <!-- Funding Address -->
          <el-form-item>
            <div slot="label" style="line-height:20px">
              Funding Lp Address
              <el-tooltip popper-class="perc-pop" effect="light" content="The receiving address for Lp" placement="top">
                <img class="question-svg" src="@/assets/images/question.svg"/>
              </el-tooltip>
            </div>
            <el-input v-model="form.crowdLpAddress" placeholder="0" clearable></el-input>
          </el-form-item>
          <!-- Lp Rate -->
          <el-form-item>
            <div slot="label" style="line-height:20px">
              Lp Rate
              <el-tooltip popper-class="perc-pop" effect="light"
                          content="Ratio of funds joining LP, 200 means 2%, value is 0-10000" placement="top">
                <img class="question-svg" src="@/assets/images/question.svg"/>
              </el-tooltip>
            </div>
            <el-input v-model="form.lpRate" placeholder="5000" clearable></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div class="dialog-footer">
        <el-button type="success" size="large" @click="toDeploy" round>DEPLOY</el-button>
        <div class="footer-tip">To prevent Sybil attacks, a deployment fee of 0.1 BNB will be charged.</div>
      </div>
    </el-dialog>
    <!--dialog-loading-->
    <el-dialog class="dialog-loading" :show-close="false" :close-on-click-modal="false"
               :visible.sync="dialogLoadingVisible" style="bottom: 0px">
      <div style="width: 100%;height: 100%;" v-loading="true" element-loading-text="Loading"
           element-loading-spinner="el-icon-loading" element-loading-background="#fff"></div>
    </el-dialog>
  </div>
</template>

<script>
import web3Utils from 'utils/web3utils/util'
import {mapState} from 'vuex'

export default {
  name: 'DeployDialog',
  computed: {
    ...mapState({
      isLogin: state => state.login.isLogin,
      userAddress: state => state.login.userAddress,
      userInfo: state => state.login.userInfo,
      web3Bean: state => state.login.web3Bean
    })
  },
  data() {
    return {
      visible: false,
      dialogLoadingVisible: false,
      form: {
        tick: '',
        name: '',
        hardcap: 0,
        limit: 0,
        rollupSize: 1,
        frozenPeriod: 600,
        onlyContractAddress: '0x0000000000000000000000000000000000000000',
        onlyMinQuantity: 0,
        fundingRate: 0.0001,
        fundingAddress: '0x0000000000000000000000000000000000000000',
        crowdLpAddress: '0x0000000000000000000000000000000000000000',
        lpRate: 5000
      },
      showMore: false,
      rules: {
        tick: [
          {required: true, message: 'Please input right tick with 4 characters'},
          {min: 4, max: 4, message: 'Please input right tick with 4 characters'}
        ],
        name: [
          {required: true, message: 'Please input right name'},
          {min: 1, max: 20, message: 'Please input right name'}
        ],
        hardcap: [{required: true, message: 'Please enter the Hard cap'}],
        limit: [{required: true, message: 'Please enter the Limit Per Mint'}]
      }
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.showMore = false
      this.visible = false
    },
    toDeploy() {
      this.$refs.form.validate((valid, unValidObj) => {
        if (valid) {
          this.dialogLoadingVisible = true
          web3Utils.deploy(
              this.userAddress,
              this.form.tick,
              this.form.name,
              this.form.hardcap,
              this.form.limit,
              this.form.rollupSize,
              this.form.frozenPeriod,
              this.form.onlyContractAddress,
              this.form.onlyMinQuantity,
              this.form.fundingRate,
              this.form.fundingAddress,
              this.form.crowdLpAddress,
              this.form.lpRate,
              full => {
                this.dialogLoadingVisible = false
                this.visible = full
              },
              (res, success) => {
                this.form = {
                  tick: '',
                  name: '',
                  hardcap: 0,
                  limit: 0,
                  rollupSize: 1,
                  frozenPeriod: 600,
                  onlyContractAddress: '0x0000000000000000000000000000000000000000',
                  onlyMinQuantity: 0,
                  fundingRate: 0.0001,
                  fundingAddress: '0x0000000000000000000000000000000000000000',
                  crowdLpAddress: '0x0000000000000000000000000000000000000000',
                  lpRate: 5000
                }
                this.showMore = false
                if (!success) {
                  this.$notify({
                    title: 'Deploy Error',
                    message: 'Deployment failed, please check for errors and try again',
                    type: 'error',
                    duration: 5000
                  })
                } else {
                  this.$notify({
                    title: 'Deploy Success',
                    message: '💐💐💐Deployment has been successful, start sharing your project',
                    type: 'success',
                    duration: 5000
                  })
                }
              }
          )
        } else {
          const errMsg = unValidObj[Object.keys(unValidObj)[0]][0].message
          this.$message.warning({message: errMsg, customClass: 'perc-message'})
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.dialog-deploy {
  /deep/ .el-dialog {
    background: #0e0e0e;
    min-width: 350px;
    border-radius: 20px;

    .el-input__suffix {
      color: #fff !important;
    }

    .el-dialog__header {
      background: #00000008;
    }

    .question-svg {
      width: 14px;
      height: 14px;
      vertical-align: text-bottom;
    }

    .el-icon-close {
      height: 20px;
      width: 20px;
      background: #e5e5e5ff;
      border-radius: 50%;
      color: #666;
      font-weight: bold;
      line-height: 20px;
    }

    .el-tooltip.el-icon-question {
      font-weight: bold;
    }

    .el-dialog_headerbtn {
      width: 20px;
      height: 20px;
      color: #666;
      background: #e5e5e5ff;
      line-height: 20px;
      border-radius: 50%;
    }

    .el-form-item {
      margin-bottom: 10px;
    }

    .el-form-item__label {
      color: #fff;
    }

    input {
      background: rgba(255, 255, 255, 0.3) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
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

    .el-dialog__title {
      color: #fff;
      font-weight: bold;
      font-size: 20px;
    }

    .more-tip {
      color: #fff;
      cursor: pointer;
    }

    .dialog-footer {
      .el-button {
        width: 150px;
      }

      .footer-tip {
        margin-top: 10px;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="less">
.perc-pop {
  color: #0e0e0e !important;
  font-weight: bold;
  border-color: #0e0e0e !important;
}

.perc-message {
  background: #0e0e0e !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  i,
  .el-message__content {
    color: #fff !important;
  }
}
</style>
