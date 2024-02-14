import { MailTemplateAdapterInterface } from './MailTemplateAdapter.Interface';
import { ParseMailTemplateDTO } from './dtos/MailTemplateProviderDTO';
import handlebars from 'handlebars';
import fs from 'fs';

class HandlebarsMailTemplateProvider implements MailTemplateAdapterInterface {
  private static _instance: HandlebarsMailTemplateProvider;

  private constructor() {}

  static build(): HandlebarsMailTemplateProvider {
    if (!this._instance) {
      this._instance = new HandlebarsMailTemplateProvider();
    }

    return this._instance;
  }

  public async parse({ file, variables }: ParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export { HandlebarsMailTemplateProvider };
