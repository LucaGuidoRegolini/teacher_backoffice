import { HandlebarsMailTemplateProvider } from '../../infra/lib/MailTemplateAdapterInterface/HandlebarsMailTemplatEAdapter';
import { MailTemplateAdapterInterface } from '../../infra/lib/MailTemplateAdapterInterface/MailTemplateAdapter.Interface';
import { MailProviderAdapterInterface } from '../../infra/lib/MailProviderAdapter/MailProviderAdapter.model';

import { EtherealMailProvider } from '@infra/lib/MailProviderAdapter/EtherealMailAdapter';
import { BrevoAdapter } from '../../infra/lib/MailProviderAdapter/BrevoAdapter';
import { mailConfig, mail_driver } from '../../configs/mail';

export function MailTemplateAdapterFactory(): MailTemplateAdapterInterface {
  return HandlebarsMailTemplateProvider.build();
}

type MailProvider = {
  [key in mail_driver]: MailProviderAdapterInterface;
};

export const providers: MailProvider = {
  brevo: BrevoAdapter.build(MailTemplateAdapterFactory()),
  ethereal: EtherealMailProvider.build(MailTemplateAdapterFactory()),
};

export function MailProviderAdapterFactory(): MailProviderAdapterInterface {
  return providers[mailConfig.driver];
}
