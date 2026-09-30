export interface Comment {
  _id: string;
  post_id: string;
  user_id: string;
  username: string;
  content: string;
  date: Date;
}

export interface CreateCommentInput {
  post_id: string;
  user_id: string;
  username: string;
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}
