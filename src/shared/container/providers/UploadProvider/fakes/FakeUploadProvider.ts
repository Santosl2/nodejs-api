import upload from "@config/upload";
import IUploadProvider from "../models/IUploadProvider";

export default class FakeDiskUploadProvider implements IUploadProvider {
  private uploads: string[] = [];
  public async saveFile(file: string): Promise<string> {
    this.uploads.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.uploads.findIndex(files => files === file);

    this.uploads.splice(findIndex, 1);
  }
}
