import { MockUserRepository } from '@tests/doubles/repositories/in-memory.repository';
import { ResendEmailService } from '@modules/user/services/resend_email.service';
import { mockEmailProvider } from '@tests/mocks/emailProvicerAdpter';
import { UserToken } from '@modules/user/domains/user_token.domain';
import { InvalidTokenError } from '@infra/errors/http_errors';
import { User } from '@modules/user/domains/user.domain';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

const mockUserRepository = MockUserRepository.getInstance();

describe('Resend email service', () => {
  let resendEmailService: ResendEmailService;

  beforeEach(() => {
    resendEmailService = ResendEmailService.getInstance(
      mockUserRepository,
      mockEmailProvider,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resendEmailService).toBeDefined();
  });

  it('should resend a email', async () => {
    const user = new User({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    const sendEmail = jest.spyOn(mockEmailProvider, 'sendMail');
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const userCreated = await resendEmailService.execute(user);

    expect(userCreated.isRight()).toBeTruthy();
    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not resend a email because email send resently', async () => {
    const user = new User({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    const token = UserToken.create({
      type: 'email_verification',
      user_id: user.id,
      valid_till: new Date(),
    });

    mockUserRepository.findTokenWithUserId = rightResponse(token);
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const userCreated = await resendEmailService.execute(user);

    console.log('userCreated', userCreated);

    expect(userCreated.isLeft()).toBeTruthy();
    expect(userCreated.value).toBeInstanceOf(InvalidTokenError);
  });
});
