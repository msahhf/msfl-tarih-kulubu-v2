import { MediaInfo } from "./common";

export interface Post {
  _id: string;
  user_id: string;
  username: string;
  title: string;
  content: string;
  images: MediaInfo[];
  date: Date;
}

export interface CreatePostInput {
  user_id: string;
  username: string;
  title: string;
  content: string;
  images?: MediaInfo[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  images?: MediaInfo[];
}
