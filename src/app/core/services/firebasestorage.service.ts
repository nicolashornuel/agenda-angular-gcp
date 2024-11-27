import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreStorageService {
  private storage = getStorage();

  constructor() {}

  async uploadToStorage(path: string, file: File) {
    const imagePath = `${path}/${file.name}`;
    const storageRef = ref(this.storage, imagePath);
    await uploadBytesResumable(storageRef, file);
    return await getDownloadURL(storageRef);
  }
}
