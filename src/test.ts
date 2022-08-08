import Upload from './upload/index'

const file = new File([new Blob(['123123123'])], 'test.txt')
const split_upload = new Upload(file, {
  split: 1024 * 1024 * 2, // 单个碎片大小 默认 1M
  name: 'file', // 上传文件的参数名
  data: { dir: 'test', type: 'release' }, // 额外的参数
  max: 8, // 每次的进程数 8片/次
  url: 'https://localhost:2233', // url请求地址 一般为proxy代理
  headers: { 'WI-FONT-AUTHENTICATE': 'bcfa6a89-50f3-4550-a9a3-def7d867da25' }, // 请求头额外信息
  onComplate: ({ chunks, file, times }) => {
    // 所有chunk
    // 原始文件
    // 总用时   
  }
})

split_upload.upload();