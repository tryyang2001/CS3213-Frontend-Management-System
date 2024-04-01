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

  it("should become a text input when eye is pressed", () => {
    render(
      <PasswordInput
        password={password.value}
        setPassword={password.setValue}
        setIsInvalid={invalid.setValue}
      />
    );

    const eye = screen.getByRole("button", { name: "" });
    fireEvent.click(eye);
    const visibleInput: HTMLInputElement = screen.getByLabelText("Password");
    expect(visibleInput.type).toBe("text");
  });
  it("should become a password input when eye is pressed twice", () => {
    render(
      <PasswordInput
        password={password.value}
        setPassword={password.setValue}
        setIsInvalid={invalid.setValue}
      />
    );

    const eye = screen.getByRole("button", { name: "" });
    fireEvent.click(eye);
    const passwordInput: HTMLInputElement = screen.getByLabelText("Password");
    expect(passwordInput.type).toBe("text");
    fireEvent.click(eye);
    expect(passwordInput.type).toBe("password");
  });
});
