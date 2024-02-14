import { SendMailDTO } from './dtos/MailProviderDTO';

interface MailProviderAdapterInterface {
  sendMail(data: SendMailDTO): Promise<void>;
}

export { MailProviderAdapterInterface };
