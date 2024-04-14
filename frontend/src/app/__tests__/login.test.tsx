import "@testing-library/jest-dom";
import LoginPage from "../login/page";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

const mockToast = {
  title: "mock",
  description: "mock",
  variant: "mock",
};

jest.mock("@/components/ui/use-toast", () => {
  return {
    useToast: () => {
      return {
        toast: ({
          title,
          description,
          variant,
        }: {
          title: string;
          description: string;
          variant: string;
        }) => {
          mockToast.title = title;
          mockToast.description = description;
          mockToast.variant = variant;
          return;
        },
      };
    },
  };
});

jest.mock("@/contexts/user-context", () => {
  return {
    useUserContext: () => {
      return {
        setUserContext: jest.fn(),
      };
    },
  };
});

const [correctEmail, correctPassword] = [
  mockUserInfo.email,
  mockUserInfo.email,
];

jest.mock("@/helpers/user-service/api-wrapper", () => {
  return {
    login: (email: string, password: string) => {
      if (email == correctEmail && password == correctPassword) {
        return mockUser;
      } else {
        throw new Error("Invalid Credentials");
      }
    },
  };
});

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.title = "mock";
    mockToast.description = "mock";
    mockToast.variant = "mock";
  });

  it("should not have any error popover on render", () => {
    render(<LoginPage />);

    expect(mockToast.variant).toBe("mock");
  });

  it("should have an error popover given empty fields", () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(loginButton);

    expect(mockToast.variant).toBe("destructive");
  });

  it("should have an error popover given empty email", () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(loginButton);

    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: correctPassword } });

    expect(mockToast.variant).toBe("destructive");
  });

  it("should have an error popover given invalid email", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "bad" } });
    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: correctPassword } });
    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(loginButton);

    expect(mockToast.variant).toBe("destructive");
  });

  it("should have an error popover given empty password", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: correctEmail } });
    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(loginButton);

    expect(mockToast.variant).toBe("destructive");
  });

  it("should have an error popover given invalid credentials", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: correctEmail } });
    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: "Badpassword" } });
    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(loginButton);

    await waitFor(() => expect(mockToast.variant).toBe("destructive"));
  });

  it("should have not have error popover given correct credentials and redirects", async () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: correctEmail } });
    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: correctPassword } });
    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(loginButton);

    await waitFor(() => expect(mockToast.variant).toBe("success"));
    // redirect occurs
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1));
  });
});
