import { MockUserRepository } from '@tests/doubles/repositories/in-memory.repository';
import { UpdateUserService } from '@modules/user/services/update_user.service';
import { User } from '@modules/user/domains/user.domain';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

const mockUserRepository = MockUserRepository.getInstance();

describe('Update user service', () => {
  let updateUserService: UpdateUserService;

  beforeEach(() => {
    updateUserService = UpdateUserService.getInstance(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(updateUserService).toBeDefined();
  });

  it('should update a user', async () => {
    const user = new User({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      id: 'any_user_id',
      email_verified: true,
    });

    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const userCreated = await updateUserService.execute({
      name: 'new_name',
      user_id: 'any_user_id',
    });

    console.log(userCreated);

    const new_user = userCreated.map((user) => user);

    expect(userCreated.isRight()).toBeTruthy();
    expect(new_user.id).toBeDefined();
    expect(new_user.name).toBe('new_name');
  });
});
