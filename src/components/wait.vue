<template>
  <div class="wait">
    <span
      v-for="(item, index) in 3"
      :key="index"
      :class="[{ active: waitindex === index }]"
      >.</span
    >
  </div>
</template>

<script>
import { onBeforeUnmount, ref } from 'vue'
export default {
  setup() {
    let waitindex = ref(0)
    let timer = setInterval(() => {
      waitindex.value = (waitindex.value + 1) % 3
    }, 500)
    onBeforeUnmount(() => {
      clearInterval(timer)
    })
    return { waitindex }
  },
}
</script>

<style lang="less" scoped>
.wait {
  font-size: 30px;
  color: grey;
}
.active {
  color: black;
}
</style>
