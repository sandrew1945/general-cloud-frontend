<template>
  <q-uploader
    auto-upload
    v-model="avatar"
    :factory="updateAvatar"
    field-name="file"
    accept=".jpg, image/*"
    style="width: 150px"
  >
    <template v-slot:list="">
      <q-avatar
        rounded
        size="140px"
      >
        <img
          v-if="!avatar"
          :src="placeholder"
        >
        <img
          v-else
          :src="loadUrl + avatar"
        >
      </q-avatar>
    </template>
  </q-uploader>
</template>

<script>
import { uploadAvatar } from 'src/api/usermanager'

export default {
  name: 'AvatarUploader',
  props: {
    placeholder: {
      required: false,
      type: String,
      default: 'avatar.jpg'
    },
    model: {
      required: true,
      type: String
    },
    loadUrl: {
      required: false,
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      options: []
    }
  },
  computed: {
    avatar: {
      get () {
        return this.model
      },
      set (val) {
        this.$emit('update:model', val)
      }
    }
  },
  created () {
  },
  methods: {
    updateAvatar (files) {
      new Promise((resolve, reject) => {
        var file = files[0]
        var fileSrc
        var fileData

        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onerror = err => console.error(`Failed to read file: ${err}`)
        reader.onload = function () {
          fileSrc = reader.result
          fileData = fileSrc.substr(fileSrc.indexOf(',') + 1)
          const formData = new FormData()
          formData.append('base64file', fileData)
          formData.append('filename', file.name)
          uploadAvatar(formData).then(res => {
            resolve(res)
          })
        }
      }).then(res => {
        // this.avatarUrl = process.env.API + '/generate/loadImage?filePath=' + res.data
        this.avatar = res.data
        console.log('this.avatar ---->' + this.avatar)
      })
    }
  }
}
</script>

<style scoped>
</style>
