import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import EmailInput from "../EmailInput";
import { useTestState } from "@/utils/testUtils";

describe("Email Input", () => {
  // declare email input parameters
  const email = useTestState<string>("");
  const invalid = useTestState<boolean>(false);

  beforeEach(() => {
    // set to default
    email.setValue("");
    invalid.setValue(false);
  });
  describe("Given validation", () => {
    it("should be invalid given emails with no @", () => {
      render(
        <EmailInput
          email={email.value}
          setEmail={email.setValue}
          setIsInvalid={invalid.setValue}
        />
      );
      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, { target: { value: "bad.com" } });
      expect(invalid.value).toBe(true);
    });

    it("should be invalid given emails without a domain", () => {
      render(
        <EmailInput
          email={email.value}
          setEmail={email.setValue}
          setIsInvalid={invalid.setValue}
        />
      );
      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, { target: { value: "bad@adawdad" } });
      expect(invalid.value).toBe(true);
    });

    it("should be valid when empty", () => {
      render(
        <EmailInput
          email={email.value}
          setEmail={email.setValue}
          setIsInvalid={invalid.setValue}
        />
      );
      expect(invalid.value).toBe(false);
      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, { target: { value: "" } });
      expect(invalid.value).toBe(false);
    });

    it("should be valid given normal email", () => {
      render(
        <EmailInput
          email={email.value}
          setEmail={email.setValue}
          setIsInvalid={invalid.setValue}
        />
      );
      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, { target: { value: "email@example.com" } });
      expect(invalid.value).toBe(false);
    });

    it("should be valid given ip address as a domain", () => {
      render(
        <EmailInput
          email={email.value}
          setEmail={email.setValue}
          setIsInvalid={invalid.setValue}
        />
      );
      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, {
        target: { value: "email@[123.123.123.123]" },
      });
      expect(invalid.value).toBe(false);
    });

    it("should be valid given special character emails", () => {
      render(
        <EmailInput
          email={email.value}
          setEmail={email.setValue}
          setIsInvalid={invalid.setValue}
        />
      );
      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, {
        target: {
          value:
            '_______very.”(),:;<>[]”.VERY.”very@\\ "very”.unusual@strange.example.co.jp',
        },
      });
      expect(invalid.value).toBe(false);
    });
  });

  describe("Given no validation", () => {
    it("should be valid given emails without @", () => {
      render(<EmailInput email={email.value} setEmail={email.setValue} />);
      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, { target: { value: "bad.com" } });
      expect(invalid.value).toBe(false);
    });
  });
});
