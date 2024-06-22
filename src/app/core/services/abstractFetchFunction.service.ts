import { Injectable } from '@angular/core';
import { getFunctions, httpsCallable, connectFunctionsEmulator, Functions } from "firebase/functions";

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractFetchFunctionService {

  private functions: Functions;

  constructor() {
    this.functions = getFunctions();
    //connectFunctionsEmulator(this.functions, "127.0.0.1", 5001);
  }

  public async getJson(url: string): Promise<any> {
    const onCallFunction = httpsCallable(this.functions, 'onCallGetJson');
    return onCallFunction({ url });
  }

  public async getText(url: string): Promise<any>{
    const onCallFunction = httpsCallable(this.functions, 'onCallGetText');
    return onCallFunction({ url });
  }
}
