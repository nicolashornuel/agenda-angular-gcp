import { Injectable } from '@angular/core';
import { getFunctions, httpsCallable, connectFunctionsEmulator, Functions } from "firebase/functions";

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractCrudFunctionService {

  private functions: Functions;
  private collection: string;

  constructor(collection: string) {
    this.functions = getFunctions();
    //connectFunctionsEmulator(this.functions, "127.0.0.1", 5001);
    this.collection = collection;
  }

  public async getAll(): Promise<any> {
    const onCallFunction = httpsCallable(this.functions, 'onCallGetAll');
    return onCallFunction({ collection: this.collection });
  }
  public async save(document: any): Promise<string> {
    const onCallFunction = httpsCallable(this.functions, 'onCallCreateOne');
    return onCallFunction({ document, collection: this.collection }) as unknown as string;
  }
  public async update(document: any, id: string): Promise<void> {
    const onCallFunction = httpsCallable(this.functions, 'onCallUpdateOne');
    return onCallFunction({ id, document, collection: this.collection }) as unknown as void;
  }
  public async delete(id: string): Promise<void> {
    const onCallFunction = httpsCallable(this.functions, 'onCallDeleteOne');
    return onCallFunction({ id, collection: this.collection }) as unknown as void;
  }

  public async findByField(key: string, value: string | number): Promise<any> {
    const onCallFunction = httpsCallable(this.functions, 'onCallFindByField');
    return onCallFunction({ key, value, collection: this.collection });
  }

  public async findByDateRange(key: string, startAt: number, endAt: number): Promise<any> {
    const onCallFunction = httpsCallable(this.functions, 'onCallFindByDateRange');
    return onCallFunction({ key, startAt, endAt, collection: this.collection });
  }

  public toDate(timestamp: any): Date {
    return new Date(timestamp._seconds * 1000)
  }
}
