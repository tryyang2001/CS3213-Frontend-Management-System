import LandingPage from "../login/page";
import LoginPage from "../login/page";
import SignUpPage from "../sign-up/page";
import UserPage from "../user/page";
import AssignmentPage from "../assignments/[id]/page";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";

import { render } from "@testing-library/react";

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

jest.mock("@tanstack/react-query", () => {
  return {
    __esModule: true,
    useQuery: () => {
      const assignment = AssignmentService.getAssignmentById({
        assignmentId: "1",
      });
      return {
        data: assignment,
        isLoading: assignment.then(() => false),
      };
    },
  };
});

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

  it("User Page Snapshot test", () => {
    const { container } = render(<UserPage />);
    expect(container).toMatchSnapshot();
  });

  it("Loading Assignment Page Snapshot test", () => {
    const id = "1";
    const { container } = render(<AssignmentPage params={{ id: id }} />);
    expect(container).toMatchSnapshot();
  });
});
