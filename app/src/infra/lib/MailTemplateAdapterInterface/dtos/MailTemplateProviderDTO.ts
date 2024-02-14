interface ITemplateVariables {
  [key: string]: string | number;
}

interface ParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}

export { ParseMailTemplateDTO };
