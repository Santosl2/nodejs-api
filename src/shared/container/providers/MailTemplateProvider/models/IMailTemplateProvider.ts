import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";

export default interface IMailTemplateProvider {
  parse({ templateData, variables }: IParseMailTemplateDTO): Promise<string>;
}
