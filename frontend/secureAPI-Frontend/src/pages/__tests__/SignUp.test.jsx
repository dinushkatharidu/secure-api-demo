import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SignUp from '../SignUp'

// mock useNavigate to avoid actual navigation
vi.mock('react-router-dom', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

// mock api client
vi.mock('../../api/client', () => ({
  default: {
    post: vi.fn(),
  },
}))

import api from '../../api/client'
import { describe, expect, it, vi } from 'vitest'

describe('SignUp page', () => {
  it('shows validation errors for empty/mismatch password', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    )

    // click Sign Up with empty form
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }))

    // "Fill all fields."
    expect(
      screen.getByText(/Fill all fields/i)
    ).toBeInTheDocument()

    // now fill form with mismatch passwords
    fireEvent.change(screen.getByPlaceholderText(/choose a username/i), {
      target: { name: 'username', value: 'alice' },
    })
    fireEvent.change(screen.getByPlaceholderText(/at least 6 characters/i), {
      target: { name: 'password', value: '123456' },
    })
    fireEvent.change(screen.getByPlaceholderText(/repeat your password/i), {
      target: { name: 'confirm', value: 'abcdef' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }))

    expect(
      screen.getByText(/Passwords do not match/i)
    ).toBeInTheDocument()

    // still should not have called backend
    expect(api.post).not.toHaveBeenCalled()
  })

  it('handles backend 409 "Username already exists."', async () => {
    api.post.mockRejectedValueOnce({
      response: { status: 409 },
    })

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    )

    // fill valid form
    fireEvent.change(screen.getByPlaceholderText(/choose a username/i), {
      target: { name: 'username', value: 'dinushka' },
    })
    fireEvent.change(screen.getByPlaceholderText(/at least 6 characters/i), {
      target: { name: 'password', value: 'abcdef' },
    })
    fireEvent.change(screen.getByPlaceholderText(/repeat your password/i), {
      target: { name: 'confirm', value: 'abcdef' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }))

    // wait for UI to update with conflict message
    const errBox = await screen.findByText(/Username already exists/i)
    expect(errBox).toBeInTheDocument()

    // check API payload
    expect(api.post).toHaveBeenCalledWith('/api/auth/signup', {
      username: 'dinushka',
      password: 'abcdef',
      role: 'USER', // default role in initial state
    })
  })

  it('shows success banner after successful signup', async () => {
    api.post.mockResolvedValueOnce({
      data: 'OK',
    })

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/choose a username/i), {
      target: { name: 'username', value: 'newuser' },
    })
    fireEvent.change(screen.getByPlaceholderText(/at least 6 characters/i), {
      target: { name: 'password', value: 'strongpw' },
    })
    fireEvent.change(screen.getByPlaceholderText(/repeat your password/i), {
      target: { name: 'confirm', value: 'strongpw' },
    })

    // grab the SELECT without requiring an accessible name
    const roleSelect = screen.getByRole('combobox')
    fireEvent.change(roleSelect, {
      target: { name: 'role', value: 'ADMIN' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }))

    // should show success banner
    const okBox = await screen.findByText(/Account created! You can sign in now/i)
    expect(okBox).toBeInTheDocument()

    // API should include chosen role ADMIN
    expect(api.post).toHaveBeenCalledWith('/api/auth/signup', {
      username: 'newuser',
      password: 'strongpw',
      role: 'ADMIN',
    })
  })
})
