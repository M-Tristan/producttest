<template>
  <Loading class="loadicon" />
</template>

<script>
import { Loading } from '@element-plus/icons-vue'
export default {
  components: {
    Loading,
  },
  setup() {
    return {}
  },
}
</script>

<style scoped>
.loadicon {
  animation: rotate 2s linear infinite;
  width: 100px;
  height: 100px;
}

@keyframes rotate {
  0% {
    transform: rotate(360deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
