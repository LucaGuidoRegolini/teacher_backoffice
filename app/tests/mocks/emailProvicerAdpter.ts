import { MailProviderAdapterInterface } from '@infra/lib/MailProviderAdapter/MailProviderAdapter.model';
import { SendMailDTO } from '@infra/lib/MailProviderAdapter/dtos/MailProviderDTO';

export class EmailMockAdpter implements MailProviderAdapterInterface {
  private static _instance: EmailMockAdpter;

  private constructor() {}

  static build(): EmailMockAdpter {
    if (!this._instance) {
      this._instance = new EmailMockAdpter();
    }

    return this._instance;
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: SendMailDTO): Promise<void> {}
}

export const mockEmailProvider = EmailMockAdpter.build();
