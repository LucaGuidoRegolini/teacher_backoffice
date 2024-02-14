import { ParseMailTemplateDTO } from './dtos/MailTemplateProviderDTO';

interface MailTemplateAdapterInterface {
  parse(data: ParseMailTemplateDTO): Promise<string>;
}

export { MailTemplateAdapterInterface };
