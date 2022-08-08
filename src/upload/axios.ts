import axios from 'axios';
import { UploadApiParams, IChunkFile } from './types'

export const uploadOrigin = ({
   data = {},
   headers = {},
   onUploadProgress = e => 0,
   url,
}: UploadApiParams, chunk: IChunkFile): Promise<{ status: 'success' | 'error', res: any, chunk: IChunkFile }> =>  {
  return new Promise(resove => {
    axios.post(url, data, {
        headers,
        onUploadProgress,
        cancelToken: new axios.CancelToken((e) => {
           chunk.cancel = e;
        })
    }).then((res: any) => {
        resove({ status: 'success', res, chunk })
    }).catch((err: any) => {
        chunk.status = 'error';
        resove({ status: 'error', res: err, chunk })
    })
  })  
}
