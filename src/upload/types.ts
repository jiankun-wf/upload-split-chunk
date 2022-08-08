import { AxiosRequestHeaders, Canceler } from 'axios';

export interface CreateUploadSplitOption {
  split?: number;
  name?: string;
  data?: Record<string, any>;
  max?: number;
  url: string;
  headers?: AxiosRequestHeaders;
  onComplate?: (...args: any) => void; // 上传完成回调
}

export interface IChunkFile {
  percent: number;
  file: Blob,
  chunkId: string;
  status: 'pending' | 'uploading' | 'error' | 'complete';
  fileName: string;
  index: number;
  cancel?: Canceler;
}

export interface UploadApiParams {
  data?: Record<string, any>,
  onUploadProgress: (e: any) => void;
  headers?: AxiosRequestHeaders   
  url: string;
}