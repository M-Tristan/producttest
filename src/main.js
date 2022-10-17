import { createApp } from 'vue'
import elementUse from './common/elementuse'
import './style.css'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Config from './common/config'
// import { platform } from '@tauri-apps/api/os';
// const platformName = await platform();
const init = async () => {
  // console.log(platformName)
  let res = await Config.initConfig()
  const app = createApp(App)
  elementUse(app)
  app.mount('#app')
}
init()
