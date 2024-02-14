import { ClasseRepositoryInterface } from '@modules/classes/repositories/classe.repository.interface';
import { UserRepositoryInterface } from '@modules/user/repositories/user.repository.interface';
import { ClasseRepository } from '@modules/classes/repositories/classe.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';

export function userRepositoryFactory(): UserRepositoryInterface {
  return UserRepository.getInstance();
}

export function classeRepositoryFactory(): ClasseRepositoryInterface {
  return ClasseRepository.getInstance();
}
