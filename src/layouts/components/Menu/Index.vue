<!--
  说明：
  menus: 菜单列表 格式: [{},{children:[{},{},{}]},{}]
  dense: 是否为紧凑模式

  示例:
  <Menu
    :menus="this.$store.getters['user/getMenuList']"
    dense
  />
-->
<template>
  <q-scroll-area
    style="height: 100%; margin-top: 0px; border-right: 1px solid #ddd"
  >
    <q-list
      :dense="dense ? true : false"
      padding
    >
      <Item
        v-for="item in menus"
        :item="item"
        :key="item.path"
        :level="0"
        :dense="dense"
        :extra-icon="extraIcon"
      />
    </q-list>
  </q-scroll-area>
</template>

<script>
import Item from './Item'

export default {
  name: 'Menu',
  components: { Item },
  props: {
    // route object
    menus: {
      type: Array,
      required: true
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
    },
    extraIcon: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  created () {
  }
}
</script>
