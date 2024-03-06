<template>
  <q-dialog
    v-model="showDialog"
    :position="position"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <slot />
  </q-dialog>
</template>

<script>
export default {
  name: 'StickDialog',
  props: {
    position: {
      required: false,
      type: String,
      default: 'top'
    },
    model: {
      required: true,
      type: Boolean
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
  }
}
</script>
