<template>
  <div class="loading">
    <div class="loading-icon"><load-icon></load-icon></div>
    <div>
      <span class="times">{{ time }}s</span> {{ tips }}
    </div>
    <div class="tips2">{{ tips2 }}</div>
  </div>
</template>

<script>
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import loadIcon from './loadIcon.vue'

export default defineComponent({
  components: { loadIcon },
  props: {
    tips: {
      type: String,
      default: '',
    },
    tips2: {
      type: String,
      default: '',
    },
  },
  setup() {
    const time = ref(12)
    let t = setInterval(() => {
      if (time.value > 0) {
        time.value = time.value - 1
      } else {
        clearInterval(t)
      }
    }, 1000)
    onBeforeUnmount(() => {
      clearInterval(t)
    })
    return { time }
  },
})
</script>

<style lang="less" scoped>
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.loading {
  font-size: 25px;
  font-weight: 900;
  .absolute-center;
  .loading-icon {
    color: gray;
    margin-bottom: 20px;
  }
  .times {
    color: rgb(0, 115, 255);
  }
  .tips2 {
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
