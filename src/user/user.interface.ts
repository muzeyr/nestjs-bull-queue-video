export interface UserData {
  name: string;
  surname: string;
  email: string;
  token: string;
  bio: string;
  image?: string;
}

export interface UserRO {
  user: UserData;
}