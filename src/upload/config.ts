import { CreateUploadSplitOption } from "./types"

export const createDefaultOption = (): CreateUploadSplitOption => {
  return {
    split: 1024 * 1024,
    name: 'file',
    data: {},
    headers: {},
    max: 6,
    url: '',
    onComplate: () => {
      console.log('is-success')  
    }
  }
}