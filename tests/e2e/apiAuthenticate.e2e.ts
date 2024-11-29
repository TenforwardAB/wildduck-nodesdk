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
 * Created on 11/29/24 :: 4:49 PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiAuthenticate.e2e.ts is part of the wildduck-nodesdk.
 */

import { WildduckNodeSDK } from "../../src/index";

describe("Authentication E2E Tests", () => {
  const apiKey = "real-api-key";
  const apiUrl = "https://real-wildduck-api.com";
  let api: WildduckNodeSDK;

  beforeAll(() => {
    api = new WildduckNodeSDK(apiKey, apiUrl);
  });

  it("should authenticate a user and return a token", async () => {
    const authResponse = await api.authentication.authenticate(
      "realuser@example.com",
      "realpassword",
      "imap"
    );
    expect(authResponse).toHaveProperty("success", true);
    expect(authResponse).toHaveProperty("token");
  });
});
