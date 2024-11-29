/**
 * This file is licensed under the European Union Public License (EUPL) v1.2.
 * You may only use this work in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed "as is",
 * without any warranty or conditions of any kind.
 *
 * Created on 11/29/24 :: 4:35 PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiAuthenticate.integration.ts is part of the wildduck-nodesdk.
 */

import { Authentication } from "../../src/api/Authentication";
import { ApiClient } from "../../src/utils/ApiClient";
import dotenv from "dotenv";
import * as process from "node:process";

dotenv.config();

describe("Authentication - Integration Tests", () => {
  let client: ApiClient;
  let auth: Authentication;

  beforeEach(() => {
    // Skapa klient med riktiga parametrar
    client = new ApiClient(process.env.API_KEY as string, process.env.API_URL as string);
    auth = new Authentication(client);
  });

  it("should authenticate against the real API", async () => {
    const result = await auth.authenticate(process.env.TEST_USER as string, process.env.TEST_PASSWORD as string);
    expect(result.success).toBe(true);
    expect(result.username).toBe(process.env.TEST_USER as string);
  });
});
