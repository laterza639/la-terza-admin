export interface LoginStatusResponse {
  id: string;
  email: string;
  password: string;
  branch: string;
  roles: string[];
  token: string;
}