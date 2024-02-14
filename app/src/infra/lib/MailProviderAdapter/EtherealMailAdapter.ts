import { MailTemplateAdapterInterface } from '../MailTemplateAdapterInterface/MailTemplateAdapter.Interface';
import { MailProviderAdapterInterface } from './MailProviderAdapter.model';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendMailDTO } from './dtos/MailProviderDTO';
import nodemailer, { Transporter } from 'nodemailer';
import { mailConfig } from '../../../configs/mail';

export class EtherealMailProvider implements MailProviderAdapterInterface {
  private static _instance: EtherealMailProvider;
  private _client: Transporter;
  private _mailTemplateProvider: MailTemplateAdapterInterface;

  private constructor(mailTemplateProvider: MailTemplateAdapterInterface) {
    nodemailer.createTestAccount().then((account) => {
      const options: SMTPTransport.Options = {
        host: account.smtp.host,
        port: Number(account.smtp.port),
        auth: {
          user: account.user,
          pass: account.pass,
        },
      };

      this._client = nodemailer.createTransport(options);
    });

    this._mailTemplateProvider = mailTemplateProvider;
  }

  static build(mailTemplateProvider: MailTemplateAdapterInterface): EtherealMailProvider {
    if (!this._instance) {
      this._instance = new EtherealMailProvider(mailTemplateProvider);
    }

    return this._instance;
  }

  public async sendMail({ to, from, subject, templateData }: SendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    const message = await this._client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.email,
        address: to.email,
      },
      subject,
      html: await this._mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
