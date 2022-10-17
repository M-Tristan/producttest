import { readConfig } from '../common/fileTool'
class Config {
  static config = {
    wsurl: 'ws://192.168.202.148',
    httpurl: 'http://192.168.202.107:9999',
  }
  static get wsurl() {
    return Config.config.wsurl
  }
  static get httpurl() {
    return Config.config.httpurl
  }
  static setConfig(config) {
    if (config.wsurl) {
      Config.config.wsurl = config.wsurl
    }
    if (config.httpurl) {
      Config.config.httpurl = config.httpurl
    }
  }
  static async initConfig() {
    let config = await readConfig()
    Config.setConfig(config)
  }
}

export default Config
