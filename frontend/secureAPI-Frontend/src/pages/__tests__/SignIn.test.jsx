import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignIn from "../SignIn";

// Mock navigate, location.state, and api + auth utils
vi.mock("react-router-dom", async (orig) => {
  const actual = await orig();
  return {
    ...actual,
    useNavigate: () => vi.fn(), // capture navigation
    useLocation: () => ({ state: { from: { pathname: "/app" } } }),
  };
});

vi.mock("../../api/client", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("../../store/auth", () => ({
  setToken: vi.fn(),
  setActiveUser: vi.fn(),
  setActiveRole: vi.fn(),
}));

import api from "../../api/client";
import { setToken, setActiveUser, setActiveRole } from "../../store/auth";
import { describe, expect, it, vi } from "vitest";

describe("SignIn page", () => {
  it("validates empty form before calling API", async () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(button);

    // should show validation error
    expect(
      screen.getByText(/Please enter username and password/i)
    ).toBeInTheDocument();

    // should NOT hit backend
    expect(api.post).not.toHaveBeenCalled();
  });

  it("handles successful login", async () => {
    // fake backend response
    api.post.mockResolvedValueOnce({
      data: { token: "test-jwt-token" },
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    // Fill username
    fireEvent.change(screen.getByPlaceholderText(/your username/i), {
      target: { name: "username", value: "alice" },
    });

    // Fill password
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { name: "password", value: "pw123456" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    // Wait for async logic to finish
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/auth/signin", {
        username: "alice",
        password: "pw123456",
      });
    });

    // Token should be stored
    expect(setToken).toHaveBeenCalledWith("test-jwt-token");
    expect(setActiveUser).toHaveBeenCalledWith("alice");

    // front-end decides role from localStorage; we just check setActiveRole called
    expect(setActiveRole).toHaveBeenCalled();
  });

  it("handles 401 bad credentials", async () => {
    api.post.mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/your username/i), {
      target: { name: "username", value: "bob" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { name: "password", value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Bad credentials/i)).toBeInTheDocument();
    });
  });
});
