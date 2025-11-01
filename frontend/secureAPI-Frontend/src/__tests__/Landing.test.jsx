import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import { describe, expect, it } from "vitest";

describe("Landing page", () => {
  it("shows heading + Sign In / Create Account links"),
    () => {
      render(
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      );

      const heading = screen.getByText(/Learn-by-doing authentication/i);
      const signInLink = screen.getByRole("link", { name: /Sign In/i });
      const signUpLink = screen.getByRole("link", { name: /Create Account/i });

      expect(heading).toBeInTheDocument();
      expect(signInLink).toBeInTheDocument();
      expect(signUpLink).toBeInTheDocument();

      expect(signInLink).toHaveAttribute("href", "/src/pages/SignIn.jsx");
      expect(signUpLink).toHaveAttribute("href", "/src/pages/SignUp.jsx");
    };
});
