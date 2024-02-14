export type JwtTokenObject = {
  user_id: string;
  user_name: string;
};

export interface TokenDecoded extends JwtTokenObject {
  iat: number;
  exp: number;
}
