import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { toast } from 'sonner'

// Components
import { UsernameForm } from '../components/UsernameForm'
import { NameForm } from '../components/NameForm'
import { EmailForm } from '../components/EmailForm'
import { PasswordForm } from '../components/PasswordForm'
import { DeleteAccountDialog } from '../components/DeleteAccountDialog'
import { AccountSection } from '../components/AccountSection'

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/lib/auth-client', () => ({
  authClient: {
    updateUser: jest.fn(),
    changeEmail: jest.fn(),
    changePassword: jest.fn(),
    deleteUser: jest.fn(),
  },
}))

// Tests
describe('User Components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AccountSection', () => {
    it('renders with title and description', () => {
      render(
        <AccountSection title="Test Title" description="Test Description">
          <div data-testid="child-content">Child Content</div>
        </AccountSection>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByTestId('child-content')).toBeInTheDocument()
    })
  })

  describe('UsernameForm', () => {
    const mockUpdateUser = jest.fn()
    
    beforeEach(() => {
      require('@/lib/auth-client').authClient.updateUser = mockUpdateUser
    })

    it('renders with initial username', () => {
      render(<UsernameForm username="testuser" />)
      
      expect(screen.getByLabelText('Username')).toHaveValue('testuser')
    })

    it('handles form submission', async () => {
      mockUpdateUser.mockResolvedValue({ error: null })
      
      render(<UsernameForm username="testuser" />)
      
      const input = screen.getByLabelText('Username')
      const submitButton = screen.getByText('Save')
      
      fireEvent.change(input, { target: { value: 'newusername' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith({ username: 'newusername' })
        expect(toast.success).toHaveBeenCalledWith('Username updated successfully')
      })
    })

    it('handles error on submission', async () => {
      mockUpdateUser.mockResolvedValue({ error: { message: 'Update failed' } })
      
      render(<UsernameForm username="testuser" />)
      
      const input = screen.getByLabelText('Username')
      const submitButton = screen.getByText('Save')
      
      fireEvent.change(input, { target: { value: 'newusername' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith({ username: 'newusername' })
        expect(toast.error).toHaveBeenCalledWith('Update failed')
      })
    })
  })

  describe('NameForm', () => {
    const mockUpdateUser = jest.fn()
    
    beforeEach(() => {
      require('@/lib/auth-client').authClient.updateUser = mockUpdateUser
    })

    it('renders with initial name', () => {
      render(<NameForm name="Test User" />)
      
      expect(screen.getByLabelText('Name')).toHaveValue('Test User')
    })

    it('handles form submission', async () => {
      mockUpdateUser.mockResolvedValue({ error: null })
      
      render(<NameForm name="Test User" />)
      
      const input = screen.getByLabelText('Name')
      const submitButton = screen.getByText('Save')
      
      fireEvent.change(input, { target: { value: 'New Name' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith({ name: 'New Name' })
        expect(toast.success).toHaveBeenCalledWith('Name updated successfully')
      })
    })
  })

  describe('EmailForm', () => {
    const mockChangeEmail = jest.fn()
    
    beforeEach(() => {
      require('@/lib/auth-client').authClient.changeEmail = mockChangeEmail
    })

    it('renders with initial email', () => {
      render(<EmailForm email="test@example.com" />)
      
      expect(screen.getByLabelText('Email')).toHaveValue('test@example.com')
    })

    it('handles form submission', async () => {
      mockChangeEmail.mockResolvedValue({ error: null })
      
      render(<EmailForm email="test@example.com" />)
      
      const input = screen.getByLabelText('Email')
      const submitButton = screen.getByText('Save')
      
      fireEvent.change(input, { target: { value: 'new@example.com' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockChangeEmail).toHaveBeenCalledWith({ newEmail: 'new@example.com' })
        expect(toast.success).toHaveBeenCalledWith('Email updated successfully')
      })
    })
  })

  describe('PasswordForm', () => {
    const mockChangePassword = jest.fn()
    
    beforeEach(() => {
      require('@/lib/auth-client').authClient.changePassword = mockChangePassword
    })

    it('renders password fields', () => {
      render(<PasswordForm />)
      
      expect(screen.getByLabelText('Current Password')).toBeInTheDocument()
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    })

    it('handles form submission', async () => {
      mockChangePassword.mockResolvedValue({ error: null })
      
      render(<PasswordForm />)
      
      const currentPassword = screen.getByLabelText('Current Password')
      const newPassword = screen.getByLabelText('New Password')
      const submitButton = screen.getByText('Save')
      
      fireEvent.change(currentPassword, { target: { value: 'current123' } })
      fireEvent.change(newPassword, { target: { value: 'newpass123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockChangePassword).toHaveBeenCalledWith({
          currentPassword: 'current123',
          newPassword: 'newpass123',
          revokeOtherSessions: true
        })
        expect(toast.success).toHaveBeenCalledWith('Password updated successfully')
      })
    })
  })

  describe('DeleteAccountDialog', () => {
    const mockDeleteUser = jest.fn()
    const mockRouter = {
      replace: jest.fn(),
      refresh: jest.fn()
    }
    
    beforeEach(() => {
      require('@/lib/auth-client').authClient.deleteUser = mockDeleteUser
      require('next/navigation').useRouter.mockReturnValue(mockRouter)
    })

    it('renders delete button', () => {
      render(<DeleteAccountDialog />)
      
      expect(screen.getByText('Delete personal account')).toBeInTheDocument()
    })

    it('shows confirmation dialog on button click', () => {
      render(<DeleteAccountDialog />)
      
      fireEvent.click(screen.getByText('Delete personal account'))
      
      expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument()
      expect(screen.getByText('This action cannot be undone. This will permanently delete your account and remove your data from our servers.')).toBeInTheDocument()
    })

    it('handles account deletion', async () => {
      mockDeleteUser.mockResolvedValue({ error: null })
      
      render(<DeleteAccountDialog />)
      
      fireEvent.click(screen.getByText('Delete personal account'))
      fireEvent.click(screen.getByText('Continue'))
      
      await waitFor(() => {
        expect(mockDeleteUser).toHaveBeenCalled()
        expect(mockRouter.replace).toHaveBeenCalledWith('/')
        expect(mockRouter.refresh).toHaveBeenCalled()
        expect(toast.success).toHaveBeenCalledWith('Account deleted successfully')
      })
    })

    it('handles error during deletion', async () => {
      mockDeleteUser.mockResolvedValue({ error: { message: 'Deletion failed' } })
      
      render(<DeleteAccountDialog />)
      
      fireEvent.click(screen.getByText('Delete personal account'))
      fireEvent.click(screen.getByText('Continue'))
      
      await waitFor(() => {
        expect(mockDeleteUser).toHaveBeenCalled()
        expect(toast.error).toHaveBeenCalledWith('Deletion failed')
      })
    })
  })
})
