import { HttpClient } from "./utils/ApiClient";
import { Authentication } from "./api/Authentication";

export class WildDuckAPI {
  private client: HttpClient;
  public authentication: Authentication;

  constructor(apiKey: string, apiUrl: string) {
    this.client = new HttpClient(apiKey, apiUrl);
    this.authentication = new Authentication(this.client);
  }
}
