import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";
import { describe, expect, it, vi } from "vitest";
import api from "../../api/client";

vi.mock("react-router-dom", async (orig) => {
  const actual = await orig();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../../store/auth", () => ({
  clearToken: vi.fn(),
  getActiveRole: vi.fn(() => "USER"),
}));

vi.mock("../../api/client", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Home Page", () => {
  it("shows profile when /api/me succeeds", async () => {
    api.get.mockResolvedValueOnce({
      data: { username: "dinushka", role: "ADMIN" },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const usernameText = await screen.findByText(/dinushka/i)
    expect(usernameText).toBeInTheDocument()
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/Could not load profile/i)
    ).toBeNull()
  });


  it("shows error message when /api/me fails", async () => {
     api.get.mockRejectedValueOnce(new Error('network down'))

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

     const errorBanner = await screen.findByText(/Could not load profile/i)
    expect(errorBanner).toBeInTheDocument()

    // page header should still render
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument()

    // Should NOT render profile JSON, so username shouldn't be there
    expect(
      screen.queryByText(/dinushka/i)
    ).toBeNull()
  });
});
