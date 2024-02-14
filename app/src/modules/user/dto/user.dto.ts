export interface CreateUserDTO {
  id?: string;
  name: string;
  email: string;
  password: string;
  email_verified?: boolean;
}
export interface UserWebDTO {
  id: string;
  name: string;
  email: string;
}

const validTokens = ['email_verification', 'password_reset', 'refresh_token'] as const;

export type valid_tokens = (typeof validTokens)[number];

export function isValidToken(token: string): token is valid_tokens {
  return validTokens.includes(token as valid_tokens);
}

export interface CreateUserTokenDTO {
  id?: string;
  user_id: string;
  token: string;
  type: valid_tokens;
  is_active?: boolean;
  valid_till: Date;
  created_at: Date;
}

export interface CreateNewUserTokenDTO {
  user_id: string;
  type: valid_tokens;
  valid_till: Date;
  token_length?: number;
}
