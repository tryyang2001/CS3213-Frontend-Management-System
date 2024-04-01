import "@testing-library/jest-dom";
import AccountEditor from "../AccountEditor";
import { fireEvent, render, screen } from "@testing-library/react";
import { UserInfo } from "@/components/common/ReadOnlyUserCard";

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

  let hasFetchError = false;
  global.fetch = jest.fn((_, { body: body }: { body: string }) => {
    if (hasFetchError) {
      return Promise.reject("Fetch failed");
    }
    const { email: email, password: _password } = JSON.parse(body) as {
      email: string;
      password: string;
    };

    if (email == errorInfo.email) {
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
    render(<AccountEditor userInfo={userInfo} />);

    const updateButtonWithError = screen.queryByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).not.toBeInTheDocument();
  });

  it("should have an error popover given empty fields", () => {
    render(<AccountEditor userInfo={userInfo} />);

    const updateButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(updateButton);

    const updateButtonWithError = screen.getByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).toBeInTheDocument();
  });

  it("should have an error popover given empty password", () => {
    render(<AccountEditor userInfo={userInfo} />);

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
    render(<AccountEditor userInfo={userInfo} />);

    const passwordInput = screen.getByLabelText("Password");
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
    render(<AccountEditor userInfo={userInfo} />);

    const passwordInput = screen.getByLabelText("Password");
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
    render(<AccountEditor userInfo={errorInfo} />);

    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: "12345678" } });
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
    render(<AccountEditor userInfo={userInfo} />);

    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: "12345678" } });
    const confirmInput = screen.getByLabelText("Confirm Password");
    fireEvent.change(confirmInput, { target: { value: "12345678" } });
    const updateButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(updateButton);

    expect(fetch).toHaveBeenCalled();
    const updateButtonWithError = await screen.findByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).toBeInTheDocument();
  });

  describe("Given correct fields", () => {
    it("should have not have error popover", async () => {
      render(<AccountEditor userInfo={userInfo} />);

      const password : HTMLInputElement = screen.getByLabelText("Password");
      fireEvent.change(password, { target: { value: "12345678" } });
      const confirmInput = screen.getByLabelText("Confirm Password");
      fireEvent.change(confirmInput, { target: { value: "12345678" } });
      const updateButton = screen.getByRole("button", { expanded: false });
      fireEvent.click(updateButton);

      const updateButtonWithSuccess = await screen.findByRole("button", {
        hidden: true,
        expanded: true,
      });
      expect(updateButtonWithSuccess).toBeInTheDocument();
      const rePassword : HTMLInputElement = screen.getByLabelText("Password");
      expect(rePassword.value).toBe("")
    });
  });
});
