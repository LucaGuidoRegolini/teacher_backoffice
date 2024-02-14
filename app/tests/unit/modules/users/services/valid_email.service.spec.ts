import { MockUserRepository } from '@tests/doubles/repositories/in-memory.repository';
import { ValidataEmailService } from '@modules/user/services/valid_email.service';
import { leftResponse, rightResponse } from '@tests/mocks/responses';
import { UserToken } from '@modules/user/domains/user_token.domain';
import { BadRequestError } from '@infra/errors/http_errors';
import { User } from '@modules/user/domains/user.domain';
import { timeInMillisecond } from '@configs/timestamp';
import { SuccessfulResponse } from '@infra/either';
import { AppError } from '@infra/errors';

const mockUserRepository = MockUserRepository.getInstance();

describe('Valid user email service', () => {
  let validataEmailService: ValidataEmailService;

  beforeEach(() => {
    validataEmailService = ValidataEmailService.getInstance(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(validataEmailService).toBeDefined();
  });

  it('should validate a user email', async () => {
    const user_token = new UserToken({
      id: 'any_id',
      token: 'any_token',
      user_id: 'any_user_id',
      type: 'email_verification',
      is_active: true,
      valid_till: new Date(Date.now() + timeInMillisecond.hours * 3),
      created_at: new Date(),
    });

    const user = User.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    mockUserRepository.findToken = rightResponse(user_token);
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const resp = await validataEmailService.execute({
      token: user_token.token,
    });

    expect(resp.isRight()).toBeTruthy();
  });

  it('should not validate because token not exist', async () => {
    const user_token = new UserToken({
      id: 'any_id',
      token: 'any_token',
      user_id: 'any_user_id',
      type: 'email_verification',
      is_active: true,
      valid_till: new Date(),
      created_at: new Date(),
    });

    const user = User.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    mockUserRepository.findToken = leftResponse(new BadRequestError('Token not found'));
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const resp = await validataEmailService.execute({
      token: user_token.token,
    });

    expect(resp.isLeft()).toBeTruthy();
    expect(resp.value).toBeInstanceOf(AppError);
  });

  it('should not validate because user not exist', async () => {
    const user_token = new UserToken({
      id: 'any_id',
      token: 'any_token',
      user_id: 'any_user_id',
      type: 'email_verification',
      is_active: true,
      valid_till: new Date(),
      created_at: new Date(),
    });

    mockUserRepository.findToken = rightResponse(user_token);
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(undefined));

    const resp = await validataEmailService.execute({
      token: user_token.token,
    });

    expect(resp.isLeft()).toBeTruthy();
    expect(resp.value).toBeInstanceOf(BadRequestError);
  });

  it('should not validate a user because user has validate', async () => {
    const user_token = new UserToken({
      id: 'any_id',
      token: 'any_token',
      user_id: 'any_user_id',
      type: 'email_verification',
      is_active: true,
      valid_till: new Date(),
      created_at: new Date(),
    });

    const user = User.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    user.setEmailVerified(true);

    mockUserRepository.findToken = rightResponse(user_token);
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const resp = await validataEmailService.execute({
      token: user_token.token,
    });

    expect(resp.isLeft()).toBeTruthy();
    expect(resp.value).toBeInstanceOf(BadRequestError);
  });
});
