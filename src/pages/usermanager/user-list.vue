<template>
  <q-page :class="this.$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="row q-gutter-md">
        <n-container
          :sm="5"
          :mid="2"
          :lg="2"
        >
          <q-input
            dense
            outlined
            v-model="listQuery.userCode"
            placeholder="用户账号"
          />
        </n-container>
        <n-container
          :sm="5"
          :mid="2"
          :lg="2"
        >
          <q-input
            dense
            outlined
            v-model="listQuery.userName"
            placeholder="用户姓名"
          />
        </n-container>
        <n-container
          :sm="10"
          :mid="2"
          :lg="2"
        >
          <FixcodeSelect
            :type="'1001'"
            :model.sync="listQuery.userStatus"
            :placeholder="'用户状态'"
            dense
            clearable
          />
        </n-container>
        <q-btn
          label="查询"
          :loading="listLoading"
          icon="search"
          color="primary"
          @click="handleFilter"
        />
        <q-btn
          label="新增"
          icon="add"
          color="negative"
          @click="handleCreate"
        />
      </div>
    </div>
    <div
      class="col-10 q-ma-lg"
    >
      <PaginationTable
        row-key="userId"
        :data="list"
        :columns="columns"
        :loading="listLoading"
        :pagination.sync="pagination"
        :query="getList"
      >
        <template
          v-if="$q.screen.gt.xs"
          v-slot:default="row"
        >
          <q-td
            width="300px"
          >
            <div class="row q-mx-md q-gutter-x-md">
              <q-btn
                class="col-3"
                color="secondary"
                padding="xs"
                size="sm"
                dense
                label="编辑"
                icon="edit"
                @click="handleUpdate(row.row.userId)"
              />
              <q-btn
                class="col-3"
                color="negative"
                padding="xs"
                size="sm"
                dense
                label="删除"
                icon="delete"
                @click="deleteUser(row.row.userId)"
              />
              <q-btn
                class="col-3"
                color="warning"
                padding="xs"
                size="sm"
                dense
                label="角色"
                icon="perm_identity"
                @click="handleRoles(row.row.userId)"
              />
            </div>
          </q-td>
        </template>
        <template
          v-else
          v-slot:default="row"
        >
          <div class="row q-mx-md q-gutter-x-md">
            <q-btn
              class="col"
              round
              color="secondary"
              size="xs"
              icon="edit"
              @click="handleUpdate(row.row.userId)"
            />
            <q-btn
              class="col"
              round
              color="negative"
              size="xs"
              icon="delete"
              @click="deleteUser(row.row.userId)"
            />
            <q-btn
              class="col"
              round
              color="warning"
              size="xs"
              icon="perm_identity"
              @click="handleRoles(row.row.userId)"
            />
          </div>
        </template>
      </PaginationTable>
    </div>

    <UserForm
      :model.sync="showEditor"
      :operation="operation"
      :user-info="userInfo"
      :reset="resetUser"
      @refresh="getList"
    />
  </q-page>
</template>

<script>
import { getUserList, fetchUserInfo, deleteUser } from 'src/api/usermanager'
import FixcodeSelect from 'src/components/FixcodeSelect'
import PaginationTable from 'src/components/PaginationTable'
// import StickDialog from 'src/components/Dialog/StickDialog'
import UserForm from 'src/pages/usermanager/components/UserForm'
import { successNotify } from 'src/utils/Notify'
import { confirm } from 'src/utils/Confirm'
import { date } from 'quasar'
import NContainer from 'src/components/NContainer'

export default {
  name: 'UserManager',
  components: { FixcodeSelect, PaginationTable, UserForm, NContainer },
  directives: { },
  filters: {
  },
  data () {
    return {
      tableKey: 0,
      list: [],
      listLoading: false,
      showEditor: false,
      operation: '',
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
      },
      listQuery: {
        curPage: 1,
        limit: 20,
        userCode: undefined,
        userName: undefined,
        userStatus: ''
      },
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: process.env.PAGESIZE,
        rowsNumber: 0
      },
      columns: [
        { name: 'userCode', label: '账号', field: 'userCode', width: '200px', type: 'data', align: 'center', sortable: true },
        { name: 'userName', label: '姓名', field: 'userName', type: 'data', align: 'center', sortable: false },
        { name: 'roleName', label: '角色', field: 'roleName', type: 'data', align: 'center', sortable: false },
        { name: 'sex', label: '性别', field: 'sex', type: 'fixcode', align: 'center', sortable: false },
        { name: 'birthday', label: '生日', field: 'birthday', type: 'date', format: 'YYYY-MM-DD', align: 'center', sortable: false },
        { name: 'userStatus', label: '状态', field: 'userStatus', type: 'fixcode', align: 'center', sortable: false },
        { name: 'userId', label: '操作', field: 'userId', type: 'slot', align: 'center', sortable: false }
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.curPage = this.pagination.page
      this.listQuery.limit = this.pagination.rowsPerPage
      this.resetUser()
      getUserList(this.listQuery).then(response => {
        this.list = response.data.records
        this.pagination.rowsNumber = response.data.totalRecords
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter () {
      this.pagination.page = 1
      this.getList()
    },
    deleteUser (userId) {
      confirm('注意', '是否删除该用户？', () => {
        const param = { userId: userId }
        deleteUser(param).then((res) => {
          if (res.data === true) {
            successNotify('Delete Successfully')
            this.handleFilter()
          }
        })
      })
    },
    handleCreate () {
      this.operation = 'create'
      this.showEditor = true
      this.resetUser()
    },
    async handleUpdate (userId) {
      this.operation = 'edit'

      await fetchUserInfo(userId).then((res) => {
        let birthday = ''
        if (res.data.birthday) {
          const extractBirthday = date.extractDate(res.data.birthday, 'YYYY-MM-DD HH:mm:ss')
          birthday = date.formatDate(extractBirthday, 'YYYY-MM-DD')
        }
        this.userInfo.userId = res.data.userId
        this.userInfo.userCode = res.data.userCode
        this.userInfo.userName = res.data.userName
        this.userInfo.phone = res.data.phone
        this.userInfo.mobile = res.data.mobile
        this.userInfo.email = res.data.email
        this.userInfo.sex = '' + res.data.sex
        this.userInfo.birthday = birthday
        this.userInfo.avatar = res.data.avatar
        this.userInfo.userStatus = '' + res.data.userStatus
        // if (res.data.avatar !== '') {
        //   this.imageUrl = process.env.VUE_APP_BASE_API + '/generate/loadImage?filePath=' + res.data.avatar
        // } else {
        //   this.imageUrl = defAvatar
        // }
        this.showEditor = true
      })
    },
    handleRoles (userId) {
      this.$router.push({
        name: 'manageroles',
        params: {
          id: userId
        }
      })
    },
    resetUser () {
      this.userInfo = {
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
  }
}
</script>
