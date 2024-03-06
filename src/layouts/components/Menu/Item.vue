<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children, item)">
      <q-item
        :to="item.path"
        exact
        :dense="dense ? true : false"
        clickable
        v-ripple
        active-class="link-activated"
        :inset-level="0.5 * level"
      >
        <q-item-section avatar>
          <q-icon
            :class="this.$q.dark.isActive ? 'text-white':'text-black'"
            :name="extraIcon ? 'app:' + item.meta.icon : item.meta.icon"
          />
        </q-item-section>
        <q-item-section>
          {{ item.meta.title }}
        </q-item-section>
      </q-item>
    </template>
    <template v-else>
      <q-expansion-item
        expand-separator
        :dense-toggle="level > 0 ? true : false"
        :dense="dense ? true : false"
        :header-inset-level="0.5 * level"
        :icon="extraIcon ? 'app:' + item.meta.icon : item.meta.icon"
        :class="this.$q.dark.isActive ? 'text-white':'text-black'"
        :label="item.meta.title"
      >
        <item
          v-for="child in item.children"
          :item="child"
          :key="child.path"
          :level="level + 1"
          :extra-icon="extraIcon"
        />
      </q-expansion-item>
    </template>
  </div>
</template>

<script>
// import path from 'path'
// import { isExternal } from '@/utils/validate'

export default {
  name: 'Item',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      required: true,
      default: 0
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
    },
    extraIcon: {
      type: Boolean,
      required: false
    }
  },
  data () {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  created () {
  },
  methods: {
    hasOneShowingChild (children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return false
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
  .link-activated {
    color: white;
    background: $primary;
    opacity: 0.6;
  }
</style>
