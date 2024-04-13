import "@testing-library/jest-dom";
import ProfileEditor from "../ProfileEditor";
import { fireEvent, render, screen } from "@testing-library/react";
import { mockUserInfo } from "@/utils/testUtils";

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

const dynamicMockUserInfo = mockUserInfo;

const errorUser: User = {
  uid: -1,
  role: "Student",
};

jest.mock("@/helpers/user-service/api-wrapper", () => {
  return {
    updateUserInfo: (uid: number, updateFields: Record<string, string>) => {
      if (uid == errorUser.uid) {
        throw new Error("Something went wrong");
      } else {
        Object.entries(updateFields).forEach(([key, value]) => {
          dynamicMockUserInfo[key as keyof UserInfo] = value;
        });
        return;
      }
    },
  };
});

describe("Profile Editor", () => {
  beforeEach(() => {
    Object.entries(mockUserInfo).forEach(([key, value]) => {
      // follows exactly the UserInfo schema
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dynamicMockUserInfo[key as keyof UserInfo] = value;
    });
    jest.clearAllMocks();
  });

  it("should not have any error popover on render", () => {
    render(<ProfileEditor userInfo={dynamicMockUserInfo} />);

    const updateButtonWithError = screen.queryByRole("button", {
      hidden: true,
      expanded: true,
    });
    expect(updateButtonWithError).not.toBeInTheDocument();
  });

  it("should not have discard button on render", () => {
    render(<ProfileEditor userInfo={dynamicMockUserInfo} />);

    const discardButton = screen.queryByRole("button", {
      name: "Discard Changes",
    });
    expect(discardButton).not.toBeInTheDocument();
  });

  describe("Given edited name", () => {
    it("should have a discard button", () => {
      render(<ProfileEditor userInfo={dynamicMockUserInfo} />);

      const nameInput = screen.getByLabelText("Name");
      fireEvent.change(nameInput, { target: { value: "My name" } });
      const discardButton = screen.getByRole("button", {
        name: "Discard Changes",
      });
      expect(discardButton).toBeInTheDocument();
    });
    it("should have original name when discard is pressed", () => {
      render(<ProfileEditor userInfo={dynamicMockUserInfo} />);

      const nameInput: HTMLInputElement = screen.getByLabelText("Name");
      fireEvent.change(nameInput, { target: { value: "My name" } });
      const discardButton = screen.getByRole("button", {
        name: "Discard Changes",
      });
      fireEvent.click(discardButton);
      expect(nameInput.value).toBe(mockUserInfo.name);
    });
    it("should have no discard button after update", async () => {
      render(<ProfileEditor userInfo={dynamicMockUserInfo} />);

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
      expect(dynamicMockUserInfo.name).toBe("My name");
    });
    it("should have an error popover if name is empty", async () => {
      render(<ProfileEditor userInfo={dynamicMockUserInfo} />);

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
      render(<ProfileEditor userInfo={dynamicMockUserInfo} />);

      const bioInput = screen.getByLabelText("Bio");
      fireEvent.change(bioInput, { target: { value: "lmao" } });
      const discardButton = screen.getByRole("button", {
        name: "Discard Changes",
      });
      expect(discardButton).toBeInTheDocument();
    });
    it("should have original name when discard is pressed", () => {
      render(<ProfileEditor userInfo={dynamicMockUserInfo} />);

      const bioInput: HTMLInputElement = screen.getByLabelText("Bio");
      fireEvent.change(bioInput, { target: { value: "lmao" } });
      const discardButton = screen.getByRole("button", {
        name: "Discard Changes",
      });
      fireEvent.click(discardButton);
      expect(bioInput.value).toBe(mockUserInfo.bio);
    });
    it("should have no discard button after update", async () => {
      render(<ProfileEditor userInfo={dynamicMockUserInfo} />);

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
      expect(dynamicMockUserInfo.bio).toBe("Hello!");
    });
  });
});
