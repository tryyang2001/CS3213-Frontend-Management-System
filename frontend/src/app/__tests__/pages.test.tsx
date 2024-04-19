import LandingPage from "../login/page";
import LoginPage from "../login/page";
import SignUpPage from "../sign-up/page";
import UserPage from "../user/page";
import AssignmentPage from "../assignments/[id]/page";

import { render, screen } from "@testing-library/react";
import {
  mockAssignment,
  mockStudentUser,
  mockUserInfo,
} from "@/utils/testUtils";
import * as query from "@tanstack/react-query";
import userService from "@/helpers/user-service/api-wrapper";
// Place all page's Snapshot tests here

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    useRouter: () => ({
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
      get: jest.fn(),
    }),
    notFound: () => ({}),
  };
});

jest.mock("@/contexts/user-context", () => {
  return {
    __esModule: true,
    useUserContext: () => ({
      user: mockStudentUser, // Inject the mockUser as the user context
      setUser: jest.fn(), // Mock setUserContext as a Jest mock function
    }),
  };
});

jest.mock("@tanstack/react-query");
const mockQuery = query as jest.Mocked<typeof query>;

describe("Page Snapshot tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Landing Page Snapshot test", () => {
    const { container } = render(<LandingPage />);
    expect(container).toMatchSnapshot();
  });

  it("Login Snapshot test", () => {
    const { container } = render(<LoginPage />);
    expect(container).toMatchSnapshot();
  });

  it("Sign-up Snapshot test", () => {
    const { container } = render(<SignUpPage />);
    expect(container).toMatchSnapshot();
  });

  it("Loading User Page Snapshot test", () => {
    const { container } = render(<UserPage />);
    expect(container).toMatchSnapshot();
  });

  it("User Page Snapshot test", async () => {
    jest.spyOn(userService, "getUserInfo").mockResolvedValue(mockUserInfo);
    const { container } = render(<UserPage />);
    const _title = await screen.findByText("Your Account");
    expect(container).toMatchSnapshot();
  });

  it("Loading Assignment Page Snapshot test", () => {
    const id = "1";
    mockQuery.useQuery.mockReturnValue({
      data: mockAssignment,
      isFetched: false,
    } as never);

    const { container } = render(<AssignmentPage params={{ id: id }} />);
    expect(container).toMatchSnapshot();
  });
  it("Student Assignment Page Snapshot test", async () => {
    const id = "1";
    mockQuery.useQuery.mockReturnValue({
      data: mockAssignment,
      isFetched: true,
    } as never);
    jest.spyOn(userService, "getUserInfo").mockResolvedValue(mockUserInfo);

    const { container } = render(<AssignmentPage params={{ id: id }} />);
    const _title = await screen.findByText(mockAssignment.title);
    expect(container).toMatchSnapshot();
  });
});
