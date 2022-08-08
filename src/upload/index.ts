import { IChunkFile, CreateUploadSplitOption } from "./types";
import {  createDefaultOption } from './config'
import { uploadOrigin } from './axios';

export class UploadSplit {
  
    private file: File;
 
    private split_config: CreateUploadSplitOption;
    private chunks: IChunkFile[] = [];

 
    constructor(file: File, config: CreateUploadSplitOption) {
       // 文件   
       this.file = file;
        
       this.split_config = Object.assign(createDefaultOption(), config);
 
       this.createEveryChunk()

    }

    private get_config = (key: keyof CreateUploadSplitOption) => {
        return this.split_config[key];
    }
  
    private createEveryChunk = (): IChunkFile[]  => {
        let cur = 0
        let index = 0
        const size = this.file.size;
        const name = this.file.name;
        const split = this.get_config('split') as number;
        while(cur < size) {
            // 使用slice方法切片 聚集到chunks中
            this.chunks.push({
                file: this.file.slice(cur, cur + size),
                percent: 0,
                status: 'pending',
                cancel: undefined,
                chunkId: `${name}-chunk__${index++}-${new Date().getTime()}`,
                fileName: name,
                index,
            })
            cur += split
        }
        return this.chunks;
    }

    private groupUploadResigter = (chunks: IChunkFile[]) => {
      const url = this.get_config('url') as string;
      const name = this.get_config('name') as string;
      const data = this.get_config('data') as any;
      const headers = this.get_config('headers') as any;
      
      return Promise.all(chunks.map(item => {
        item.status = 'uploading'; 
        const uploadData = { [name]: item.file, ...data }
        const formData = new FormData()
        Object.keys(uploadData).forEach(key => {
          formData.append(key, uploadData[key]);
        });
        return uploadOrigin({
          url,
          headers,
          data: formData,
          onUploadProgress(progress) {
             item.percent = Math.floor(progress.loaded/progress.total*100)
             if(item.percent >= 100 ) {
                item.status = 'complete';
             }
          },
        }, item)
      }))

    }

    public upload = async () => {
       let index = 0;
       const max = this.get_config('max') as number; 
       const complete = this.get_config('onComplate') as Function;
       
       const chunks = this.chunks;
       const successChunks: IChunkFile[] = [];
       const errorChunks: IChunkFile[] = [];
       // 分割chunk max为一组
       // 一组一组的上传 成功的放到sucess里 失败的放入error最后重新上传
       const startTime = new Date().getTime();   
       while(index < chunks.length) {
          
          const res = await this.groupUploadResigter(chunks.slice(index, max));
          
          errorChunks.concat(res.filter(item => item.status === 'error').map(item => item.chunk));

          successChunks.concat(res.filter(item => item.status === 'success').map(item => item.chunk));  
          
          index += max;
       }
       index = 0;
       // 上传失败的
       while(errorChunks.length > 0) {
          
        const res = await this.groupUploadResigter(errorChunks.slice(index, max))
        
        errorChunks.concat(res.filter(item => item.status === 'error').map(item => item.chunk));

        successChunks.concat(res.filter(item => item.status === 'success').map(item => item.chunk));  

        errorChunks.slice(index, max);
        
     }
     complete && complete.call(null, {
       chunks,
       originFile: this.file,
       times: (Date.now() - startTime) / 1000,
     });
    }
 }