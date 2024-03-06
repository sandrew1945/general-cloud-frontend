<template>
  <q-page :class="this.$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div
      class="col-10 q-ma-lg"
    >
      <div class="row">
        <div class="col-md-3 col-xs-12">
          <q-tree
            class="q-ma-md"
            ref="tree"
            :nodes="treeNodes"
            node-key="path"
            label-key="name"
            default-expand-all
            :selected.sync="selected"
            @update:selected="handleSelected"
          >
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <q-icon
                  :name="prop.node.icon || 'share'"
                  color="grey"
                  size="24px"
                  class="q-mr-sm"
                />
                <div class="text-weight-bold">
                  {{ prop.node.name + '(' + prop.node.funcOrder + ')' }}
                </div>
              </div>
            </template>
          </q-tree>
        </div>
        <div class="col-md-9 col-xs-12">
          <div class="row">
            <q-form
              :dense="$q.screen.lt.sm ? true : false"
              class="q-gutter-md q-ma-md col-md-6"
            >
              <q-input
                ref="nodePath"
                outlined
                :dense="$q.screen.lt.sm ? true : false"
                label="路径"
                v-model="node.path"
                :rules="[
                  val => val !== null && val !== '' || '请输入菜单路径',
                ]"
              />
              <q-input
                ref="icon"
                outlined
                :dense="$q.screen.lt.sm ? true : false"
                v-model="node.icon"
                label="图标"
                :rules="[
                  val => val !== null && val !== '' || '请输入图标代码',
                ]"
              />
              <q-input
                ref="name"
                outlined
                :dense="$q.screen.lt.sm ? true : false"
                v-model="node.name"
                label="菜单名"
                :rules="[
                  val => val !== null && val !== '' || '请输入菜单名',
                ]"
              />
              <q-input
                ref="funcOrder"
                outlined
                type="number"
                :dense="$q.screen.lt.sm ? true : false"
                v-model="node.funcOrder"
                label="菜单顺序"
                :rules="[
                  val => val !== null && val !== '' || '请输入数字格式的顺序',
                ]"
              />
              <div class="q-gutter-md">
                <q-btn
                  label="Update"
                  type="button"
                  color="primary"
                  icon="update"
                  @click="handleUpdate"
                />
                <q-btn
                  label="Delete"
                  type="button"
                  color="negative"
                  icon="delete"
                  @click="handleDelete"
                />
                <q-btn
                  label="Create"
                  type="button"
                  color="warning"
                  icon="add"
                  @click="handleCreate"
                />
              </div>
            </q-form>
          </div>
        </div>
        <MenuForm
          :model.sync="showCreate"
          :father-id="this.node.functionId"
          :father-path="this.node.path + '/'"
          :invoke="'refreshTree'"
          @refreshTree="fetchMenu"
          :reset="resetNode"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { getMenuTree, updateMenu, deleteMenu } from 'src/api/funcmanager'
import { successNotify, warningNotify } from 'src/utils/Notify'
import MenuForm from './components/MenuForm'

export default {
  name: 'ManagerRoles',
  components: { MenuForm },
  data () {
    return {
      tableKey: 0,
      checkedNode: [],
      checkMenu: [],
      routes: [],
      ticked: [],
      showCreate: false,
      node: {
        functionId: '',
        path: '',
        name: '',
        title: '',
        icon: '',
        funcOrder: ''
      },
      selected: '',
      treeNodes: [],
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#086491',
        width: '10px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: 'primary',
        width: '9px',
        opacity: 0.2
      }
    }
  },
  created () {
    this.fetchMenu()
  },
  methods: {
    fetchMenu () {
      getMenuTree().then(res => {
        this.treeNodes = res.data
      })
    },
    handleSelected (key) {
      if (key) {
        const memu = this.$refs.tree.getNodeByKey(key)
        if (memu) {
          this.node.functionId = '' + memu.functionId
          this.node.path = memu.path
          this.node.name = memu.name
          this.node.icon = memu.icon
          this.node.funcOrder = memu.funcOrder
        }
      } else {
        this.resetNode()
      }
    },
    handleUpdate () {
      if (!this.node.functionId) {
        warningNotify('请选择一个菜单节点')
        return
      }
      updateMenu(this.node).then(res => {
        if (res.data > 0) {
          this.fetchMenu()
          successNotify('Update Successfully')
        }
      })
    },
    handleDelete () {
      if (!this.node.functionId) {
        warningNotify('请选择一个菜单节点')
        return
      }
      deleteMenu({ functionId: this.node.functionId }).then(res => {
        this.fetchMenu()
        this.resetNode()
      })
    },
    handleCreate () {
      this.showCreate = true
    },
    cancel () {
      this.$router.back(-1)
    },
    resetNode () {
      new Promise((resolve, reject) => {
        this.node = {
          functionId: null,
          path: '',
          name: '',
          title: '',
          icon: '',
          funcOrder: ''
        }
        resolve()
      }).then(res => {
        this.$refs.nodePath.resetValidation()
        this.$refs.icon.resetValidation()
        this.$refs.name.resetValidation()
        this.$refs.funcOrder.resetValidation()
      })
    }
  }
}
</script>
