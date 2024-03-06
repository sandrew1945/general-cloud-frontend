<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>

const iconPath = 'img:app-icons/svg/'
const myIcons = {
  'app:warehouse': 'warehouse.svg',
  'app:role': 'role.svg',
  'app:answer': 'answer.svg',
  'app:ask': 'ask.svg',
  'app:home': 'home.svg',
  'app:job': 'job.svg',
  'app:monitor': 'monitor.svg',
  'app:question': 'question.svg',
  'app:task': 'task.svg',
  'app:user2': 'user2.svg'
}

export default {
  name: 'App',
  created () {
    this.$q.iconMapFn = (iconName) => {
      const icon = myIcons[iconName]
      if (icon !== undefined) {
        return { icon: iconPath + icon }
      }
    }

    // this.$q.dark.set(true)
  }
}
</script>

<style lang="scss">
  .body--light {
  /* ... */
    background: #fff
  }

  .body--dark {
    /* ... */
    background: #000
  }
</style>
