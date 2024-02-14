import { RefreshTokenController } from '@modules/user/controllers/refresh_token.service.controller';
import { AuthenticateUserController } from '@modules/user/controllers/authenticate_user.controller';
import { ValidataEmailController } from '@modules/user/controllers/validata_email.controller';
import { ResendEmailController } from '@modules/user/controllers/resend_email.controller';
import { CreateUserController } from '@modules/user/controllers/create_user.controller';
import { UpdateUserController } from '@modules/user/controllers/update_user.controller';
import { AuthenticateUserService } from '@modules/user/services/authentication.service';
import { RefreshTokenService } from '@modules/user/services/refresh_token.service';
import { GetUserController } from '@modules/user/controllers/get_user.controller';
import { ValidataEmailService } from '@modules/user/services/valid_email.service';
import { ResendEmailService } from '@modules/user/services/resend_email.service';
import { CreateUserService } from '@modules/user/services/create_user.service';
import { UpdateUserService } from '@modules/user/services/update_user.service';
import { GetUserService } from '@modules/user/services/get_user.service';
import { userRepositoryFactory } from './repositories.factory';
import { MailProviderAdapterFactory } from './email.factory';

export function createUserServiceFactory(): CreateUserService {
  return CreateUserService.getInstance(
    userRepositoryFactory(),
    MailProviderAdapterFactory(),
  );
}

export function getUserServiceFactory(): GetUserService {
  return GetUserService.getInstance(userRepositoryFactory());
}

export function authenticateUserServiceFactory(): AuthenticateUserService {
  return AuthenticateUserService.getInstance(userRepositoryFactory());
}

export function createUserControllerFactory(): CreateUserController {
  return CreateUserController.getInstance(createUserServiceFactory());
}

export function getUserControllerFactory(): GetUserController {
  return GetUserController.getInstance(getUserServiceFactory());
}

export function authenticateUserControllerFactory(): AuthenticateUserController {
  return AuthenticateUserController.getInstance(authenticateUserServiceFactory());
}

export function refreshTokenServiceFactory(): RefreshTokenService {
  return RefreshTokenService.getInstance(userRepositoryFactory());
}

export function refreshTokenControllerFactory(): RefreshTokenController {
  return RefreshTokenController.getInstance(refreshTokenServiceFactory());
}

export function validataEmailServiceFactory(): ValidataEmailService {
  return ValidataEmailService.getInstance(userRepositoryFactory());
}

export function validataEmailControllerFactory(): ValidataEmailController {
  return ValidataEmailController.getInstance(validataEmailServiceFactory());
}

export function resendEmailServiceFactory(): ResendEmailService {
  return ResendEmailService.getInstance(
    userRepositoryFactory(),
    MailProviderAdapterFactory(),
  );
}

export function resendEmailControllerFactory(): ResendEmailController {
  return ResendEmailController.getInstance(resendEmailServiceFactory());
}

export function updateUserServiceFactory(): UpdateUserService {
  return UpdateUserService.getInstance(userRepositoryFactory());
}

export function updateUserControllerFactory(): UpdateUserController {
  return UpdateUserController.getInstance(updateUserServiceFactory());
}
