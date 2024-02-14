import { CreateNewUserTokenDTO, CreateUserTokenDTO, isValidToken } from '../dto/user.dto';
import { InvalidTokenErrorDomain } from '@infra/errors/domain_error';
import { Domain } from '@shared/domain';

export class UserToken extends Domain {
  private _token: string;
  private _user_id: string;
  private _type: string;
  private _is_active: boolean;
  private _valid_till: Date;
  private _created_at: Date;

  constructor(data: CreateUserTokenDTO) {
    super(data.id);
    this._token = data.token;
    this._type = data.type;
    this._user_id = data.user_id;
    this._is_active = data.is_active === false ? false : true;
    this._valid_till = data.valid_till;
    this._created_at = data.created_at;
  }

  static create(data: CreateNewUserTokenDTO): UserToken | InvalidTokenErrorDomain {
    const user_token_id = UserToken.createUniqueId();
    const token = UserToken.createUniqueToken(data.token_length || 20);

    const user_token = new UserToken({
      id: user_token_id,
      token,
      user_id: data.user_id,
      type: data.type,
      is_active: true,
      valid_till: data.valid_till,
      created_at: new Date(),
    });

    if (!UserToken.validate(user_token)) {
      return new InvalidTokenErrorDomain();
    }
    return user_token;
  }

  static createUniqueToken(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
    return token;
  }

  static validate(token: UserToken): boolean {
    if (isValidToken(token._type)) return true;

    return false;
  }

  static isUserToken(token: any): token is UserToken {
    return token instanceof UserToken;
  }

  get token(): string {
    return this._token;
  }

  get user_id(): string {
    return this._user_id;
  }

  get type(): string {
    return this._type;
  }

  get is_active(): boolean {
    return this._is_active;
  }

  get valid_till(): Date {
    return this._valid_till;
  }

  get created_at(): Date {
    return this._created_at;
  }

  public is_valid(): boolean {
    return this.is_active && this._valid_till > new Date();
  }
}
