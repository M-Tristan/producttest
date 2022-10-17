import Request from '../common/request'
let http = new Request('http://192.168.202.115:9999', 10000)
export const uploadLog = (data) => {
  if (data.dsk === undefined) {
    throw Error('dsk不许为空')
  }
  return http.request('/api/brand/evvr/project/irs/device/{{dsk}}/log', {
    method: 'put',
    data,
  })
}

export default { uploadLog }
