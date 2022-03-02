interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  templateData: string;
  variables: ITemplateVariables;
}
