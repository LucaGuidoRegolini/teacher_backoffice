import { ParseMailTemplateDTO } from '../../MailTemplateAdapterInterface/dtos/MailTemplateProviderDTO';

interface MailContactInterface {
  email: string;
  name: string;
}

interface SendMailDTO {
  to: MailContactInterface;
  from?: MailContactInterface;
  subject: string;
  templateData: ParseMailTemplateDTO;
}

export { SendMailDTO };
