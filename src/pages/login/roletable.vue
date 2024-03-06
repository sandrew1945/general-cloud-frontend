<template>
  <q-layout>
    <q-page-container>
      <q-page :class="this.$q.dark.isActive ? 'dark justify-center' : 'bg-grey-3 justify-center'">
        <div
          class="justify-center"
        >
          <div class="row q-pt-xl justify-center">
            <q-table
              class="col-md-4 col-xs-12"
              title="请选择角色"
              :data="data"
              :columns="columns"
              row-key="roleName"
              hide-bottom
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td
                    key="roleName"
                    :props="props"
                  >
                    {{ props.row.roleName }}
                  </q-td>
                  <q-td
                    key="opt"
                    :props="props"
                  >
                    <q-btn
                      color="primary"
                      label="选 择"
                      @click="handleSelect(props.row.roleId)"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      columns: [
        {
          name: 'roleName',
          required: true,
          label: '角色',
          align: 'center',
          field: row => row.roleName,
          format: val => `${val}`
        },
        { name: 'opt', label: '操作', field: 'roleId', align: 'center', sortable: false }
      ],
      data: []
    }
  },
  created () {
    this.data = this.$store.getters['user/getRoles']
  },
  methods: {
    async handleSelect (id) {
      // 将选择的角色ID存入vuex
      this.$store.dispatch('user/setRole', id)
      // 获取菜单
      await this.$store.dispatch('user/getMenu', id).then(response => {
      // const routers = rFormat(response)
        this.$store.dispatch('user/setMenu', response)
      // this.$router.addRoutes(routers)
      })
      this.$router.push('/index/dashboard')
    }
  }
}
</script>

<style lang="scss">
  .el-header, .el-footer {
  //background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  }
  .el-main {
  //background-color: #E9EEF3;
  color: #333;
  text-align: center;
  }
</style>
