<template>
  <div class="index">
    <div class="content">
      <div class="firmware-boot" v-if="showGuide">
        <div class="firmware-tip">请连接扫码枪,扫描固件二维码</div>
        <el-button type="primary" size="large" class="start-button"
          >开始扫描</el-button
        >
      </div>
      <div class="firmware-burnin" v-if="showBurnin">
        <div class="version">固件版本V1.0.3</div>
        <div class="loading">
          <load-icon></load-icon>
          <div class="loading-tips">固件烧入中...</div>
          <div>请勿执行其他操作</div>
        </div>
      </div>
      <div class="firmware-burnin" v-if="showDSKLoading">
        <div class="version">固件版本V1.0.3</div>
        <div class="loading">
          <load-icon></load-icon>
          <div class="loading-tips">DSK读取中...</div>
          <div>请勿执行其他操作</div>
        </div>
      </div>
      <div class="firmware-burnin" v-if="showPrinting">
        <div class="version">固件版本V1.0.3</div>
        <div class="loading">
          <load-icon></load-icon>
          <div class="loading-tips">二维码正在打印中，请稍后...</div>
          <!-- <div>请勿执行其他操作</div> -->
        </div>
      </div>
      <div class="firmware-success" v-if="showBurnSuccess">
        <div class="version">固件版本V1.0.3</div>
        <div class="success-content">
          <Select style="width: 100px; color: #409eff" />
          <div class="sucess-tip">固件烧入成功</div>
        </div>
      </div>
      <div class="firmware-success" v-if="showDSKSuccess">
        <div class="version">固件版本V1.0.3</div>
        <div class="success-content">
          <Select style="width: 100px; color: #409eff" />
          <div class="sucess-tip">DSK读取完成</div>
        </div>
      </div>
      <div class="firmware-fail" v-if="showBurnFail">
        <div class="version">固件版本V1.0.3</div>
        <div class="fail-content">
          <CircleCloseFilled style="width: 80px; color: red" />

          <div class="fail-tip">
            固件烧入<span style="color: red">失败</span>
          </div>
          <div class="fail-remark">"文件名。。。。"未找到相关固件</div>
          <el-button type="primary" size="large" class="backindexbutton"
            >返回主页</el-button
          >
        </div>
      </div>
      <div class="firmware-fail" v-if="showDskLoadFail">
        <div class="version">固件版本V1.0.3</div>
        <div class="fail-content">
          <CircleCloseFilled style="width: 80px; color: red" />

          <div class="fail-tip">
            DSK读取<span style="color: red">失败</span>
          </div>
          <div>
            <el-button type="info" size="large" class="backindexbutton"
              >返回主页</el-button
            >
            <el-button type="primary" size="large" class="backindexbutton"
              >再试一次</el-button
            >
          </div>
        </div>
      </div>
      <div class="firmware-fail" v-if="showfinish">
        <div class="version">固件版本V1.0.3</div>
        <div class="fail-content">
          <div class="finish-tip">打印完成</div>
          <el-button type="primary" size="large" class="backindexbutton"
            >返回主页</el-button
          >
        </div>
      </div>
    </div>
    <div class="control">
      <div class="icon">
        <Tools
          style="width: 20px; cursor: pointer"
          @click="centerDialogVisible = true"
        />
      </div>
      <div class="button-area">
        <el-button
          type="primary"
          size="large"
          :disabled="disableButton"
          class="primarybutton"
          >烧入固件</el-button
        >
      </div>
      <div class="button-area">
        <el-button
          type="primary"
          size="large"
          :disabled="disableButton"
          class="primarybutton"
          >读取DSK</el-button
        >
      </div>
      <div class="result-area">
        <div class="result-tip">最终结果</div>
        <div v-if="showResult">
          <div class="result" v-if="result">
            <span style="color: green">通过</span>
          </div>
          <div class="result" v-else><span style="color: red">失败</span></div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="centerDialogVisible"
      title="功能设置"
      width="50%"
      center
    >
      <div class="setContainer" v-if="showAuthentication">
        <div class="authentication">身份验证</div>
        <div class="input-area">
          <img class="key" src="../assets/key.svg" />
          <el-input type="password" placeholder="请输入" show-password />
          <!-- <img class="key" src="../assets/key.svg" /> -->
        </div>
      </div>
      <div class="mode-list-container" v-if="showModeList">
        <div class="modetips">请选择模式</div>
        <div class="modelist">
          <div class="mode">
            <div>烧入固件</div>
            <div>读取DKS</div>
          </div>
          <div class="mode">
            <div>功能测试</div>
          </div>
        </div>
        <div class="selectlist">
          <input type="radio" :checked="false" />
          <input type="radio" />
        </div>
        <div>
          <!-- <el-radio-group v-model="mode" class="ml-4">
      <el-radio label="1" size="large"></el-radio>
      <el-radio label="2" size="large"></el-radio>
    </el-radio-group> -->
        </div>
        <el-button type="primary" size="large" class="backindexbutton"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Tools, Select, CircleCloseFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import LoadIcon from '../components/loadicon.vue'
export default {
  components: {
    Tools,
    LoadIcon,
    Select,
    CircleCloseFilled,
  },
  setup() {
    const result = ref(false)
    const showResult = ref(false)
    const disableButton = ref(false)
    const showGuide = ref(false)
    const showBurnin = ref(false)
    const showBurnSuccess = ref(false)
    const showBurnFail = ref(false)
    const showDSKLoading = ref(false)
    const showDSKSuccess = ref(false)
    const showDskLoadFail = ref(false)
    const showPrinting = ref(false)
    const showfinish = ref(false)
    const centerDialogVisible = ref(false)
    const showAuthentication = ref(false)
    const mode = ref('1')
    const showModeList = ref(false)
    return {
      result,
      showResult,
      disableButton,
      showGuide,
      showBurnin,
      showBurnSuccess,
      showBurnFail,
      showDSKLoading,
      showDSKSuccess,
      showDskLoadFail,
      showPrinting,
      showfinish,
      centerDialogVisible,
      showAuthentication,
      mode,
      showModeList,
    }
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.index {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: aliceblue;
}

.content {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 300px;
  left: 0;
  box-sizing: border-box;
}

.control {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  width: 300px;
  background-color: white;
  padding: 20px;
}

.primarybutton {
  width: 100%;
  /* margin-bottom: 50px; */
}

.icon {
  margin-bottom: 20px;
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}

.button-area {
  box-sizing: border-box;
  width: 100%;
  float: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
}

.result-area {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 250px;
  border-top: 1px solid gray;
  width: 100%;
}

.result-tip {
  text-align: left;
  padding: 20px;
  font-size: 14px;
  font-weight: bolder;
}

.result {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-size: 30px;
  font-weight: 900;
}

.firmware-boot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.start-button {
  width: 250px;
}

.firmware-tip {
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 50px;
}

.version {
  text-align: right;
  padding: 40px;
  font-weight: 900;
}

.loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-weight: bold;
}

.success-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-weight: bold;
  font-size: 20px;
}

.loading-tips {
  font-weight: 900;
  font-size: 20px;
  line-height: 40px;
}

.fail-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-weight: 900;
  font-size: 20px;
}

.fail-remark {
  color: gray;
  margin-top: 20px;
}

.backindexbutton {
  margin-top: 50px;
  width: 300px;
}

.finish-tip {
  margin-bottom: 100px;
}

.authentication {
  text-align: center;
  font-weight: 900;
  font-size: 20px;
  margin-top: 100px;
  color: black;
}

.setContainer {
  height: 500px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.mode-list-container {
  height: 500px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 50px 0 50px;
}

.key {
  width: 30px;
}

.input-area {
  margin-top: 50px;
  width: 300px;
  display: flex;
  align-items: center;
}

.modetips {
  margin-top: 20px;
  width: 100%;
}

.modelist {
  margin-top: 50px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.mode {
  width: 200px;
  height: 150px;
  border: 2px solid rgb(196, 196, 196);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.selectlist {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
