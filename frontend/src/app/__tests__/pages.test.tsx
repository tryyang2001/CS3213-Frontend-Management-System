import LandingPage from "../login/page";
import LoginPage from "../login/page";
import SignUpPage from "../sign-up/page";
import UserPage from "../user/page";
import AssignmentPage from "../assignments/[id]/page";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";

import { render, screen } from "@testing-library/react";

const mockUser: User = {
  uid: 9,
  email: "testtest@gmail.com",
  name: "name placeholder",
  major: "major placeholder",
  course: "course placeholder",
  role: "student",
};

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
      user: mockUser, // Inject the mockUser as the user context
      setUserContext: jest.fn(), // Mock setUserContext as a Jest mock function
    }),
  }
})
jest.mock("@tanstack/react-query", () => {
  return {
    __esModule: true,
    useQuery: () => {
      const assignment = AssignmentService.getAssignmentById("1");
      return {
        data: assignment,
        isLoading: assignment.then(() => false),
      };
    },
  };
});

global.fetch = jest.fn(() =>
  Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) })
) as jest.Mock;

describe("Page Snapshot tests", () => {
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

  it("User Page Snapshot test", async () => {
    const { container } = render(<UserPage />);
    const _title = await screen.findByText("Your Account");

    expect(container).toMatchSnapshot();
  });

  it("Loading Assignment Page Snapshot test", () => {
    const id = "1";
    const { container } = render(<AssignmentPage params={{ id: id }} />);
    expect(container).toMatchSnapshot();
  });
});
