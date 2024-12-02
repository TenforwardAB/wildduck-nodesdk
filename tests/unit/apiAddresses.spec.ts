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
 * Created on 2024-12-02 :: 19:31 BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiAddresses.spec.ts is part of the wildduck-nodesdk.
 */

import { Addresses } from "../../src/api/Addresses";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Addresses Class", () => {
  let mockClient: jest.Mocked<ApiClient>;
  let addresses: Addresses;

  beforeEach(() => {
    mockClient = new ApiClient("fake-api-key", "http://fake-api-url") as jest.Mocked<ApiClient>;
    addresses = new Addresses(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createForwardedAddress", () => {
    it("should create a new forwarded address", async () => {
      const mockResponse = { success: true, id: "address123" };
      mockClient.post.mockResolvedValue(mockResponse);

      const payload = {
        address: "example@domain.com",
        name: "Example Identity",
        targets: ["target@domain.com"],
        allowWildcard: true,
      };

      const response = await addresses.createForwardedAddress(payload);

      expect(mockClient.post).toHaveBeenCalledWith("/addresses/forwarded", payload);
      expect(response).toEqual(mockResponse);
    });
  });

  describe("updateForwardedAddress", () => {
    it("should update a forwarded address", async () => {
      const mockResponse = { success: true };
      mockClient.put.mockResolvedValue(mockResponse);

      const addressId = "address123";
      const payload = {
        name: "Updated Name",
        targets: ["newTarget@domain.com"],
        forwardedDisabled: false,
      };

      const response = await addresses.updateForwardedAddress(addressId, payload);

      expect(mockClient.put).toHaveBeenCalledWith(`/addresses/forwarded/${addressId}`, payload);
      expect(response).toEqual(mockResponse);
    });
  });

  describe("deleteForwardedAddress", () => {
    it("should delete a forwarded address", async () => {
      const mockResponse = { success: true };
      mockClient.delete.mockResolvedValue(mockResponse);

      const addressId = "address123";
      const params = { sess: "sess001", ip: "192.168.0.1" };

      const response = await addresses.deleteForwardedAddress(addressId, params);

      expect(mockClient.delete).toHaveBeenCalledWith(
        `/addresses/forwarded/${addressId}?sess=sess001&ip=192.168.0.1`
      );
      expect(response).toEqual(mockResponse);
    });

    it("should delete a forwarded address without query parameters", async () => {
      const mockResponse = { success: true };
      mockClient.delete.mockResolvedValue(mockResponse);

      const addressId = "address123";

      const response = await addresses.deleteForwardedAddress(addressId);

      expect(mockClient.delete).toHaveBeenCalledWith(`/addresses/forwarded/${addressId}`);
      expect(response).toEqual(mockResponse);
    });
  });

  describe("getForwardedAddressInfo", () => {
    it("should fetch forwarded address information", async () => {
      const mockResponse = {
        success: true,
        id: "address123",
        address: "example@domain.com",
        name: "Example Identity",
        targets: ["target@domain.com"],
        limits: { forwards: 100 },
        autoreply: {
          status: true,
          name: "Auto Reply",
          subject: "Out of Office",
          text: "Plain text message",
          html: "<p>HTML message</p>",
        },
        created: "2024-01-01T00:00:00Z",
        tags: ["important"],
        forwardedDisabled: false,
      };
      mockClient.get.mockResolvedValue(mockResponse);

      const addressId = "address123";
      const params = { sess: "sess001", ip: "192.168.0.1" };

      const response = await addresses.getForwardedAddressInfo(addressId, params);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/addresses/forwarded/${addressId}?sess=sess001&ip=192.168.0.1`
      );
      expect(response).toEqual(mockResponse);
    });

    it("should fetch forwarded address information without query parameters", async () => {
      const mockResponse = {
        success: true,
        id: "address123",
        address: "example@domain.com",
        name: "Example Identity",
        targets: ["target@domain.com"],
        limits: { forwards: 100 },
        autoreply: {
          status: true,
          name: "Auto Reply",
          subject: "Out of Office",
          text: "Plain text message",
          html: "<p>HTML message</p>",
        },
        created: "2024-01-01T00:00:00Z",
        tags: ["important"],
        forwardedDisabled: false,
      };
      mockClient.get.mockResolvedValue(mockResponse);

      const addressId = "address123";

      const response = await addresses.getForwardedAddressInfo(addressId);

      expect(mockClient.get).toHaveBeenCalledWith(`/addresses/forwarded/${addressId}`);
      expect(response).toEqual(mockResponse);
    });
  });

  describe("renameDomainInAddresses", () => {
    it("should rename the domain in addresses", async () => {
      const mockResponse = {
        success: true,
        modifiedAddresses: 5,
        modifiedUsers: 3,
        modifiedDkim: 2,
        modifiedAliases: 1,
      };
      mockClient.put.mockResolvedValue(mockResponse);

      const payload = {
        oldDomain: "old-domain.com",
        newDomain: "new-domain.com",
        sess: "sess001",
        ip: "192.168.0.1",
      };

      const response = await addresses.renameDomainInAddresses(payload);

      expect(mockClient.put).toHaveBeenCalledWith("/addresses/renameDomain", payload);
      expect(response).toEqual(mockResponse);
    });
  });

  describe("resolveAddressInfo", () => {
    it("should resolve address information", async () => {
      const mockResponse = {
        success: true,
        id: "address123",
        address: "example@domain.com",
        name: "Example Identity",
        tags: ["important"],
        limits: { forwards: 100 },
        autoreply: {
          status: true,
          name: "Auto Reply",
          subject: "Out of Office",
          text: "Plain text message",
          html: "<p>HTML message</p>",
        },
      };
      mockClient.get.mockResolvedValue(mockResponse);

      const address = "example@domain.com";
      const params = { allowWildcard: true, sess: "sess001", ip: "192.168.0.1" };

      const response = await addresses.resolveAddressInfo(address, params);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/addresses/resolve/${encodeURIComponent(
          address
        )}?allowWildcard=true&sess=sess001&ip=192.168.0.1`
      );
      expect(response).toEqual(mockResponse);
    });
  });
});
