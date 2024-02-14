import { UserRepositoryInterface } from '@modules/user/repositories/user.repository.interface';
import { UserRepository } from '@modules/user/repositories/user.repository';

export function userRepositoryFactory(): UserRepositoryInterface {
  return UserRepository.getInstance();
}
