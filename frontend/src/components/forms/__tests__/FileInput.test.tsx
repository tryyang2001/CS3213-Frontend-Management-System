import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import FileInput from "../FileInput";
import { useTestState } from "@/utils/testUtils";

describe("File Input", () => {
  const file = useTestState<File | undefined>(undefined);

  beforeEach(() => {
    file.setValue(undefined)
  });

  it("opens modal on button press", () => {
    render(<FileInput onFileChange={file.setValue} />)
    const changeButton = screen.getByRole("button", {name: "Change"})
    fireEvent.click(changeButton)

    const modal = screen.getByRole("dialog")
    expect(modal).toBeInTheDocument()
  })

  describe("Given change button pressed", () => {
    it("closes modal when upload button pressed", async () => {
      render(<FileInput onFileChange={file.setValue} />)
      
      const changeButton = screen.getByRole("button", {name: "Change"})
      fireEvent.click(changeButton)
      const modal = screen.getByRole("dialog")
      
      const uploadButton = screen.getByRole("button", {name: "Upload"})
      fireEvent.click(uploadButton)
      await waitForElementToBeRemoved(screen.queryByRole("dialog"));
      expect(modal).not.toBeInTheDocument()
    })
    it("closes modal when close button is pressed", async () => {
        render(<FileInput onFileChange={file.setValue} />)
        
        const changeButton = screen.getByRole("button", {name: "Change"})
        fireEvent.click(changeButton)
        const modal = screen.getByRole("dialog")
        
        const closeButton = screen.getByRole("button", {name: "Close"})
        fireEvent.click(closeButton)
        await waitForElementToBeRemoved(screen.queryByRole("dialog"));
        expect(modal).not.toBeInTheDocument()
    })
  })
})