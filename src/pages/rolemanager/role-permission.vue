<template>
  <q-page :class="this.$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="row q-gutter-md">
        <q-input
          dense
          v-if="$q.screen.gt.xs"
          outlined
          v-model="roleInfo.roleCode"
          readonly
          placeholder="角色代码"
          class="col-md-2 col-xs-4"
        />
        <q-input
          dense
          outlined
          v-model="roleInfo.roleName"
          readonly
          placeholder="角色名称"
          class="col-md-2 col-xs-6"
        />
        <q-btn
          label="保存权限"
          icon="grading"
          color="primary"
          @click="handleSave"
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
      <div class="row">
        <div class="col-md-6 col-xs-12">
          <q-tree
            class="q-ma-md"
            ref="tree"
            :nodes="treeNodes"
            node-key="functionId"
            label-key="name"
            tick-strategy="leaf"
            :ticked.sync="ticked"
            default-expand-all
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { fetchRoleInfo, saveSelectedFunc, getCheckedPremission } from 'src/api/rolemanager'
import { getMenuTree } from 'src/api/funcmanager'
import { successNotify } from 'src/utils/Notify'
import _ from 'lodash'
// import { successNotify } from 'src/utils/Notify'
// import { confirm } from 'src/utils/Confirm'

export default {
  name: 'ManagerRoles',
  data () {
    return {
      roleInfo: {},
      ticked: [],
      node: {
        roleId: '',
        fatherPath: '',
        fatherTitle: '',
        path: '',
        name: '',
        title: '',
        icon: ''
      },
      treeNodes: []
    }
  },
  created () {
    this.node.roleId = this.$route.params.id
    this.getRoleInfo()
    this.fetchMenu()
    this.initPremission()
  },
  methods: {
    getRoleInfo () {
      fetchRoleInfo(this.node.roleId).then(response => {
        this.roleInfo = response.data
      })
    },
    fetchMenu () {
      getMenuTree().then(res => {
        this.treeNodes = res.data
      })
    },
    initPremission () {
      getCheckedPremission(this.node.roleId).then((response) => {
        this.ticked = _.concat(this.ticked, response.data)
      })
    },
    handleSave () {
      const functionIdArray = []
      this.ticked.forEach(key => {
        const node = this.$refs.tree.getNodeByKey(key)
        functionIdArray.push(node.functionId)
      })
      const params = { roleId: this.node.roleId, functionIds: functionIdArray }
      saveSelectedFunc(params).then((response) => {
        if (response.result === true) {
          successNotify('Save Successfully')
        }
      })
    },
    cancel () {
      this.$router.back(-1)
    }
  }
}
</script>
