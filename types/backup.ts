export interface Backup {
  _id: string;
  userId: string;
  username: string | null;
  email: string | null;
  deletedAt: Date;
  ipHistory: string[];
  loginHistory: object[];
  deviceInfo: object[];
  userData: UserData;
}

export interface UserData {
  profile: object;
  posts: object[];
  comments: object[];
}

export interface CreateBackupInput {
  userId: string;
  username?: string;
  email?: string;
  userData: UserData;
  ipHistory?: string[];
  loginHistory?: object[];
  deviceInfo?: object[];
}
