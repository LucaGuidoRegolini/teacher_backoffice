import { MockUserRepository } from '@tests/doubles/repositories/in-memory.repository';
import { AuthenticateUserService } from '@modules/user/services/authentication.service';
import { User } from '@modules/user/domains/user.domain';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

const mockUserRepository = MockUserRepository.getInstance();

describe('Authentication user service', () => {
  let authenticateUserService: AuthenticateUserService;

  beforeEach(() => {
    authenticateUserService = AuthenticateUserService.getInstance(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authenticateUserService).toBeDefined();
  });

  it('should authenticate a user', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    user.setEmailVerified(true);

    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const userCreated = await authenticateUserService.execute({
      email: user.email,
      password: 'any_password',
    });

    const new_user = userCreated.map((user) => user);

    expect(userCreated.isRight()).toBeTruthy();
    expect(new_user.user.id).toBeDefined();
    expect(new_user.user.name).toBe(user.name);
  });

  it('should not authenticate a user with a email not valid', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const userCreated = await authenticateUserService.execute({
      email: user.email,
      password: 'any_password',
    });

    expect(userCreated.isLeft()).toBeTruthy();
  });

  it('should not authenticate user because user not exist', async () => {
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(undefined));

    const userCreated = await authenticateUserService.execute({
      email: 'any_email',
      password: 'any_password',
    });

    expect(userCreated.isLeft()).toBeTruthy();
  });

  it('should not authenticate user because user password is wrong', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const userCreated = await authenticateUserService.execute({
      email: user.email,
      password: 'wrong_password',
    });

    expect(userCreated.isLeft()).toBeTruthy();
  });
});
