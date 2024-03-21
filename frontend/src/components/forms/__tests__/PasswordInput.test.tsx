import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import PasswordInput from "../PasswordInput";
import { useTestState } from "@/utils/testUtils";

describe("Password Input", () => {
  const password = useTestState<string>("");
  const invalid = useTestState<boolean>(false);

  beforeEach(() => {
    password.setValue("");
    invalid.setValue(false);
  });

  describe("Given validation", () => {
    it("should be valid given empty values", () => {
      render(
        <PasswordInput
          password={password.value}
          setPassword={password.setValue}
          setIsInvalid={invalid.setValue}
        />
      );
      expect(invalid.value).toBe(false);
      const passwordInput = screen.getByLabelText("Password");
      fireEvent.change(passwordInput, { target: { value: "" } });
      expect(invalid.value).toBe(false);
    });

    it("should be invalid given not enough characters", () => {
      render(
        <PasswordInput
          password={password.value}
          setPassword={password.setValue}
          setIsInvalid={invalid.setValue}
        />
      );
      expect(invalid.value).toBe(false);
      const passwordInput = screen.getByLabelText("Password");
      fireEvent.change(passwordInput, { target: { value: "1234567" } });
      expect(invalid.value).toBe(true);
    });
  });

  describe("Given no validation", () => {
    it("nothing should happen on invalid input", () => {
      render(
        <PasswordInput
          password={password.value}
          setPassword={password.setValue}
        />
      );
      expect(invalid.value).toBe(false);
      const passwordInput = screen.getByLabelText("Password");
      fireEvent.change(passwordInput, { target: { value: "1234567" } });
      expect(invalid.value).toBe(false);
    });

    it("should be invalid given not enough characters", () => {
      render(
        <PasswordInput
          password={password.value}
          setPassword={password.setValue}
          setIsInvalid={invalid.setValue}
        />
      );
      expect(invalid.value).toBe(false);
      const passwordInput = screen.getByLabelText("Password");
      fireEvent.change(passwordInput, { target: { value: "1234567" } });
      expect(invalid.value).toBe(true);
    });
  });
});
