import { EvvrController, ThingServiceStub } from './TLPSDK'
import Config from './config'
class ZwaveThingStub {
  stub
  bridgelist = []
  zwaveBridge
  hasJoin = false
  needTrigger = false
  constructor(controller, service) {
    this.stub = new ThingServiceStub(controller, service)
  }
  static getZwaveThingServe(listServices = []) {
    for (const service of listServices) {
      if (service.providerId == 'zwave_thing') {
        return service
      }
    }
  }
  listBridges() {
    return new Promise((res, rej) => {
      this.stub.listBridges(-1, -1, { intValue: 0 }, (code, data) => {
        if (code == 200) {
          res(data)
        } else {
          rej(data)
        }
      })
    })
  }
  async getZwaveBridge() {
    if (this.bridgelist.length == 0) {
      this.bridgelist = await this.listBridges()
    }
    for (const bridge of this.bridgelist) {
      if (bridge.bridgeId == 'zwave-bridge') {
        this.zwaveBridge = bridge
      }
    }
    return this.zwaveBridge
  }
  setThingJoined(func) {
    this.thingJoined = func
  }
  setThingLeft(func) {
    this.thingLeft = func
  }
  triggerThingJoined() {
    this.needTrigger = true
    if (this.hasJoin && this.needTrigger) {
      this.executeThingJoined()
    }
  }
  executeThingJoined() {
    console.warn('executeThingJoined')
    if (this.joinEvent) {
      this.joinEvent()
    }
  }
  async onThingJoined() {
    if (this.zwaveBridge === undefined) {
      this.zwaveBridge = await this.getZwaveBridge()
    }
    if ('bridgeId' in this.zwaveBridge) {
      this.stub.onThingJoined((thingId1) => {
        //监听thing 离网
        this.stub.onThingLeft((leftThingId) => {
          console.warn('onThingLeft:', leftThingId)
          if (this.thingLeft) {
            this.thingLeft(thingId1 == leftThingId)
          }
        })
        this.hasJoin = true

        this.joinEvent = async () => {
          var thingId = '' + thingId1
          console.warn('join thingId:', thingId)
          if (this.thingJoined) {
            await this.thingJoined(thingId1)
          }

          //send thing 离网
          this.exclusionBridgeCommand(thingId1)
        }
        if (this.hasJoin && this.needTrigger) {
          this.executeThingJoined(thingId1)
        }
      })
    }
  }
  exclusionBridgeCommand(thingId) {
    var params3 = { thingId: { stringValue: String(thingId) } }
    console.warn(params3)
    this.stub.invokeBridgeCommand(
      this.zwaveBridge.bridgeId,
      'exclusion',
      params3,
      (resCode, data) => {
        if (resCode == 200) {
          console.warn('send exclusion success.')
        }
      }
    )
  }
  exclusionAllBridgeCommand() {
    //获取thing列表
    this.stub.listThings(-1, -1, { intValue: 0 }, (code, data) => {
      if (code == 200) {
        console.log('things length', data.length)
        if (data.length > 0) {
          for (const thing of data) {
            console.warn('thing:', JSON.stringify(thing))
            console.warn('thingId:', thing.thingId)
            var params3 = { thingId: { stringValue: String(thing.thingId) } }
            //send thing 离网
            this.stub.invokeBridgeCommand(
              this.zwaveBridge.bridgeId,
              'exclusion',
              params3,
              (resCode, data) => {
                if (resCode == 200) {
                  console.warn('list things send exclusion success.')
                }
              }
            )
          }
        }
      }
    })
  }
  inclusionBridgeCommand(dsk) {
    var code = String(dsk)
    var params1 = { dsk: { stringValue: code } }
    this.stub.invokeBridgeCommand(
      this.zwaveBridge.bridgeId,
      'inclusion',
      params1,
      (resCode, data) => {
        if (resCode == 200) {
          console.warn('send inclusion success.')
        }
      }
    )
  }
  //扫码入网
  async invokeBridgeCommand(dsk) {
    if (this.zwaveBridge === undefined) {
      await this.getZwaveBridge()
    }
    await this.onThingJoined()
    this.inclusionBridgeCommand(dsk)
  }
}
class TlpThingStub {
  stub
  constructor(controller, service) {
    this.stub = new ThingServiceStub(controller, service)
  }
  setThingAttributeUpdated(func) {
    this.stub.onThingAttributeUpdated(func)
  }
  static getTlpThingService(listServices = []) {
    for (const service of listServices) {
      if (
        service.serviceType == 'tlp.ThingService' &&
        service.label == 'factory thing service'
      ) {
        return service
      }
    }
  }
  invokeThingCommand(thingId, cmd, params) {
    return new Promise((res, rej) => {
      this.stub.invokeThingCommand(thingId, cmd, params, (resCode, data) => {
        if (resCode == 200) {
          res(data)
        } else {
          rej(data)
        }
      })
    })
  }
  setThingAttribute(thingId, attributeId, attribute) {
    // console.log(thingId,attributeId,attribute)
    return new Promise((res, rej) => {
      this.stub.setThingAttribute(
        thingId,
        attributeId,
        attribute,
        (resCode, data) => {
          if (resCode == 200) {
            res(data)
          } else {
            rej(data)
          }
        }
      )
    })
  }
  getThingAttribute(thingId, attributeId) {
    return new Promise((res, rej) => {
      this.stub.getThingAttribute(thingId, attributeId, (resCode, data) => {
        if (resCode == 200) {
          res(data)
        } else {
          rej(data)
        }
      })
    })
  }
}

class Controller {
  controller
  connectCallback
  constructor() {
    this.controller = new EvvrController()
  }
  setConnectCallback(func) {
    this.connectCallback = func
  }
  getListServices() {
    let coreStub = this.controller.getCoreStub()
    return new Promise((res, rej) => {
      coreStub.listServices(-1, -1, { intValue: 0 }, (code, data) => {
        if (code == 200) {
          res(data)
        } else {
          rej({ code, message: data })
        }
      })
    })
  }
  static getZwaveThingServe = ZwaveThingStub.getZwaveThingServe
  static getTlpThingService = TlpThingStub.getTlpThingService
  static TlpThingStub = TlpThingStub
  static ZwaveThingStub = ZwaveThingStub
  registerEventByService(service) {
    var stub = new ThingServiceStub(controller, service)
    this.controller.registerEvent(stub)
    return stub
  }
  registerEventBySub(stub) {
    this.controller.registerEvent(stub)
  }
  registerZwaveThingEvent(zwaveThing) {
    this.controller.registerEvent(zwaveThing.stub)
  }
  registerTlpThingStubEvent(tlpThing) {
    this.controller.registerEvent(tlpThing.stub)
  }
  connect() {
    this.controller.setConnectCallback(() => {
      if (this.connectCallback) {
        this.connectCallback()
      }
    })
    let url = Config.wsurl
    let options = {}
    options.clientId = 'client' + Date.now()
    options.username = 'System'
    options.password = 'focalcrest'
    options.port = 1887
    this.controller.connect(url, options)
  }
  destroy() {
    this.controller.disconnect()
  }
}

export default Controller
