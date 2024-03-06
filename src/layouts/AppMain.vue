<template>
  <q-page-container>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <router-view :key="key" />
    </transition>
    <q-page-sticky
      position="bottom-right"
      :offset="fabPos"
    >
      <q-fab
        v-model="showFloat"
        vertical-actions-align="left"
        color="primary"
        glossy
        :disable="draggingFab"
        icon="keyboard_arrow_up"
        direction="up"
        v-touch-pan.prevent.mouse="handleStickyMove"
      >
        <q-fab-action
          color="primary"
          icon="open_in_new"
          @click="logout"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
          >
            登出系统
          </q-tooltip>
        </q-fab-action>
        <!-- <q-fab-action
          color="primary"
          icon="lock"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
          >
            锁定系统
          </q-tooltip>
        </q-fab-action> -->
        <q-fab-action
          v-if="this.$store.getters['user/getRoles'].length > 1"
          color="primary"
          icon="swap_calls"
          @click="reSelectRole"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
          >
            切换角色
          </q-tooltip>
        </q-fab-action>
        <q-fab-action
          color="primary"
          icon="equalizer"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
          >
            个人信息
          </q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </q-page-container>
</template>

<script>
export default {
  name: 'AppMain',
  data () {
    return {
      showFloat: false,
      draggingFab: false,
      fabPos: [18, 18]
    }
  },
  computed: {
    key () {
      return this.$route.path
    }
  },
  created () {
  },
  methods: {
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    reSelectRole () {
      this.$store.dispatch('user/resetSelectedRole')
      this.$router.push('/role')
    },
    handleStickyMove (evt) {
      this.draggingFab = evt.isFirst !== true && evt.isFinal !== true

      this.fabPos = [
        this.fabPos[0] - evt.delta.x,
        this.fabPos[1] - evt.delta.y
      ]
    }
  }
}
</script>
