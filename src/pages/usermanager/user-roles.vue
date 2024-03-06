<template>
  <q-page :class="this.$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="row q-gutter-md">
        <q-input
          dense
          outlined
          v-model="userInfo.userCode"
          disable
          placeholder="用户账号"
          class="col-md-2 col-xs-3"
        />
        <q-input
          dense
          outlined
          v-model="userInfo.userName"
          disable
          placeholder="用户姓名"
          class="col-md-2 col-xs-3"
        />
        <q-btn
          label="选择可添加角色"
          icon="grading"
          color="primary"
          @click="dialogFormVisible = true"
        />
        <q-btn
          label="返回"
          icon="reply"
          color="grey"
          @click="cancel"
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
          <q-td>
            <div class="row justify-center q-mx-md q-gutter-x-md">
              <q-btn
                color="negative"
                size="sm"
                label="删除"
                icon="delete"
                @click="handleDelete(row.row.roleId)"
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
              color="negative"
              size="xs"
              icon="delete"
              @click="handleDelete(row.row.roleId)"
            />
          </div>
        </template>
      </PaginationTable>
    </div>
    <RoleList
      :model.sync="dialogFormVisible"
      :user-id="userId"
      @refresh="getList"
    />
  </q-page>
</template>

<script>
import { getRelationRoles, deleteRole, fetchUserInfo } from 'src/api/usermanager'
import PaginationTable from 'src/components/PaginationTable'
import RoleList from 'src/pages/usermanager/components/RoleList'
import { successNotify } from 'src/utils/Notify'
import { confirm } from 'src/utils/Confirm'

export default {
  name: 'ManagerRoles',
  components: { PaginationTable, RoleList },
  data () {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 2,
        rowsNumber: 0
      },
      userId: '',
      roleName: '',
      userInfo: {},
      dialogFormVisible: false,
      selectedRoles: [],
      columns: [
        { name: 'roleCode', label: '角色代码', field: 'roleCode', type: 'data', align: 'center', sortable: true },
        { name: 'roleName', label: '角色名称', field: 'roleName', type: 'data', align: 'center', sortable: false },
        { name: 'roleId', label: '操作', field: 'roleId', type: 'slot', align: 'center', sortable: false }
      ],
      unrelationColumn: [
        { header: '序号', type: 'selection', width: '100px', dataIndex: '' },
        { header: '角色代码', type: 'data', width: '', dataIndex: 'roleCode' },
        { header: '角色名称', type: 'data', width: '', dataIndex: 'roleName' },
        { header: '状态', type: 'data', width: '', dataIndex: 'roleStatus' }
      ]
    }
  },
  created () {
    this.userId = '' + this.$route.params.id
    this.getUserInfo()
    this.getList()
  },
  methods: {
    getUserInfo () {
      fetchUserInfo(this.userId).then(response => {
        this.userInfo = response.data
      })
    },
    getList () {
      this.listLoading = true
      getRelationRoles(this.userId).then(response => {
        this.list = response.data
        this.listLoading = false
        // this.total = response.totalRecords
        // Just to simulate the time of the request
      })
    },
    handleSelectedRoles (roles) {
      this.selectedRoles = roles
    },
    handleDelete (roleId) {
      console.log(roleId)
      confirm('注意', '是否删除该角色？', () => {
        const param = { userId: this.userId, roleId: roleId }
        deleteRole(param).then((res) => {
          if (res.result === true) {
            successNotify('Delete Successfully')
          }
          this.getList()
        })
      })
      // this.$confirm('是否删除该角色？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   const param = { userId: this.userId, roleId: roleId }
      //   deleteRole(param).then((res) => {
      //     if (res.result === true) {
      //       this.$message({
      //         message: '操作Success',
      //         type: 'success'
      //       })
      //     }
      //     this.fullscreenLoading = false
      //     this.getList()
      //   })
      // })
    },
    cancel () {
      this.$router.back(-1)
    }
  }
}
</script>
