export interface ImgBlobStatus {
  url: string;
  loading: boolean;
  error: boolean;
}
export type ImgBlobs = Record<string, ImgBlobStatus>;
