import { container } from "tsyringe";
import EtherealMailProvider from "./MailProvider/implementations/EtherealMailProvider";
import IMailProvider from "./MailProvider/models/IMailProvider";
import HandlebarsMailTemplateProvider from "./MailTemplateProvider/implementations/HandlebarsMailTemplateProvider";
import IMailTemplateProvider from "./MailTemplateProvider/models/IMailTemplateProvider";
import DiskUploadProvider from "./UploadProvider/implementations/DiskUploadProvider";
import IUploadProvider from "./UploadProvider/models/IUploadProvider";

container.registerSingleton<IUploadProvider>(
  "UploadProvider",
  DiskUploadProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  "MailTemplateProvider",
  HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  "MailProvider",
  container.resolve(EtherealMailProvider),
);
