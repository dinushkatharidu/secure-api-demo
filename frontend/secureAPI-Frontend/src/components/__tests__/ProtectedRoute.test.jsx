import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { hasRole, isLoggedIn } from "../../store/auth";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../store/auth", () => {
  return {
    isLoggedIn: vi.fn(),
    hasRole: vi.fn(),
  };
});

function DummyProtectedPage() {
  return <div>SECRET DASHBOARD</div>;
}

function SignInPage() {
  return <div>PLEASE SIGN IN</div>;
}

describe("ProtectedRoute", () => {
  it("redirects to /signin if not logged in", () => {
    isLoggedIn.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={["/app"]}>
        <Routes>
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DummyProtectedPage />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/PLEASE SIGN IN/i)).toBeInTheDocument();
    expect(screen.queryByText(/SECRET DASHBOARD/i)).toBeNull();
  });

  it('blocks wrong role', () => {
  isLoggedIn.mockReturnValue(true);
  hasRole.mockReturnValue(false); // logged in BUT missing role

  render(
    <MemoryRouter initialEntries={['/app']}>
      <Routes>
        <Route
          path="/app"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <DummyProtectedPage />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Now assert we got redirected away from SECRET DASHBOARD
  expect(screen.getByText(/PLEASE SIGN IN/i)).toBeInTheDocument();
  expect(screen.queryByText(/SECRET DASHBOARD/i)).toBeNull();
});


  it("renders children when allowed", () => {
    isLoggedIn.mockReturnValue(true);
    hasRole.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <DummyProtectedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/SECRET DASHBOARD/i)).toBeInTheDocument();
  });
});
