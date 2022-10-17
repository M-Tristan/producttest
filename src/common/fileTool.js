import * as fs from '@tauri-apps/api/fs'
const BaseDirectory = fs.BaseDirectory
const exists = (dir) => {
  return fs.exists(dir, { dir: BaseDirectory.App })
}
const readDir = (dir) => {
  return fs.readDir(dir, { dir: BaseDirectory.App, recursive: true })
}
const createDir = (dir) => {
  return fs.createDir(dir, { dir: BaseDirectory.App, recursive: true })
}

export const readTextFile = (dir) => {
  return fs.readTextFile(dir, { dir: BaseDirectory.App })
}
const removeDir = (dir) => {
  return fs.removeDir(dir, { dir: BaseDirectory.App })
}
const removeFile = (dir) => {
  return fs.removeFile(dir, { dir: BaseDirectory.App })
}
const renameFile = (dir, rdir) => {
  return fs.renameFile(dir, rdir, { dir: BaseDirectory.App })
}
const copyFile = (dir, rdir) => {
  return fs.copyFile(dir, rdir, { dir: BaseDirectory.App })
}
export const writeTextFile = (file, cont) => {
  return fs.writeTextFile(file, cont, { dir: BaseDirectory.App })
}

export const setConfig = async (content) => {
  let res = await exists('resources')
  if (!res) {
    await createDir('resources')
  }
  await writeTextFile('resources/config.txt', content)
}

export const readConfig = async () => {
  let res = await exists('resources/config.txt')
  let cofigFile = 'resources/config.txt'
  if (res) {
    let config = await readTextFile(cofigFile)
    return JSON.parse(config)
  } else {
    return {}
  }
}

export const saveLog = async (file, content) => {
  let res = await exists('log')
  if (!res) {
    await createDir('log')
  }
  await writeTextFile(`log/${file}.txt`, content)
}

export default {
  readTextFile,
  writeTextFile,
  readConfig,
  setConfig,
  saveLog,
}
