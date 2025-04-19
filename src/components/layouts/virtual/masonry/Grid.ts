import { PostRsp } from 'global/interface/post';

export type Item = {
  image: string;
  postRsp: PostRsp;
};

export type Size = {
  width: number;
  height: number;
};

export type PostItem = {
  image: string;
  postRsp: PostRsp;
  size: Size;
};
