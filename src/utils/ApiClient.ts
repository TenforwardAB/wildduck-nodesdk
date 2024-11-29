import fetch, { Response } from "node-fetch";

export class ApiClient {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
  }

  private async request(
    method: string,
    endpoint: string,
    body?: any,
    headers: Record<string, string> = {}
  ): Promise<any> {
    const url = `${this.apiUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(error)}`);
    }
    return response.json();
  }

  public get(endpoint: string, headers?: Record<string, string>) {
    return this.request("GET", endpoint, undefined, headers);
  }

  public post(endpoint: string, body: any, headers?: Record<string, string>) {
    return this.request("POST", endpoint, body, headers);
  }

  public delete(endpoint: string, headers?: Record<string, string>) {
    return this.request("DELETE", endpoint, undefined, headers);
  }
}
