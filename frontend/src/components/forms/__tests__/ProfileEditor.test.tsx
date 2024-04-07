import "@testing-library/jest-dom";
import ProfileEditor from "../ProfileEditor";
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

describe("Profile Editor", () => {
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
    render(<ProfileEditor userInfo={userInfo} />);

    const updateButtonWithError = screen.queryByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).not.toBeInTheDocument();
  });

  it("should not have discard button on render", () => {
    render(<ProfileEditor userInfo={userInfo} />);

    const discardButton = screen.queryByRole("button", {
      name: "Discard Changes",
    });
    expect(discardButton).not.toBeInTheDocument();
  });

  describe("Given edited name", () => {
    it("should have a discard button", () => {
      render(<ProfileEditor userInfo={userInfo} />);

      const nameInput = screen.getByLabelText("Name");
      fireEvent.change(nameInput, { target: { value: "My name" } });
      const discardButton = screen.getByRole("button", {
        name: "Discard Changes",
      });
      expect(discardButton).toBeInTheDocument();
    });
    it("should have original name when discard is pressed", () => {
      render(<ProfileEditor userInfo={userInfo} />);

      const nameInput: HTMLInputElement = screen.getByLabelText("Name");
      fireEvent.change(nameInput, { target: { value: "My name" } });
      const discardButton = screen.getByRole("button", {
        name: "Discard Changes",
      });
      fireEvent.click(discardButton);
      expect(nameInput.value).toBe(userInfo.name);
    });
    it("should have no discard button after update", async () => {
      render(<ProfileEditor userInfo={userInfo} />);

      const nameInput: HTMLInputElement = screen.getByLabelText("Name");
      fireEvent.change(nameInput, { target: { value: "My name" } });
      const updateButton = screen.getByRole("button", { name: "Save Changes" });
      fireEvent.click(updateButton);

      const updateButtonWithMessage = await screen.findByRole("button", {
        name: "Save Changes",
        hidden: true,
        expanded: true,
      });
      expect(updateButtonWithMessage).toBeInTheDocument();
      const discardButton = screen.queryByRole("button", {
        name: "Discard Changes",
      });
      expect(discardButton).not.toBeInTheDocument();
    });
    it("should have an error popover if name is empty", async () => {
      render(<ProfileEditor userInfo={userInfo} />);

      const nameInput: HTMLInputElement = screen.getByLabelText("Name");
      fireEvent.change(nameInput, { target: { value: "" } });
      const updateButton = screen.getByRole("button", { name: "Save Changes" });
      fireEvent.click(updateButton);

      const updateButtonWithMessage = await screen.findByRole("button", {
        name: "Save Changes",
        hidden: true,
        expanded: true,
      });
      expect(updateButtonWithMessage).toBeInTheDocument();
      const discardButton = screen.getByRole("button", {
        hidden: true,
        name: "Discard Changes",
      });
      expect(discardButton).toBeInTheDocument();
    });
  });
  describe("Given edited bio", () => {
    it("should have a discard button", () => {
      render(<ProfileEditor userInfo={userInfo} />);

      const bioInput = screen.getByLabelText("Bio");
      fireEvent.change(bioInput, { target: { value: "lmao" } });
      const discardButton = screen.getByRole("button", {
        name: "Discard Changes",
      });
      expect(discardButton).toBeInTheDocument();
    });
    it("should have original name when discard is pressed", () => {
      render(<ProfileEditor userInfo={userInfo} />);

      const bioInput: HTMLInputElement = screen.getByLabelText("Bio");
      fireEvent.change(bioInput, { target: { value: "lmao" } });
      const discardButton = screen.getByRole("button", {
        name: "Discard Changes",
      });
      fireEvent.click(discardButton);
      expect(bioInput.value).toBe(userInfo.bio);
    });
    it("should have no discard button after update", async () => {
      render(<ProfileEditor userInfo={userInfo} />);

      const bioInput: HTMLInputElement = screen.getByLabelText("Bio");
      fireEvent.change(bioInput, { target: { value: "Hello!" } });
      const updateButton = screen.getByRole("button", { name: "Save Changes" });
      fireEvent.click(updateButton);

      const updateButtonWithMessage = await screen.findByRole("button", {
        name: "Save Changes",
        hidden: true,
        expanded: true,
      });
      expect(updateButtonWithMessage).toBeInTheDocument();
      const discardButton = screen.queryByRole("button", {
        name: "Discard Changes",
      });
      expect(discardButton).not.toBeInTheDocument();
    });
  });
});
