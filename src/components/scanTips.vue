<template>
  <div class="scan">
    <div class="tips">{{ tips }}</div>
    <div>
      <el-input
        v-model="con"
        @input="change"
        class="input"
        placeholder="请扫描"
        :type="type"
        @keydown="keydown"
      ></el-input>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import _ from 'lodash'

export default defineComponent({
  props: {
    tips: {
      type: String,
      default: '',
    },

    modelValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    let time = Date.now()
    const con = ref(props.modelValue)
    const type = ref('text')

    const change = () => {
      emit('update:modelValue', con.value)
    }
    watch(
      () => props.modelValue,
      () => {
        con.value = props.modelValue
      }
    )

    const setTypeText = _.debounce(() => {
      type.value = 'text'
    }, 1)

    const keydown = () => {
      let now = Date.now()
      // if(now-time<100){

      // }
      type.value = 'password'
      time = now
      setTypeText()
    }
    return { keydown, con, change, type, keydown }
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

.scan {
  font-size: 25px;
  font-weight: 900;
  .absolute-center;
  .tips {
    margin-bottom: 20px;
  }
  .input {
    height: 50px;
    color: red;
  }
}
</style>
