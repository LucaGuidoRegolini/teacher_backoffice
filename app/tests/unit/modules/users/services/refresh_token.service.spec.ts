import { MockUserRepository } from '@tests/doubles/repositories/in-memory.repository';
import { RefreshTokenService } from '@modules/user/services/refresh_token.service';
import { UserToken } from '@modules/user/domains/user_token.domain';
import { User } from '@modules/user/domains/user.domain';
import { rightResponse } from '@tests/mocks/responses';
import { timeInMillisecond } from '@configs/timestamp';
import { SuccessfulResponse } from '@infra/either';

const mockUserRepository = MockUserRepository.getInstance();

describe('Refresh user login service', () => {
  let refreshTokenService: RefreshTokenService;

  beforeEach(() => {
    refreshTokenService = RefreshTokenService.getInstance(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(refreshTokenService).toBeDefined();
  });

  it('should refresh a user login', async () => {
    const user_token = new UserToken({
      id: 'any_id',
      token: 'any_token',
      user_id: 'any_user_id',
      type: 'refresh_token',
      is_active: true,
      valid_till: new Date(Date.now() + timeInMillisecond.hours),
      created_at: new Date(),
    });

    const user = User.create({
      id: 'any_user_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    user.setEmailVerified(true);

    mockUserRepository.findToken = rightResponse(user_token);
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const resp = await refreshTokenService.execute({
      refresh_token: user_token.token,
    });

    const user_resp = resp.map((user) => user).user;

    expect(resp.isRight()).toBeTruthy();
    expect(user_resp.id).toBeDefined();
  });
});
