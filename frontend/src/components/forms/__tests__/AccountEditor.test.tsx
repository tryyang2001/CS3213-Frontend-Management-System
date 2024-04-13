import "@testing-library/jest-dom";
import AccountEditor from "../AccountEditor";
import { fireEvent, render, screen } from "@testing-library/react";
import { mockUser, mockUserInfo } from "@/utils/testUtils";

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

jest.mock("@/helpers/user-service/api-wrapper", () => {
  return {
    updateUserPassword: (
      uid: number,
      oldPassword: string,
      _newPassword: string
    ) => {
      if (uid == mockUser.uid && oldPassword == mockUserInfo.email) {
        return;
      } else {
        throw new Error("Invalid Credentials");
      }
    },
  };
});

describe("Account Editor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not have any error popover on render", () => {
    render(<AccountEditor uid={1} userInfo={mockUserInfo} />);

    const updateButtonWithError = screen.queryByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).not.toBeInTheDocument();
  });

  it("should have an error popover given empty fields", () => {
    render(<AccountEditor uid={1} userInfo={mockUserInfo} />);

    const updateButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(updateButton);

    const updateButtonWithError = screen.getByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).toBeInTheDocument();
  });

  it("should have an error popover given empty password", () => {
    render(<AccountEditor uid={1} userInfo={mockUserInfo} />);

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
    render(<AccountEditor uid={1} userInfo={mockUserInfo} />);

    const passwordInput = screen.getByLabelText("Old Password");
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
    render(<AccountEditor uid={1} userInfo={mockUserInfo} />);

    const passwordInput = screen.getByLabelText("New Password");
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

  describe("Given correct fields", () => {
    it("should have not have error popover", async () => {
      render(<AccountEditor uid={1} userInfo={mockUserInfo} />);

      const oldPassword = screen.getByLabelText("Old Password");
      fireEvent.change(oldPassword, { target: { value: "12345678" } });
      const newPassword = screen.getByLabelText("New Password");
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
      const rePassword: HTMLInputElement =
        screen.getByLabelText("Old Password");
      expect(rePassword.value).toBe("");
    });
  });
});
