<template>
  <div class="container">

    <div class="main-container">
      <div class="steps" v-if='showsteps'>
        <el-steps :active="activeStep" simple>
          <el-step title="工序二维码" description="工序二维码" />
          <el-step title="设备二维码" description="设备二维码" />
          <el-step title="功能测试" description="功能测试" />
          <el-step title="离网" description="离网" />
          <el-step title="完成" description="完成" />
        </el-steps>
      </div>
      <div class="toindex" v-if="showToIndex" @click="toIndex">返回首页</div>
      <img class="logo" src="../assets/logo.png" />
      <div class="firmware-version" v-if="showfirmware">固件版本{{ firmware }}</div>
      <scan-tips v-model="content" v-if="status === 'unconnected'" tips="请连接扫码枪，扫描工序二维码"></scan-tips>
      <scan-tips v-model="equipmentContent" v-if="status === 'beforeTest'" tips="请连接扫码枪，扫描设备二维码"></scan-tips>
      <loading v-if="status === 'printingCode'" tips="正在打印二维码..."></loading>
      <loading v-if="status === 'getFirmware'" tips="正在获取固件版本..."></loading>
      <div class="placemodule" v-if="status === 'placemodule'">
        <div>请将模块放入测试治具</div>
        <div class="placemodulebutton" @click="startBurn">烧入固件</div>
      </div>
      <loading v-if="status === 'loadingFirmware'" tips="固件烧入中..." tips2="请勿执行其它操作"></loading>
      <Result tips="固件烧入成功" v-if="status === 'firmwareLoadSuccess'"></Result>
      <Result tips="打印完成" v-if="status === 'printSuccess'"></Result>
      <Result tips="固件烧入失败" tips2='"文件名asdfas"未找到相关固件' :success="false" v-if="status === 'firmwareLoadFail'"></Result>
      <Result tips="Home ID写入成功" v-if="status === 'writeSucceeded'"></Result>
      <loading v-if="status === 'loadingDSK'" tips="DSK读取中..." tips2="请勿执行其它操作"></loading>
      <Result tips="DSK读取完成" v-if="status === 'DSKLoadSuccess'"></Result>
      <Result tips="DSK读取失败" :success="false" v-if="status === 'DSKLoadFail'"></Result>
      <loading v-if="status === 'printingDSK'" tips="DSK打印中,请稍后..."></loading>
      <loading v-if="status === 'uploadDSK'" tips="正在将DSK上传服务器,请稍后..."></loading>
      <Result tips="上传成功" tips2="请将二维码贴纸贴于模块上" v-if="status === 'uploadDSKSuccess'"></Result>
      <Result tips="打印成功" v-if="status === 'printCodeSuccess'"></Result>
      <div class="firmwareload-success" v-if="status === 'offNetwork'">
        <div>请短按RESET键</div>
      </div>
      <Result tips="离网成功" v-if="status === 'offNetworkSuccess'"></Result>
      <Result tips="离网失败" :success="false" v-if="status === 'offNetworkFail'"></Result>
      <prodtesting :states="prodtestStates" v-if="status === 'prodtesting'"></prodtesting>
    </div>
    <div :class="[
      'result-container',
      { successinfo: result === 'success' },
      { failinfo: result === 'failed' },
    ]">
      <div class="tips">最终结果</div>
      <div class="setbutton" @click="dialogVisible = true">
        <Tools width="20px" />
      </div>
      <span class="redinfo" v-if="result === 'success'">通过</span>
      <span class="redinfo" v-if="result === 'failed'">失败</span>
    </div>
    <el-dialog v-model="dialogVisible" title="设置" width="70%" :before-close="handleClose">
      <set-config @close="
        () => {
          dialogVisible = false
        }
      "></set-config>
    </el-dialog>
  </div>
</template>

<script>
import { Tools } from '@element-plus/icons-vue'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import loadIcon from '../components/loadIcon.vue'
import { Check, CircleClose } from '@element-plus/icons-vue'
import ScanTips from '../components/scanTips.vue'
import Loading from '../components/loading.vue'
import Result from '../components/result.vue'
import Controller from '../common/Controller'
import Prodtesting from '../components/prodTesting.vue'
import SetConfig from '../components/setConfig.vue'
import { uploadLog } from '../http'
import { saveLog } from '../common/fileTool'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
export default defineComponent({
  components: {
    loadIcon,
    Check,
    CircleClose,
    ScanTips,
    Loading,
    Result,
    Prodtesting,
    SetConfig,
    Tools,
  },
  setup() {
    const DSK = ref('')
    const status = ref('unconnected')
    const showToIndex = ref(false)
    // status.value = 'prodtesting'
    const result = ref('pending')
    const dialogVisible = ref(false)
    const controller = new Controller()
    const content = ref('')
    const equipmentContent = ref('')
    const firmware = ref('')
    const showfirmware = ref(false)
    const showsteps = ref(false)
    const prodtestStates = ref([
      { desc: '测试设备开灯', state: 'waiting' },
      { desc: '测试LED显示红色', state: 'waiting' },
      { desc: '测试设备关灯', state: 'waiting' },
      { desc: '测试设备入网', state: 'waiting' },
      { desc: '测试LED显示蓝色', state: 'waiting' },
      { desc: '测试 RSSI', state: 'waiting' },
    ])
    const activeStep = ref(0)
    const initPage = () => {
      controller.destroy()
      DSK.value = ''
      status.value = 'unconnected'
      showToIndex.value = false
      result.value = 'pending'
      content.value = ''
      equipmentContent.value = ''
      firmware.value = ''
      showfirmware.value = false
      showsteps.value = true
      prodtestStates.value = [
      { desc: '测试设备开灯', state: 'waiting' },
      { desc: '测试LED显示红色', state: 'waiting' },
      { desc: '测试设备关灯', state: 'waiting' },
      { desc: '测试设备入网', state: 'waiting' },
      { desc: '测试LED显示蓝色', state: 'waiting' },
      { desc: '测试 RSSI', state: 'waiting' },
    ]
    activeStep.value = 0
    }
    const saveLogInfo = async (log, process, result) => {
      saveLog(dayjs().format('YYYY-MM-DD HH:mm:ss'), log)
      try {
        let res = await uploadLog({
          planCode: '0',
          process: process,
          result: result,
          log: log,
          dsk: DSK.value,
        })
        // alert(res)
      } catch (err) {
        // alert(err)
      }
    }
    //获取产测stub
    const prodInit = (servicelist) => {
      let zwaveThingService = Controller.getZwaveThingServe(servicelist)
      let tlpThingService = Controller.getTlpThingService(servicelist)
      let tlpThingStub = new Controller.TlpThingStub(
        controller.controller,
        tlpThingService
      )
      let zwaveThingStub = new Controller.ZwaveThingStub(
        controller.controller,
        zwaveThingService
      )
      return { tlpThingStub, zwaveThingStub }
    }
    const sleep = (time) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, time)
      })
    }


    const testOnoff3 = async (tlpThingStub, addLog) => {
      prodtestStates.value[0].state = 'pending'
      let res = await tlpThingStub.setThingAttribute('UATKThing', 'onoff3', {
        boolValue: true,
      })
      await sleep(1000)
      if (res) {
        res = await tlpThingStub.getThingAttribute('UATKThing', 'IO4')
      } else {
        prodtestStates.value[0].state = 'failed'
        return false
      }
      if (res.intValue == 1) {
        addLog("测试设备开灯：pass" + ` ${JSON.stringify(res)}`)
        prodtestStates.value[0].state = 'pass'
        prodtestStates.value[1].state = 'pending'
      } else {
        addLog("测试设备开灯：failed" + ` ${JSON.stringify(res)}`)
        prodtestStates.value[0].state = 'failed'
        return false
      }
      return true
    }

    const testRedColor = async (tlpThingStub, addLog) => {
      let res = await tlpThingStub.getThingAttribute('UATKThing', 'color')
      if (Math.abs((res.objectValue.h.intValue - 350)) <= 10 || (Math.abs((res.objectValue.h.intValue - 10)) <= 10)) {
        prodtestStates.value[1].state = 'pass'
        prodtestStates.value[2].state = 'pending'
        addLog('测试LED显示红色：pass\n' + ` ${JSON.stringify(res)}`)
      } else {
        addLog('测试LED显示红色：failed\n' + ` ${JSON.stringify(res)}`)
        prodtestStates.value[1].state = 'failed'
        return false
      }
      return true
    }

    const testoff = async (tlpThingStub, addLog) => {
      let res = await tlpThingStub.setThingAttribute('UATKThing', 'onoff3', {
        boolValue: false,
      })
      if (!res) {
        prodtestStates.value[2].state = 'failed'

        addLog('测试设备关灯：fail' + ` ${JSON.stringify(res)}`)

        return false
      }
      addLog('测试设备关灯：pass' + ` ${JSON.stringify(res)}`)
      await sleep(1000)
      res = await tlpThingStub.getThingAttribute('UATKThing', 'IO4')
      if (res.intValue == 0) {
        prodtestStates.value[2].state = 'pass'
        prodtestStates.value[3].state = 'pending'
      } else {
        prodtestStates.value[2].state = 'failed'

        return false
      }
      return true
    }

    const prodtest = () => {
      let log = ''
      activeStep.value=2
      status.value = 'prodtesting'
   
      const addLog = (content) => {
        log = log + content + '\n'
      }
      controller.setConnectCallback(async () => {
        let servicelist = await controller.getListServices()
        let { tlpThingStub, zwaveThingStub } = prodInit(servicelist)
        controller.registerZwaveThingEvent(zwaveThingStub)
        await zwaveThingStub.invokeBridgeCommand(DSK.value)

        /**
         * 测试开灯
         */
        let res = await testOnoff3(tlpThingStub, addLog)
        if (!res) {
          saveLogInfo(log, 'production test', 'failed')
          result.value = 'failed'
          return
        }
        /**
         * 红色灯检查
         */
        res = await testRedColor(tlpThingStub, addLog)
        if (!res) {
          saveLogInfo(log, 'production test', 'failed')
          result.value = 'failed'
          return
        }

        /**
         * 测试关灯
         */
        res = testoff(tlpThingStub, addLog)
        if (!res) {
          saveLogInfo(log, 'production test', 'failed')
          result.value = 'failed'
          return
        }


        let timer = setTimeout(() => {
          log = log + '测试设备入网：fail\n'
          saveLogInfo(log, 'production test', 'failed')
          prodtestStates.value[3].state = 'failed'
          zwaveThingStub.setThingJoined(() => { })
          zwaveThingStub.setThingLeft(() => { })
          zwaveThingStub.exclusionAllBridgeCommand()
        }, 60 * 1000)
        zwaveThingStub.setThingJoined(async (thingId) => {
          log = log + '测试设备入网：pass\n'
          prodtestStates.value[3].state = 'pass'
          prodtestStates.value[4].state = 'pending'
          clearTimeout(timer)
          await tlpThingStub.invokeThingCommand("ZnifferThing", "startZniffer", { "nodeId": { stringValue: thingId } })
          let res = await tlpThingStub.setThingAttribute(
            'UATKThing',
            'onoff3',
            {
              boolValue: true,
            }
          )

          await sleep(1000)

          res = await tlpThingStub.getThingAttribute('UATKThing', 'color')
          if (res.objectValue.h.intValue <= 260 && res.objectValue.h.intValue >= 190) {
            prodtestStates.value[4].state = 'pass'
            prodtestStates.value[5].state = 'pending'
            addLog('测试LED显示蓝色：pass' + ` ${JSON.stringify(res)}`)
          } else {
            addLog('测试LED显示蓝色：failed' + ` ${JSON.stringify(res)}`)
            prodtestStates.value[4].state = 'failed'
            saveLogInfo(log, 'production test', 'failed')
            result.value = 'failed'
            return
          }
          res = await tlpThingStub.setThingAttribute('UATKThing', 'onoff3', {
            boolValue: false,
          })
          res = await tlpThingStub.getThingAttribute('ZnifferThing', 'rssi')
          if (res.intValue > 60) {
            addLog('测试 RSSI：pass' + ` ${JSON.stringify(res)}`)

          } else {
            addLog('测试 RSSI：failed' + ` ${JSON.stringify(res)}`)
            result.value = 'failed'
          }
          status.value = 'offNetwork'
          activeStep.value=3
        })
        zwaveThingStub.setThingLeft((success) => {
          console.warn('ThingLeft')
          if (success) {
            addLog('测试设备离网：pass')
            status.value = 'offNetworkSuccess'
            saveLogInfo(log, 'production test', 'pass')
            result.value = 'success'
          } else {
            addLog('测试设备离网：failed')
            status.value = 'offNetworkFail'
            saveLogInfo(log, 'production test', 'failed')
            result.value = 'failed'
          }
          activeStep.value=4
        })
        zwaveThingStub.triggerThingJoined()

      })
      controller.connect()
    }

    let startBurn = async () => {
      try {


        let tlpThingStub = startBurn.tlpThingStub
        let log = ''
        const addLog = (content) => {
          log = log + content + '\n'
        }
        status.value = 'loadingFirmware'
        let res = await tlpThingStub.invokeThingCommand('JLinkThing', 'burn', {
          fw: { stringValue: firmware.value },
        })
        if (res.boolValue) {
          addLog('烧录固件：pass' + ` ${JSON.stringify(res)}`)
          status.value = 'firmwareLoadSuccess'
        } else {
          addLog('烧录固件：failed' + ` ${JSON.stringify(res)}`)
          status.value = 'firmwareLoadFail'
          saveLogInfo(log, 'production burn', 'failed')
          return
        }
        await sleep(1000)
        status.value = 'loadingDSK'
        res = await tlpThingStub.getThingAttribute('JLinkThing', 'dsk')
        addLog('读取dsk：pass' + ` ${JSON.stringify(res)}`)
        status.value = 'DSKLoadSuccess'

        await sleep(1000)
        status.value = 'printingDSK'
        res = await tlpThingStub.invokeThingCommand('PrintThing', 'printDSK', {
          dsk: res,
          fw: { stringValue: firmware.value },
        })
        addLog('打印dsk：pass' + ` ${JSON.stringify(res)}`)
        status.value = 'uploadDSKSuccess'
        saveLogInfo(log)
        result.value = 'success'
      } catch (err) {
        result.value = 'failed'
        ElMessage({
          showClose: true,
          message: err,
          type: 'error',
        })
      }

    }

    const prodburn = () => {
      showfirmware.value = true
      status.value = 'placemodule'
      controller.setConnectCallback(async () => {
        let servicelist = await controller.getListServices()
        let tlpThingService = Controller.getTlpThingService(servicelist)
        let tlpThingStub = new Controller.TlpThingStub(
          controller.controller,
          tlpThingService
        )
        startBurn.tlpThingStub = tlpThingStub
        tlpThingStub.setThingAttributeUpdated(async () => {
          console.warn('ThingAttributeUpdated')
          let res = await tlpThingStub.getThingAttribute('UATKThing', 'IO4')
          if (res.intValue !== 1) {
            ElMessage({
              showClose: true,
              message: '监听失败',
              type: 'error',
            })
            return
          }
          // status.value = 'placemodule'

          startBurn()


        })
      })
      controller.connect()
    }

    const qrcodeprint = () => {
      status.value = 'printingCode'
      controller.setConnectCallback(async () => {
        let servicelist = await controller.getListServices()
        let tlpThingService = Controller.getTlpThingService(servicelist)
        let tlpThingStub = new Controller.TlpThingStub(
          controller.controller,
          tlpThingService
        )
        let res = await tlpThingStub.invokeThingCommand(
          'PrintThing',
          'printDSK',
          { dsk: '', fw: '' }
        )
        status.value = 'printSuccess'
        result.value = 'success'
      })
      controller.connect()
    }

    const toIndex = () => {
      initPage()
     }
    onMounted(async () => {
      let processContent = window.localStorage.getItem("processContent")
      if (processContent != null) {
        content.value = processContent
      }
      document.addEventListener('keydown', (event) => {

        if (status.value === 'unconnected' && event.key === 'Enter') {

          try {
            let json = JSON.parse(content.value)
            if (json.process === undefined) {
              ElMessage({
                showClose: true,
                message: '缺乏工序信息',
                type: 'error',
              })
            } else if (json.process === 'production test') {
              showsteps.value = true
              activeStep.value=1
              window.localStorage.setItem("processContent", content.value)
              status.value = 'beforeTest'
            } else if (json.process === 'production burn') {
              window.localStorage.setItem("processContent", content.value)
              firmware.value = json.firmware
              prodburn()
            } else if (json.process === 'qrcode print') {
              window.localStorage.setItem("processContent", content.value)
              qrcodeprint()
            }
          } catch (err) {
            ElMessage({
              showClose: true,
              message: '格式有误：' + err.message,
              type: 'error',
            })
          }
        }
        if (status.value === 'beforeTest' && event.key === 'Enter') {
          if (equipmentContent.value != "") {
            DSK.value = equipmentContent.value
            prodtest()
          }

        }
      })

      // prodburn()
      // prodtest()
    })
    onBeforeUnmount(() => {
      controller.destroy()
    })
    // console.log(controller)
    return {
      result,
      status,
      prodtestStates,
      showToIndex,
      toIndex,
      dialogVisible,
      content,
      equipmentContent,
      firmware,
      startBurn,
      showfirmware,
      showsteps,
      activeStep
    }
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

.toindex {
  border: 1px solid rgb(216, 216, 216);
  border-radius: 1000px;
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 200px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  cursor: pointer;
  color: black;

  &:hover {
    background-color: rgb(249, 249, 249);
    color: rgb(98, 98, 98);
  }
}

.placemodulebutton {
  border: 1px solid rgb(216, 216, 216);
  border-radius: 1000px;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  width: 200px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0, 221, 33);
  color: white;
  cursor: pointer;

  &:hover {
    background-color: rgb(2, 197, 31);
    color: white;
  }
}

.logo {
  width: 150px;
  position: absolute;
  top: 20px;
  left: 20px;
}

.firmware-version {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 25px;
  font-weight: 900;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .main-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 300px;
    background-color: rgba(241, 241, 241, 0.529);

    .unconnect {
      font-size: 25px;
      font-weight: 900;
      .absolute-center;

      .tips {
        margin-bottom: 20px;
      }

      .input {
        height: 50px;
      }
    }

    .searching {
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
    }

    .placemodule {
      font-size: 25px;
      font-weight: 900;
      .absolute-center;
    }

    .loading-firmware {
      .absolute-center;

      .loading-icon {
        color: gray;
        margin-bottom: 20px;
      }

      .times {
        color: rgb(0, 115, 255);
      }

      .tips {
        font-size: 25px;
        font-weight: 900;
        margin-bottom: 10px;
      }
    }

    .firmwareload-success {
      .absolute-center;
      font-size: 25px;
      font-weight: 900;

      .tips {
        margin-top: 20px;
        font-size: 18px;
      }
    }

    .firmwareload-fail {
      .absolute-center;
      font-size: 25px;
      font-weight: 900;

      .resinfo {
        margin: 20px;
      }

      .tips {
        font-weight: 400;
        font-size: 15px;
      }
    }

    .write-succeeded {
      .absolute-center;
      font-size: 25px;
      font-weight: 900;
    }
  }

  .failinfo {
    background-color: red !important;
    color: white;
  }

  .successinfo {
    background-color: rgb(3, 218, 175) !important;
    color: white;
  }

  .result-container {
    position: absolute;
    width: 300px;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 40px;
    background-color: white;
    box-shadow: 0px 0px 5px grey;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    .setbutton {
      position: absolute;
      top: 20px;
      right: 40px;
      cursor: pointer;
    }

    .tips {
      text-align: left;
      position: absolute;
      top: 20px;
      left: 40px;
      font-weight: 900;
    }

    .redinfo {
      font-size: 40px;
      font-weight: 900;
    }
  }

  .steps {
    position: absolute;
    top: 50px;
    left: 50px;
    right: 50px;
    height: 50px;
  }
}
</style>
