<template>
  <q-select
    v-if="!clearable"
    :dense="dense"
    outlined
    v-model="selectedItem"
    :options="options"
    map-options
    option-value="key"
    option-label="value"
    emit-value
    :label="placeholder"
    :style="css"
    :rules="rules"
  />
  <q-select
    v-else
    :dense="dense"
    outlined
    v-model="selectedItem"
    :options="options"
    map-options
    option-value="key"
    option-label="value"
    emit-value
    :label="placeholder"
    :style="css"
    :rules="rules"
  >
    <template v-slot:append>
      <q-icon
        name="close"
        @click.stop="selectedItem = ''"
        class="cursor-pointer"
      />
    </template>
  </q-select>
</template>

<script>
import { getSelectOption } from 'src/utils/fixcode'

export default {
  name: 'FixcodeSelect',
  props: {
    placeholder: {
      required: false,
      type: String,
      default: ''
    },
    model: {
      required: true,
      type: String
    },
    css: {
      required: false,
      type: String,
      default: ''
    },
    type: {
      required: true,
      type: String
    },
    clearable: {
      required: false,
      type: Boolean
    },
    rules: {
      required: false,
      type: Array,
      default: null
    },
    dense: {
      required: false,
      type: Boolean
    }
  },
  data: function () {
    return {
      options: []
    }
  },
  computed: {
    selectedItem: {
      get () {
        return this.model === 'null' ? '' : this.model
      },
      set (val) {
        this.$emit('update:model', val)
      }
    }
  },
  created () {
    this.options = getSelectOption(this.type)
  }
}
</script>

<style scoped>
</style>
