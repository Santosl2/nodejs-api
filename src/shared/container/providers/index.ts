import { container } from "tsyringe";
import DiskUploadProvider from "./UploadProvider/implementations/DiskUploadProvider";
import IUploadProvider from "./UploadProvider/models/IUploadProvider";

container.registerSingleton<IUploadProvider>(
  "UploadProvider",
  DiskUploadProvider,
);
