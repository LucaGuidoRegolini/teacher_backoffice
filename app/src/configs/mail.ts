import {
  brave_smtp_host,
  brave_smtp_pass,
  brave_smtp_port,
  brave_smtp_user,
  email_address,
  email_name,
  mail_driver,
} from './global_env';
import { timeInMillisecond } from './timestamp';

export type mail_driver = 'ethereal' | 'brevo';

interface IMailConfig {
  driver: mail_driver;

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export const braveSmtp = {
  host: brave_smtp_host,
  port: brave_smtp_port,
  user: brave_smtp_user,
  pass: brave_smtp_pass,
};

export const mailConfig = {
  driver: mail_driver || 'ethereal',

  defaults: {
    from: {
      email: email_address || 'suporte@devs.io',
      name: email_name || 'Suporte Devs',
    },
  },
} as IMailConfig;

export const token_email_config = {
  length: 20,
  valid_till: timeInMillisecond.hours * 3,
  resend_time: timeInMillisecond.minutes * 1,
};
