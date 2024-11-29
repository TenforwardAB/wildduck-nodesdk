import { ApiClient } from "../utils/ApiClient";

export class Authentication {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  async preAuth(username: string, scope: string, sess?: string, ip?: string) {
    const payload = { username, scope, sess, ip };
    return this.client.post("/preauth", payload);
  }

  async authenticate(
    username: string,
    password: string,
    scope?: string,
    protocol?: string,
    appId?: string,
    token?: boolean,
    sess?: string,
    ip?: string
  ) {
    const payload = { username, password, scope, protocol, appId, token, sess, ip };
    return this.client.post("/authenticate", payload);
  }

  async invalidateToken() {
    return this.client.delete("/authenticate");
  }

  async listAuthEvents(
    user: string,
    params: {
      action?: string;
      limit?: number;
      next?: string;
      previous?: string;
      page?: number;
      filterip?: string;
      sess?: string;
      ip?: string;
    } = {},
    useOwnToken = false
  ) {
    const resolvedUser = useOwnToken ? "me" : user;
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const endpoint = `/users/${resolvedUser}/authlog${query ? `?${query}` : ""}`;
    return this.client.get(endpoint);
  }

  async getAuthEvent(
    user: string,
    event: string,
    params: { sess?: string; ip?: string } = {},
    useOwnToken = false
  ) {
    const resolvedUser = useOwnToken ? "me" : user;
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const endpoint = `/users/${resolvedUser}/authlog/${event}${query ? `?${query}` : ""}`;
    return this.client.get(endpoint);
  }
}
