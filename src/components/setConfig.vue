<template>
  <div>
    <div class="form-item">
      <div class="name">
        <span class="desc">控制器IP地址</span>
      </div>

      <el-input
        class="input"
        size="large"
        v-model="config.wsurl"
        placeholder="请输入"
      />
    </div>
    <div class="form-item">
      <div class="name">
        <span class="desc">服务器地址</span>
      </div>
      <el-input
        class="input"
        size="large"
        v-model="config.httpurl"
        placeholder="请输入"
      />
    </div>
    <div class="submit-button-area">
      <el-button style="width: 300px" size="large" type="primary" @click="save"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import { reactive, toRaw } from 'vue'
import Config from '../common/config'
import { setConfig } from '../common/fileTool'
import { ElMessage } from 'element-plus'
export default {
  setup(props, { emit }) {
    const config = reactive({
      wsurl: Config.wsurl,
      httpurl: Config.httpurl,
    })
    const save = async () => {
      await setConfig(JSON.stringify(toRaw(config)))
      emit('close')
      Config.setConfig(config)
      ElMessage({
        showClose: true,
        message: '保存成功',
        type: 'success',
      })
    }

    return { config, save }
  },
}
</script>

<style lang="less" scoped>
.form-item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  .input {
    width: 300px;
  }
  .name {
    width: 100px;
    text-align: right;
    padding-right: 10px;
    .desc {
      position: relative;
      &::after {
        content: '*';
        color: red;
      }
    }
  }
}
.submit-button-area {
  margin-top: 100px;
  margin-bottom: 100px;
}
</style>
