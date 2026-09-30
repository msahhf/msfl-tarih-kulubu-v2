export interface SupportMessage {
  _id: string;
  name: string | null;
  email: string;
  topic: string;
  message: string;
  user_id: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupportMessageInput {
  name?: string;
  email: string;
  topic?: string;
  message: string;
  user_id?: string;
}

export interface UpdateSupportMessageInput {
  status: string;
}
