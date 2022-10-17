<template>
  <div class="result">
    <Check v-if="success" style="width: 100px; color: #409eff" />
    <CircleClose v-else style="width: 100px; color: red" />
    <div>{{ tips }}</div>
    <div class="tips2">{{ tips2 }}</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Check, CircleClose } from '@element-plus/icons-vue'
export default defineComponent({
  components: {
    Check,
    CircleClose,
  },
  props: {
    tips: {
      type: String,
      default: '',
    },
    tips2: {
      type: String,
      default: '',
    },
    success: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {}
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
.result {
  .absolute-center;
  font-size: 25px;
  font-weight: 900;
  .tips {
    margin-top: 20px;
    font-size: 18px;
  }
  .tips2 {
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
