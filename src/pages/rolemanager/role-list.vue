<template>
  <q-page :class="this.$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="row q-gutter-md">
        <q-input
          dense
          outlined
          v-model="listQuery.roleCode"
          placeholder="角色代码"
          class="col-md-2 col-xs-3"
        />
        <q-input
          dense
          outlined
          v-model="listQuery.roleName"
          placeholder="角色名称"
          class="col-md-2 col-xs-3"
        />
        <FixcodeSelect
          :type="'1001'"
          :model.sync="listQuery.roleStatus"
          :placeholder="'角色状态'"
          class="col-md-2 col-xs-3"
          dense
          clearable
        />
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
                @click="handleUpdate(row.row.roleId)"
              />
              <q-btn
                class="col-3"
                color="negative"
                padding="xs"
                size="sm"
                dense
                label="删除"
                icon="delete"
                @click="handleDelete(row.row.roleId)"
              />
              <q-btn
                class="col-3"
                color="warning"
                padding="xs"
                size="sm"
                dense
                label="权限"
                icon="account_tree"
                @click="handleRoles(row.row.roleId)"
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
              @click="handleUpdate(row.row.roleId)"
            />
            <q-btn
              class="col"
              round
              color="negative"
              size="xs"
              icon="delete"
              @click="handleDelete(row.row.roleId)"
            />
            <q-btn
              class="col"
              round
              color="warning"
              size="xs"
              icon="account_tree"
              @click="handleRoles(row.row.roleId)"
            />
          </div>
        </template>
      </PaginationTable>
    </div>
    <RoleForm
      :model.sync="showEditor"
      :operation="operation"
      :role-info="role"
      :reset="resetRole"
      :invoke="'refreshList'"
      @refreshList="getList"
    />
  </q-page>
</template>

<script>
import { getRoleList, deleteRole, fetchRoleInfo } from 'src/api/rolemanager'
import FixcodeSelect from 'src/components/FixcodeSelect'
import PaginationTable from 'src/components/PaginationTable'
import RoleForm from './components/RoleForm'
import { successNotify } from 'src/utils/Notify'
import { confirm } from 'src/utils/Confirm'

export default {
  name: 'UserManager',
  components: { FixcodeSelect, PaginationTable, RoleForm },
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
      role: {
        roleId: '',
        roleCode: '',
        roleName: '',
        roleStatus: ''
      },
      listQuery: {
        curPage: 1,
        limit: 20,
        roleCode: undefined,
        roleName: undefined,
        roleStatus: ''
      },
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: process.env.PAGESIZE,
        rowsNumber: 0
      },
      columns: [
        { name: 'roleCode', label: '角色代码', field: 'roleCode', width: '200px', type: 'data', align: 'center', sortable: true },
        { name: 'roleName', label: '角色名称', field: 'roleName', type: 'data', align: 'center', sortable: false },
        { name: 'roleStatus', label: '角色状态', field: 'roleStatus', type: 'fixcode', align: 'center', sortable: false },
        { name: 'roleId', label: '操作', field: 'roleId', type: 'slot', align: 'center', sortable: false }
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
      this.resetRole()
      getRoleList(this.listQuery).then(response => {
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
    handleDelete (roleId) {
      confirm('注意', '是否删除该角色？', () => {
        const param = { roleId: roleId }
        deleteRole(param).then((res) => {
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
      this.resetRole()
    },
    async handleUpdate (roleId) {
      this.operation = 'edit'
      await fetchRoleInfo(roleId).then((res) => {
        this.role.roleId = res.data.roleId
        this.role.roleCode = res.data.roleCode
        this.role.roleName = res.data.roleName
        this.role.roleStatus = '' + res.data.roleStatus
        this.showEditor = true
      })
    },
    handleRoles (userId) {
      this.$router.push({
        name: 'permission',
        params: {
          id: userId
        }
      })
    },
    resetRole () {
      this.role = {
        roleId: '',
        roleCode: '',
        roleName: '',
        roleStatus: ''
      }
    }
  }
}
</script>
