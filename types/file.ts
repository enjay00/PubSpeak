export type FileInfo = {
  name: string;
  extension: string;
  fullName: string;
  creationTime?: number;
};

export type FilePath = {
  contentUri: string;
  creationTime: Date;
  exists: boolean;
  md5: string;
  modificationTime: number;
  size: number;
  type: string;
  uri: string;
};
