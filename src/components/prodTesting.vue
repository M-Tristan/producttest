<template>
  <div class="prodTesting">
    <div
      :class="[
        'state',
        { pending: state.state === 'pending' },
        { failed: state.state === 'failed' },
        { waiting: state.state === 'waiting' },
        { pass: state.state === 'pass' },
      ]"
      v-for="(state, index) in states"
      :key="index"
    >
      {{ state.desc }}
      <wait v-if="state.state === 'pending'"></wait>
      <Close v-if="state.state === 'failed'" style="width: 20px; color: red" />
    </div>
  </div>
</template>

<script>
import wait from './wait.vue'
import { Close } from '@element-plus/icons-vue'
export default {
  components: { wait, Close },
  props: {
    states: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    return {}
  },
}
</script>

<style lang="less" scoped>
.prodTesting {
  position: absolute;
  top: 100px;
  left: 50px;
  .state {
    font-weight: 900;
    font-size: 20px;
    line-height: 60px;
    display: flex;
  }
  .pending {
    color: black;
  }
  .failed {
    color: red;
  }
  .waiting {
    color: rgb(165, 165, 165);
  }
  .pass {
    color: rgb(107, 178, 0);
  }
}
</style>
