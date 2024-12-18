import { Injectable } from '@angular/core';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { SubjectService } from '@shared/abstracts/observable.abstract';

export interface FileStorage {
  name: string;
  link?: string;
  type: 'application/pdf' | 'image/jpeg' | 'image/png' | string;
  file?: File;
  isDirty?: boolean;
}

export class FileStorage {
  constructor(file: File) {
    this.name = file.name;
    this.type = file.type;
    this.file = file;
    this.isDirty = true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreStorageService extends SubjectService<string> {
  private storage = getStorage();

  public async storeFile(path: string, fileStorage: FileStorage): Promise<void> {    
    if (fileStorage && fileStorage.isDirty && fileStorage.file) {
      const { newFilename, link } = await this.store(path, fileStorage.file);
      fileStorage.link = link;
      fileStorage.name = newFilename;
      delete fileStorage.file;
      fileStorage.isDirty = false;
    }
  }

  private generateFileName(file: File): string {
    return `${Date.now()}_${file.name}`;
  }

  private async store(path: string, file: File): Promise<{newFilename: string, link: string}> {
    const newFilename = this.generateFileName(file);
    const imagePath = `${path}/${newFilename}`;
    const storageRef = ref(this.storage, imagePath);
    await uploadBytesResumable(storageRef, file);
    const link = await getDownloadURL(storageRef);
    return { newFilename, link }
  }

  public async delete(path: string, fileName: string): Promise<void> {
    //fileName with path
    const imagePath = `${path}/${fileName}`;
    const storageRef = ref(this.storage, imagePath);
    return await deleteObject(storageRef);
  }
}
