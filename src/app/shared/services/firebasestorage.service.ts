import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { SubjectService } from '@shared/abstracts/observable.abstract';

export interface FileStorage {
  name: string;
  link?: string;
  type: 'application/pdf' | 'image/jpeg' | 'image/png' | string
}

export class FileStorage {
  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreStorageService extends SubjectService<FileStorage> {
  
  private storage = getStorage();

  async store(path: string, file: File) {
    const imagePath = `${path}/${file.name}`;
    const storageRef = ref(this.storage, imagePath);
    await uploadBytesResumable(storageRef, file);
    return await getDownloadURL(storageRef);
  }
}