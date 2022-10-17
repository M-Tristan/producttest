//import {EvvrController} from './evvr-controller.js';
//import {ThingServiceStub} from './lib/tlp/ThingServiceStub.js'

import { EvvrController, ThingServiceStub } from './dist/TLPSDK.js'

var controller = new EvvrController()

controller.setConnectCallback(() => {
  var coreStub = controller.getCoreStub()
  //获取服务列表
  coreStub.listServices(-1, -1, { intValue: 0 }, (code, data) => {
    if (code == 200) {
      console.log('load list Services Success')

      document.getElementById('services').innerHTML = JSON.stringify(data)
      var zwaveThingService = {}
      for (const service of data) {
        if (service.providerId == 'zwave_thing') {
          zwaveThingService = service
          break
        }
      }
      console.log('zwave thing service:', JSON.stringify(zwaveThingService))
      var zwaveThingStub = new ThingServiceStub(controller, zwaveThingService)
      //注册event监听器
      controller.registerEvent(zwaveThingStub)

      //获取bridge列表
      zwaveThingStub.listBridges(-1, -1, { intValue: 0 }, (code, data) => {
        if (code == 200) {
          var zwaveBridge = {}
          for (const bridge of data) {
            if (bridge.bridgeId == 'zwave-bridge') {
              zwaveBridge = bridge
            }
          }
          if ('bridgeId' in zwaveBridge) {
            //监听thing 离网
            zwaveThingStub.onThingLeft((leftThingId) => {
              console.log('left thingId:', leftThingId)
            })

            //获取thing列表
            zwaveThingStub.listThings(-1, -1, { intValue: 0 }, (code, data) => {
              if (code == 200) {
                console.log('things length', data.length)
                document.getElementById('things').innerHTML =
                  JSON.stringify(data)
                if (data.length > 0) {
                  for (const thing of data) {
                    console.log('thing:', JSON.stringify(thing))
                    console.log('thingId:', thing.thingId)
                    var params3 = { thingId: { stringValue: thing.thingId } }
                    //send thing 离网
                    zwaveThingStub.invokeBridgeCommand(
                      zwaveBridge.bridgeId,
                      'exclusion',
                      params3,
                      (resCode, data) => {
                        if (resCode == 200) {
                          console.log('list things send exclusion success.')
                        }
                      }
                    )
                  }
                }
              }
            })
          }
        }
      })

      zwaveThingStub.onThingAttributeUpdated((thingId, attributeId, data) => {
        document.getElementById('attributeUpdate').innerHTML =
          'thingId:' +
          thingId +
          ' ' +
          'attributeId:' +
          attributeId +
          ' ' +
          'data:' +
          JSON.stringify(data)
      })
    } else {
      console.log('failed code:', code, ' message:', data)
    }
  })
})
//var url = "mqtt://192.168.202.90";
var url = 'ws://192.168.202.177'
var options = {}
options.clientId = 'test1222'
options.username = 'System'
options.password = 'focalcrest'
//options.port = 1886;
options.port = 1887
controller.connect(url, options)
