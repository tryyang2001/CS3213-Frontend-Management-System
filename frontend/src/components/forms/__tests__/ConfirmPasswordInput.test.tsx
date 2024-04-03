import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useTestState } from "@/utils/testUtils";
import ConfirmPasswordInput from "../ConfirmPasswordInput";

describe("Confirm Password Input", () => {
  const newPassword = useTestState<string>("");
  const invalid = useTestState<boolean>(false);

  beforeEach(() => {
    newPassword.setValue("");
    invalid.setValue(false);
  });

  it("should be valid given empty new password", () => {
    render(
      <ConfirmPasswordInput
        password={newPassword.value}
        setIsInvalid={invalid.setValue}
      />
    );
    expect(invalid.value).toBe(false);
    const passwordInput = screen.getByLabelText("Confirm Password");
    fireEvent.change(passwordInput, { target: { value: "" } });
    expect(invalid.value).toBe(false);
  });

  describe("Given some password", () => {
    beforeEach(() => {
      newPassword.setValue("12345678");
    });
    it("should be invalid when empty", () => {
      render(
        <ConfirmPasswordInput
          password={newPassword.value}
          setIsInvalid={invalid.setValue}
        />
      );
      expect(invalid.value).toBe(true);
    });
    it("should be invalid when not match", () => {
      render(
        <ConfirmPasswordInput
          password={newPassword.value}
          setIsInvalid={invalid.setValue}
        />
      );
      const confirmInput = screen.getByLabelText("Confirm Password");
      fireEvent.change(confirmInput, { target: { value: "123456" } });
      expect(invalid.value).toBe(true);
    });
  });

  describe("Given some password and matching input", () => {
    beforeEach(() => {
      newPassword.setValue("12345678");
    });
    it("should be valid", () => {
      render(
        <ConfirmPasswordInput
          password={newPassword.value}
          setIsInvalid={invalid.setValue}
        />
      );
      const confirmInput = screen.getByLabelText("Confirm Password");
      fireEvent.change(confirmInput, { target: { value: newPassword.value } });
      expect(invalid.value).toBe(false);
    });
  });
});
