import { mockStudentUser, mockUserInfo } from "@/utils/testUtils";
import MockAdaptor from "axios-mock-adapter";
import userService from "../user-service/api-wrapper";

describe("User Service API Wrapper tests", () => {
  const mock = new MockAdaptor(userService.api);
  beforeEach(() => {
    mock.reset();
  });

  describe("login", () => {
    const subapi = "/login";
    describe("given wrong parameters", () => {
      test("throws error if unauthorized", async () => {
        mock.onPost(subapi).reply(401);
        await expect(
          userService.login(mockUserInfo.email, mockUserInfo.email)
        ).rejects.toThrow(Error);
      });
      test("throws error if forbidden ", async () => {
        mock.onPost(subapi).reply(403);
        await expect(
          userService.login(mockUserInfo.email, mockUserInfo.email)
        ).rejects.toThrow(Error);
      });
      test("throws error on other codes", async () => {
        mock.onPost(subapi).reply(500, { message: "Internal server error" });
        await expect(
          userService.login(mockUserInfo.email, mockUserInfo.email)
        ).rejects.toThrow(Error);
      });
      test("throws error on accepted codes but no user", async () => {
        mock.onPost(subapi).reply(211);
        await expect(
          userService.login(mockUserInfo.email, mockUserInfo.email)
        ).rejects.toThrow(Error);
      });
    });

    describe("given correct parameters", () => {
      test("returns user", async () => {
        mock.onPost(subapi).reply(200, mockStudentUser);
        const response = await userService.login(
          mockUserInfo.email,
          mockUserInfo.email
        );
        expect(response).toStrictEqual(mockStudentUser);
      });
    });
  });

  describe("register", () => {
    const subapi = "/register";
    describe("given wrong parameters", () => {
      test("throws error on bad requests", async () => {
        mock.onPost(subapi).abortRequest();
        await expect(
          userService.register(mockUserInfo.email, mockUserInfo.email)
        ).rejects.toThrow(Error);
      });
    });

    describe("given correct parameters", () => {
      test("throws no errors", async () => {
        mock.onPost(subapi).reply(200);
        await expect(
          userService.register(mockUserInfo.email, mockUserInfo.email)
        ).resolves.toBeUndefined();
      });
    });
  });

  describe("getUserInfo", () => {
    const subapi = (num: number) => `/getUserInfo?uid=${num}`;
    describe("given wrong parameters", () => {
      test("returns null if not ok but not rejected", async () => {
        mock.onGet(subapi(2)).reply(203);
        const response = await userService.getUserInfo(2);
        expect(response).toBeNull();
      });
      test("throws error if unauthorized", async () => {
        mock.onGet(subapi(2)).reply(401);
        await expect(userService.getUserInfo(2)).rejects.toThrow(Error);
      });
      test("throws error on other rejections", async () => {
        mock.onGet(subapi(2)).abortRequest();
        await expect(userService.getUserInfo(2)).rejects.toThrow(Error);
      });
    });

    describe("given correct parameters", () => {
      test("returns userinfo", async () => {
        mock.onGet(subapi(1)).reply(200, mockUserInfo);
        const response = await userService.getUserInfo(1);

        expect(response).toStrictEqual({
          ...mockUserInfo,
          avatarUrl: undefined,
        });
      });
    });
  });
});
