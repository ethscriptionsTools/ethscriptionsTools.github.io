<template>
  <div>
    <el-dialog title="Mint" class="dialog-mint" :visible.sync="visible" width="45%" :before-close="handleClose"
               :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="140px" label-position="left" :rules="rules" :show-message="false"
               hide-required-asterisk>
        <!-- tick -->
        <el-form-item prop="tick" label="Tick">
          <template slot="label">
            Tick
            <el-tooltip popper-class="perc-pop" effect="light"
                        content="Please use a unique 4 characters word as token tick. All characters are lowercase"
                        placement="top">
              <img class="question-svg" src="@/assets/images/question.svg"/>
            </el-tooltip>
          </template>
          <el-input v-model="form.tick" maxlength="4" :show-word-limit="false" placeholder="Please input 4 characters like 'abcd'..."
                    clearable></el-input>
        </el-form-item>
        <!-- amount -->
        <el-form-item prop="amount" label="Number" v-if="rollupSize !== 1">
          <div slot="label" style="">
            Mint Number
            <el-tooltip popper-class="perc-pop" effect="light"
                        content="The number of mint, when > 1, it is batch mint, and the unconsumed gas of the transaction will be automatically refunded" placement="top">
              <img class="question-svg" src="@/assets/images/question.svg"/>
            </el-tooltip>
          </div>

          <el-input v-model="form.amount" :show-word-limit="false" placeholder="Please input mint number" clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="success" size="large" @click="toMint" round>{{ form.amount > 1 ? 'BATCH MINT' : 'MINT' }}
        </el-button>
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
import {mapState} from 'vuex'
import web3Utils from 'utils/web3utils/util'

export default {
  name: 'MintDialog',
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
      dialogLoadingVisible: false,
      visible: false,
      form: {
        tick: '',
        amount: 1
      },
      rules: {
        tick: [
          {required: true, message: 'Please input right tick with 4 characters'},
          {min: 4, max: 4, message: 'Please input right tick with 4 characters'}
        ],
        amount: [
          {
            validator: (rule, value, callback) => {
              const reg = /(^[1-9]+[0-9]*$)/
              if (!reg.test(value)) {
                callback(new Error('Please input right number'))
              } else if (this.rollupSize > 1 && Number(value) > this.rollupSize) {
                callback(new Error('Exceed maximum quantity'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      rollupSize: null
    }
  },
  methods: {
    init(data) {
      if (data != undefined) {
        const {tick, rollupSize} = data
        this.form.tick = tick
        this.rollupSize = rollupSize ? Number(rollupSize) : 1
      }
      this.visible = true
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.rollupSize = null
      this.visible = false
    },
    toMint() {
      this.$refs.form.validate((valid, unvalidObj) => {
        if (valid) {
          console.log(this.form.tick)
          // number => this.form.num
          this.dialogLoadingVisible = true
          if (this.form.amount > 1) {
            web3Utils.userBatchMint(
                this.userAddress,
                this.form.tick,
                this.form.amount,
                full => {
                  this.dialogLoadingVisible = false
                  this.visible = full
                },
                (res, success) => {
                  if (!success) {
                    this.$notify({
                      title: 'Batch Mint Error',
                      message: 'Batch Mint failed, please check for errors and try again',
                      type: 'error',
                      duration: 5000
                    })
                  } else {
                    this.form = {
                      tick: '',
                      amount: 1
                    }
                    this.$notify({
                      title: 'Batch Mint Success',
                      message: '💐💐💐Congratulations, you have successfully minted tokens',
                      type: 'success',
                      duration: 5000
                    })
                  }
                }
            )
          } else {
            web3Utils.mintToken(
                this.userAddress,
                this.form.tick,
                full => {
                  this.dialogLoadingVisible = false
                  this.visible = full
                },
                (res, success) => {
                  if (!success) {
                    this.$notify({
                      title: 'Mint Error',
                      message: 'Mint failed, please check for errors and try again',
                      type: 'error',
                      duration: 5000
                    })
                  } else {
                    this.form = {
                      tick: '',
                      amount: 1
                    }
                    this.$notify({
                      title: 'Mint Success',
                      message: '💐💐💐Congratulations, you have successfully minted tokens',
                      type: 'success',
                      duration: 5000
                    })
                  }
                }
            )
          }
        } else {
          const errMsg = unvalidObj[Object.keys(unvalidObj)[0]][0].message
          this.$message.warning({message: errMsg, customClass: 'perc-message'})
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.dialog-mint {
  /deep/ .el-dialog {
    background: #0e0e0e;
    min-width: 350px;
    border-radius: 20px;

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

    .dialog-footer {
      margin-top: 20px;

      .el-button {
        width: 150px;
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
