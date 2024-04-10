import "@testing-library/jest-dom";
import AccountEditor from "../AccountEditor";
import { fireEvent, render, screen } from "@testing-library/react";

const mockPush = jest.fn((str: string) => str);

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    useRouter: () => ({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
      get: jest.fn(),
    }),
    notFound: () => ({}),
  };
});

describe("Account Editor", () => {
  const userInfo: UserInfo = {
    email: "email@email.com",
    name: "Abc",
    bio: "Hello!",
  };
  const errorInfo: UserInfo = {
    email: "bad@email.com",
    name: "Abc",
    bio: "Hello!",
  };
  const errorId = -1;
  let hasFetchError = false;
  global.fetch = jest.fn((_, { body: body }: { body: string }) => {
    if (hasFetchError) {
      return Promise.reject("Fetch failed");
    }
    const { uid: uid, oldPassword: _oldPassword, newPassword: _newPassword } = JSON.parse(body) as {
      uid: number;
      oldPassword: string;
      newPassword: string;
    };

    if (uid === errorId) {
      return Promise.resolve({
        ok: false,
        status: 501,
        json: () => Promise.resolve({}),
      });
    } else {
      return Promise.resolve({
        ok: true,
        status: 201,
        json: () => Promise.resolve({}),
      });
    }
  }) as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    hasFetchError = false;
  });

  it("should not have any error popover on render", () => {
    render(<AccountEditor uid={1} userInfo={userInfo} />);

    const updateButtonWithError = screen.queryByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).not.toBeInTheDocument();
  });

  it("should have an error popover given empty fields", () => {
    render(<AccountEditor uid={1} userInfo={userInfo} />);

    const updateButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(updateButton);

    const updateButtonWithError = screen.getByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).toBeInTheDocument();
  });

  it("should have an error popover given empty password", () => {
    render(<AccountEditor uid={1} userInfo={userInfo} />);

    const confirmInput = screen.getByLabelText("Confirm Password");
    fireEvent.change(confirmInput, { target: { value: "12345678" } });
    const updateButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(updateButton);

    const updateButtonWithError = screen.getByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).toBeInTheDocument();
  });

  it("should have an error popover given empty confirmation", () => {
    render(<AccountEditor uid={1} userInfo={userInfo} />);

    const passwordInput = screen.getByLabelText("oldPassword");
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    const updateButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(updateButton);

    const updateButtonWithError = screen.getByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).toBeInTheDocument();
  });

  it("should have an error popover given confirmation different", () => {
    render(<AccountEditor uid={1} userInfo={userInfo} />);

    const passwordInput = screen.getByLabelText("newPassword");
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    const confirmInput = screen.getByLabelText("Confirm Password");
    fireEvent.change(confirmInput, { target: { value: "different" } });
    const updateButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(updateButton);

    const updateButtonWithError = screen.getByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).toBeInTheDocument();
  });

  it("should have error popover when server goes down", async () => {
    render(<AccountEditor uid={1} userInfo={errorInfo} />);

    const oldPassword = screen.getByLabelText("oldPassword");
    fireEvent.change(oldPassword, { target: { value: "12345678" } });
    const newPassword = screen.getByLabelText("newPassword");
    fireEvent.change(newPassword, { target: { value: "abcdeftghj" } });
    const confirmInput = screen.getByLabelText("Confirm Password");
    fireEvent.change(confirmInput, { target: { value: "12345678" } });
    const updateButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(updateButton);

    const updateButtonWithError = await screen.findByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).toBeInTheDocument();
  });

  it("should display an error when fetch throws an error", async () => {
    hasFetchError = true;
    render(<AccountEditor uid={1} userInfo={userInfo} />);

    const oldPassword = screen.getByLabelText("oldPassword");
    fireEvent.change(oldPassword, { target: { value: "12345678" } });
    const newPassword = screen.getByLabelText("newPassword");
    fireEvent.change(newPassword, { target: { value: "12345678" } });
    const confirmInput = screen.getByLabelText("Confirm Password");
    fireEvent.change(confirmInput, { target: { value: "12345678" } });
    const updateButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(updateButton);

    const updateButtonWithError = await screen.findByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).toBeInTheDocument();
  });

  describe("Given correct fields", () => {
    it("should have not have error popover", async () => {
      render(<AccountEditor uid={1} userInfo={userInfo} />);

      const oldPassword = screen.getByLabelText("oldPassword");
      fireEvent.change(oldPassword, { target: { value: "12345678" } });
      const newPassword = screen.getByLabelText("newPassword");
      fireEvent.change(newPassword, { target: { value: "12345678910" } });
      const confirmInput = screen.getByLabelText("Confirm Password");
      fireEvent.change(confirmInput, { target: { value: "12345678910" } });
      const updateButton = screen.getByRole("button", { expanded: false });
      fireEvent.click(updateButton);

      const updateButtonWithSuccess = await screen.findByRole("button", {
        hidden: true,
        expanded: true,
      });
      expect(updateButtonWithSuccess).toBeInTheDocument();
      const rePassword: HTMLInputElement = screen.getByLabelText("oldPassword");
      expect(rePassword.value).toBe("");
    });
  });
});
