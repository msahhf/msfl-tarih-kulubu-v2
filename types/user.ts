import { MediaInfo, SocialLinks } from "./common";

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  role: string;
  date: Date;
  avatar: MediaInfo;
  coverImage: MediaInfo;
  social: SocialLinks;
  bio: string;
  analyticsCookies: boolean;
  personalizationCookies: boolean;
  serviceDataUsage: boolean;
  personalizedContent: boolean;
  resetCode: string | null;
  resetCodeExpires: Date | null;
}

export type { SocialLinks };

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  role?: string;
  analyticsCookies?: boolean;
  personalizationCookies?: boolean;
  serviceDataUsage?: boolean;
  personalizedContent?: boolean;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  name?: string;
  surname?: string;
  bio?: string;
  avatar?: MediaInfo;
  coverImage?: MediaInfo;
  social?: Partial<SocialLinks>;
  analyticsCookies?: boolean;
  personalizationCookies?: boolean;
  serviceDataUsage?: boolean;
  personalizedContent?: boolean;
}

export interface PasswordResetInput {
  resetCode: string;
  resetCodeExpires: number;
}
