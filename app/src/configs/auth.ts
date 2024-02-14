import { timeInMillisecond } from './timestamp';
import { jwt_secret } from './global_env';

export const auth_config = {
  expireIn: '24h',
  secreteKey: jwt_secret || 'default',
};

export const password_salt = 10;

export const refresh_token_config = {
  length: 100,
  valid_till: timeInMillisecond.days * 30,
};
