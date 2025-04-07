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
 * Copyright (c) 2024- Tenforward AB. All rights reserved.
 *
 * Created on 4/7/25 :: 3:32PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiFilters.spec.ts is part of the wildduck-nodesdk project.
 */

import { Filters } from "../../src/api/Filters";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Filters Class", () => {
    let filters: Filters;
    let mockClient: jest.Mocked<ApiClient>;

    beforeEach(() => {
        mockClient = new ApiClient("test-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        filters = new Filters(mockClient);
    });

    describe("listAllFilters", () => {
        it("should call the API with the correct endpoint when no parameters are provided", async () => {
            const mockResponse = {
                success: true,
                total: 0,
                page: 1,
                previousCursor: false,
                nextCursor: false,
                results: [],
            };
            mockClient.get.mockResolvedValue(mockResponse);

            await filters.listAllFilters();

            expect(mockClient.get).toHaveBeenCalledWith("/filters");
        });

        it("should include query parameters in the API call", async () => {
            const params = { metaData: true, limit: 50, page: 2 };
            const expectedQuery = "?metaData=true&limit=50&page=2";
            const mockResponse = {
                success: true,
                total: 100,
                page: 2,
                previousCursor: "prev123",
                nextCursor: "next123",
                results: [],
            };
            mockClient.get.mockResolvedValue(mockResponse);

            await filters.listAllFilters(params);

            expect(mockClient.get).toHaveBeenCalledWith(`/filters${expectedQuery}`);
        });

        it("should return the API response as-is", async () => {
            const mockResponse = {
                success: true,
                total: 10,
                page: 1,
                previousCursor: false,
                nextCursor: "cursor123",
                results: [
                    {
                        id: "filter1",
                        user: "user1",
                        name: "Filter One",
                        created: "2023-01-01T00:00:00Z",
                        query: {},
                        action: {},
                        disabled: false,
                    },
                ],
            };
            mockClient.get.mockResolvedValue(mockResponse);

            const response = await filters.listAllFilters();

            expect(response).toEqual(mockResponse);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.get.mockRejectedValue(new Error("API error"));

            await expect(filters.listAllFilters()).rejects.toThrow("API error");
        });
    });

    describe("listUserFilters", () => {
        it("should call the API with the correct endpoint when no parameters are provided", async () => {
            const mockResponse = {
                success: true,
                limits: { allowed: 10, used: 2 },
                results: [],
            };
            mockClient.get.mockResolvedValue(mockResponse);

            await filters.listUserFilters("12345");

            expect(mockClient.get).toHaveBeenCalledWith("/users/12345/filters");
        });

        it("should include query parameters in the API call", async () => {
            const params = { metaData: true, sess: "sess123", ip: "192.168.0.1" };
            const expectedQuery = "?metaData=true&sess=sess123&ip=192.168.0.1";
            const mockResponse = {
                success: true,
                limits: { allowed: 10, used: 2 },
                results: [],
            };
            mockClient.get.mockResolvedValue(mockResponse);

            await filters.listUserFilters("12345", params);

            expect(mockClient.get).toHaveBeenCalledWith(`/users/12345/filters${expectedQuery}`);
        });

        it("should return the API response as-is", async () => {
            const mockResponse = {
                success: true,
                limits: { allowed: 10, used: 5 },
                results: [
                    {
                        id: "filter1",
                        name: "Test Filter",
                        created: "2023-01-01T00:00:00Z",
                        query: {},
                        action: {},
                        disabled: false,
                    },
                ],
            };
            mockClient.get.mockResolvedValue(mockResponse);

            const response = await filters.listUserFilters("12345");

            expect(response).toEqual(mockResponse);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.get.mockRejectedValue(new Error("API error"));

            await expect(filters.listUserFilters("12345")).rejects.toThrow("API error");
        });
    });

    describe("createFilter", () => {
        it("should call the API with the correct payload", async () => {
            const mockResponse = {
                success: true,
                filter: {
                    id: "filter123",
                    name: "Important Filter",
                    created: "2023-01-01T00:00:00Z",
                    query: {},
                    action: {},
                    disabled: false,
                },
            };
            mockClient.post.mockResolvedValue(mockResponse);

            const payload = {
                name: "Important Filter",
                query: { from: "example@example.com" },
                action: { seen: true, mailbox: "inbox" },
                disabled: false,
                metaData: { priority: "high" },
                sess: "sess123",
                ip: "192.168.0.1",
            };

            const response = await filters.createFilter("12345", payload);

            expect(mockClient.post).toHaveBeenCalledWith("/users/12345/filters", payload);
            expect(response).toEqual(mockResponse);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.post.mockRejectedValue(new Error("API error"));
            const payload = { name: "Test Filter", query: {}, action: {}, disabled: false };

            await expect(filters.createFilter("12345", payload)).rejects.toThrow("API error");
        });
    });

    describe("getFilterInformation", () => {
        it("should call the API with the correct endpoint when no parameters are provided", async () => {
            const mockResponse = {
                success: true,
                id: "filter123",
                name: "Test Filter",
                created: "2023-01-01T00:00:00Z",
                query: {},
                action: {},
                disabled: false,
                metaData: {},
            };
            mockClient.get.mockResolvedValue(mockResponse);

            await filters.getFilterInformation("12345", "filter123");

            expect(mockClient.get).toHaveBeenCalledWith("/users/12345/filters/filter123");
        });

        it("should include query parameters if provided", async () => {
            const params = { sess: "sess123", ip: "192.168.0.1" };
            const expectedQuery = "?sess=sess123&ip=192.168.0.1";
            const mockResponse = {
                success: true,
                id: "filter123",
                name: "Test Filter",
                created: "2023-01-01T00:00:00Z",
                query: {},
                action: {},
                disabled: false,
                metaData: {},
            };
            mockClient.get.mockResolvedValue(mockResponse);

            await filters.getFilterInformation("12345", "filter123", params);

            expect(mockClient.get).toHaveBeenCalledWith(`/users/12345/filters/filter123${expectedQuery}`);
        });

        it("should return the API response as-is", async () => {
            const mockResponse = {
                success: true,
                id: "filter123",
                name: "Test Filter",
                created: "2023-01-01T00:00:00Z",
                query: {},
                action: {},
                disabled: false,
                metaData: {},
            };
            mockClient.get.mockResolvedValue(mockResponse);

            const response = await filters.getFilterInformation("12345", "filter123");

            expect(response).toEqual(mockResponse);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.get.mockRejectedValue(new Error("API error"));

            await expect(filters.getFilterInformation("12345", "filter123")).rejects.toThrow("API error");
        });
    });

    describe("deleteFilter", () => {
        it("should call the API with the correct endpoint when no parameters are provided", async () => {
            const mockResponse = { success: true };
            mockClient.delete.mockResolvedValue(mockResponse);

            await filters.deleteFilter("12345", "filter123");

            expect(mockClient.delete).toHaveBeenCalledWith("/users/12345/filters/filter123");
        });

        it("should include query parameters if provided", async () => {
            const params = { sess: "sess123", ip: "192.168.0.1" };
            const expectedQuery = "?sess=sess123&ip=192.168.0.1";
            const mockResponse = { success: true };
            mockClient.delete.mockResolvedValue(mockResponse);

            await filters.deleteFilter("12345", "filter123", params);

            expect(mockClient.delete).toHaveBeenCalledWith(`/users/12345/filters/filter123${expectedQuery}`);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.delete.mockRejectedValue(new Error("API error"));

            await expect(filters.deleteFilter("12345", "filter123")).rejects.toThrow("API error");
        });
    });

    describe("updateFilter", () => {
        it("should call the API with the correct payload", async () => {
            const mockResponse = { success: true };
            mockClient.put.mockResolvedValue(mockResponse);

            const payload = {
                name: "Updated Filter",
                query: { subject: "New Subject" },
                action: { seen: true, mailbox: "inbox" },
                disabled: false,
                metaData: { updated: true },
                sess: "sess123",
                ip: "192.168.0.1",
            };

            const response = await filters.updateFilter("12345", "filter123", payload);

            expect(mockClient.put).toHaveBeenCalledWith("/users/12345/filters/filter123", payload);
            expect(response).toEqual(mockResponse);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.put.mockRejectedValue(new Error("API error"));

            const payload = { name: "Updated Filter", query: {}, action: { seen: true }, disabled: false };

            await expect(filters.updateFilter("12345", "filter123", payload)).rejects.toThrow("API error");
        });
    });
});
