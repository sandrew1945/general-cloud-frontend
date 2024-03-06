<!--
  说明：新增/修改用户信息组件。
  使用方法：引用组件，然后如下实用：

  <UserForm
      :model.sync="showEditor"
      :invoke="'refreshList'"
      @refreshList="getList"
    />
  invoke中的方法名与后面@getSelected要一致，不指定则默认为getList，其中getList为父组件定义的方法
  multi表示是否支持多选

  getList: function(data) {
    console.log(JSON.stringify(data))
  }
-->

<template>
  <StickDialog
    :model.sync="showDialog"
    position="top"
  >
    <q-card style="width: 650px;">
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
        </q-avatar>
        <q-toolbar-title><b>请输入用户信息</b></q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
        />
      </q-toolbar>
      <q-card-section>
        <div class="row">
          <div class="col-md-4 col-xs-12 q-pb-lg">
            <AvatarUploader
              :model.sync="userInfo.avatar"
              :load-url="avatarUrl"
            />
          </div>
          <div class="col-md-8 col-xs-12">
            <q-form
              ref="userForm"
              @reset="reset"
              class="q-gutter-md"
            >
              <q-input
                outlined
                dense
                label="用户账号"
                v-model="userInfo.userCode"
                :readonly="operation === 'edit' ? true : false"
                debounce="2000"
                :rules="operation === 'edit' ? [] : [ userCodeVal ]"
              />
              <q-input
                outlined
                dense
                label="用户姓名"
                v-model="userInfo.userName"
                :rules="[ val => val && val.length > 0 || '请输入姓名']"
              />
              <FixcodeSelect
                :type="'1002'"
                :model.sync="userInfo.sex"
                :placeholder="'性别'"
                dense
                :rules="[ val => val !== '' || '请选择用户性别' ]"
              />
              <q-input
                v-model="userInfo.birthday"
                outlined
                dense
                type="date"
                hint="生日"
              />
              <q-input
                v-if="operation === 'create'"
                outlined
                dense
                label="密码"
                type="password"
                v-model="userInfo.password"
                :rules="[ val => val && val.length > 0 || '请输入密码']"
              />
              <q-input
                v-else
                outlined
                dense
                label="密码"
                type="password"
                v-model="userInfo.password"
              />
              <FixcodeSelect
                :type="'2001'"
                :model.sync="userInfo.userStatus"
                :placeholder="'用户状态'"
                dense
                :rules="[ val => val !== '' || '请选择用户状态' ]"
              />
              <q-input
                outlined
                dense
                label="电话"
                v-model="userInfo.phone"
              />
              <q-input
                outlined
                dense
                label="手机"
                v-model="userInfo.mobile"
              />
              <q-input
                outlined
                dense
                label="电子邮件"
                v-model="userInfo.email"
              />
              <div>
                <q-btn
                  v-if="operation === 'create'"
                  label="Submit"
                  type="button"
                  color="primary"
                  @click="handleCreate"
                />
                <q-btn
                  v-else
                  label="Update"
                  type="button"
                  color="primary"
                  @click="handleUpdate"
                />
                <q-btn
                  label="Reset"
                  type="reset"
                  color="primary"
                  flat
                  class="q-ml-sm"
                />
              </div>
            </q-form>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </StickDialog>
</template>

<script>
import FixcodeSelect from 'src/components/FixcodeSelect'
import StickDialog from 'src/components/Dialog/StickDialog'
import AvatarUploader from 'src/components/avatarUploader/index'
import { createUser, updateUserInfo, userValidate } from 'src/api/usermanager'
import { successNotify, warningNotify } from 'src/utils/Notify'

export default {
  name: 'UserForm',
  components: { FixcodeSelect, StickDialog, AvatarUploader },
  props: {
    model: {
      required: true,
      type: Boolean
    },
    operation: {
      required: true,
      type: String
    },
    reset: {
      required: true,
      type: Function,
      default: () => {}
    },
    // eslint-disable-next-line
    userInfo: {
      required: true,
      type: Object,
      userInfo: {
        userId: '',
        userCode: '',
        userName: '',
        password: '',
        phone: '',
        mobile: '',
        email: '',
        sex: '',
        birthday: '',
        avatar: '',
        userStatus: ''
      }
    }
  },
  data () {
    return {
      avatarUrl: '',
      user: {
        userCode: '',
        userName: '',
        password: '',
        phone: '',
        mobile: '',
        email: '',
        sex: '',
        birthday: '',
        avatar: '',
        userStatus: ''
      }
    }
  },
  computed: {
    showDialog: {
      get () {
        return this.model
      },
      set (val) {
        this.$emit('update:model', val)
      }
    }
  },
  watch: {
    showDialog: function (value) {
      if (value) {
        this.avatarUrl = process.env.API + '/auth/generate/loadImage?filePath='
        // this.avatarUrl = process.env.API + '/generate/loadImage?filePath=' + this.userInfo.avatar
        // this.uploadUrl = process.env.API + '/generate/uploadImg'
      }
    }
  },
  methods: {
    handleCreate () {
      this.$refs.userForm.validate().then(success => {
        if (success) {
          createUser(this.userInfo).then(() => {
            successNotify('Created Successfully')
            this.$nextTick(() => {
              this.reset()
              this.showDialog = false
              this.$emit('refresh')
            })
          })
        } else {
          warningNotify('请完善用户信息')
        }
      })
    },
    handleUpdate () {
      this.$refs.userForm.validate().then(success => {
        if (success) {
          updateUserInfo(this.userInfo).then(() => {
            successNotify('Update Successfully')
            this.$nextTick(() => {
              this.reset()
              this.showDialog = false
              this.$emit('refresh')
            })
          })
        } else {
          warningNotify('请完善用户信息')
        }
      })
    },
    userCodeVal (val) {
      if (val === '') {
        return '请输入用户代码'
      } else {
        return new Promise((resolve, reject) => {
          userValidate(val).then(res => {
            if (res.result === true && res.data === false) {
              resolve('用户代码已经存在')
            } else {
              resolve(true)
            }
          })
        })
      }
    }
  }
}
</script>
