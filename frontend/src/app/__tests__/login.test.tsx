import "@testing-library/jest-dom";
import LoginPage from "../login/page";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

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

describe("Login Page", () => {
  const [correctEmail, correctPassword] = ["email@email.com", "password123"];
  const [serverDownEmail, serverDownEmailPassword] = ["down@down.com", "down"];
  let hasFetchError = false;
  global.fetch = jest.fn((_, { body: body }: { body: string }) => {
    if (hasFetchError) {
      return Promise.reject("Fetch failed");
    }
    const { email: email, password: password } = JSON.parse(body) as {
      email: string;
      password: string;
    };

    if (email == correctEmail && password == correctPassword) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });
    } else if (
      email == serverDownEmail &&
      password == serverDownEmailPassword
    ) {
      return Promise.resolve({
        ok: false,
        status: 501,
        json: () => Promise.resolve({}),
      });
    } else {
      return Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({}),
      });
    }
  }) as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    hasFetchError = false;
  });

  it("should not have any error popover on render", () => {
    render(<LoginPage />);

    const loginButtonWithError = screen.queryByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(loginButtonWithError).not.toBeInTheDocument();
  });

  it("should have an error popover given empty fields", () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(loginButton);

    const loginButtonWithError = screen.getByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(loginButtonWithError).toBeInTheDocument();
  });

  it("should have an error popover given empty email", () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(loginButton);

    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: correctPassword } });

    const loginButtonWithError = screen.getByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(loginButtonWithError).toBeInTheDocument();
  });

  it("should have an error popover given invalid email", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "bad" } });
    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: correctPassword } });
    const loginButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(loginButton);

    const loginButtonWithError = screen.getByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(loginButtonWithError).toBeInTheDocument();
  });

  it("should have an error popover given empty password", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: correctEmail } });
    const loginButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(loginButton);

    const loginButtonWithError = screen.getByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(loginButtonWithError).toBeInTheDocument();
  });

  it("should have an error popover given invalid credentials", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: correctEmail } });
    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: "Badpassword" } });
    const loginButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(loginButton);

    const loginButtonWithError = await screen.findByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(loginButtonWithError).toBeInTheDocument();
  });

  it("should have not have error popover when server goes down", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: serverDownEmail } });
    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: serverDownEmailPassword } });
    const loginButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(loginButton);

    const loginButtonWithError = await screen.findByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(loginButtonWithError).toBeInTheDocument();
  });

  it("should have not have error popover given correct credentials and redirects", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: correctEmail } });
    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: correctPassword } });
    const loginButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(loginButton);

    const loginButtonWithError = screen.queryByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(loginButtonWithError).not.toBeInTheDocument();
    // redirect occurs
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(0));
  });

  it("should display an error when fetch throws an error", async () => {
    hasFetchError = true;
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: correctEmail } });
    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: correctPassword } });
    const loginButton = screen.getByRole("button", { expanded: false });
    fireEvent.click(loginButton);

    //no router.push("/user") if logging in fail
    expect(mockPush).toHaveBeenCalledTimes(0);
    const loginButtonWithError = await screen.findByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(loginButtonWithError).toBeInTheDocument();
  });
});
