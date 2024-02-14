import { MailTemplateAdapterInterface } from '../MailTemplateAdapterInterface/MailTemplateAdapter.Interface';
import { MailProviderAdapterInterface } from './MailProviderAdapter.model';
import { braveSmtp, mailConfig } from '../../../configs/mail';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendMailDTO } from './dtos/MailProviderDTO';
import nodemailer, { Transporter } from 'nodemailer';

export class BrevoAdapter implements MailProviderAdapterInterface {
  private static _instance: BrevoAdapter;
  private _client: Transporter;
  private _mailTemplateProvider: MailTemplateAdapterInterface;

  private constructor(mailTemplateProvider: MailTemplateAdapterInterface) {
    const options: SMTPTransport.Options = {
      host: braveSmtp.host,
      port: Number(braveSmtp.port),
      auth: {
        user: braveSmtp.user,
        pass: braveSmtp.pass,
      },
    };

    this._client = nodemailer.createTransport(options);

    this._mailTemplateProvider = mailTemplateProvider;
  }

  static build(mailTemplateProvider: MailTemplateAdapterInterface): BrevoAdapter {
    if (!this._instance) {
      this._instance = new BrevoAdapter(mailTemplateProvider);
    }

    return this._instance;
  }

  public async sendMail({ to, from, subject, templateData }: SendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    await this._client.sendMail({
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
  }
}
