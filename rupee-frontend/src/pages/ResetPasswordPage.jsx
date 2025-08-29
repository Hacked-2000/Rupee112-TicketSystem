import { useState } from 'react'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { toast } from 'react-fox-toast'
import { useForm } from 'react-hook-form'
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ThemeToggle from '../components/common/ThemeToggle'
import { resetPassword } from '../services/auth'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background-color: var(--color-background);
`

const Header = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
`

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 24px;
`

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 32px;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
`

const FormHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-text-primary);
`

const Subtitle = styled.p`
  color: var(--color-text-secondary);
`

const FormGroup = styled.div`
  margin-bottom: 24px;
`

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
  
  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
    color: var(--color-text-tertiary);
  }
  
  input {
    padding-left: 40px;
  }
`

const ActionLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 16px;
  font-size: 0.875rem;
`

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  // Reset password mutation
  const mutation = useMutation(resetPassword, {
    onSuccess: () => {
      toast.success('Password has been reset successfully. Please log in with your new password.')
      navigate('/login')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    }
  })
  
  const handleFormSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    const passwordData = {
      email: data.email,
      old_password: data.oldPassword,
      new_password: data.newPassword
    }
    
    mutation.mutate(passwordData)
  }
  
  return (
    <PageContainer>
      <Header>
        <ThemeToggle />
      </Header>
      
      <Logo>Ticket System</Logo>
      
      <FormContainer>
        <FormHeader>
          <Title>Reset Password</Title>
          <Subtitle>Enter your details to reset your password</Subtitle>
        </FormHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormGroup>
            <InputWrapper>
              <FiMail size={18} />
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
              />
            </InputWrapper>
            
            <InputWrapper>
              <FiLock size={18} />
              <Input
                id="oldPassword"
                type="password"
                placeholder="Current Password"
                {...register('oldPassword', { 
                  required: 'Current password is required' 
                })}
                error={errors.oldPassword?.message}
              />
            </InputWrapper>
            
            <InputWrapper>
              <FiLock size={18} />
              <Input
                id="newPassword"
                type="password"
                placeholder="New Password"
                {...register('newPassword', { 
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={errors.newPassword?.message}
              />
            </InputWrapper>
            
            <InputWrapper>
              <FiLock size={18} />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                {...register('confirmPassword', { 
                  required: 'Please confirm your new password'
                })}
                error={errors.confirmPassword?.message}
              />
            </InputWrapper>
          </FormGroup>
          
          <Button 
            type="submit" 
            fullWidth 
            disabled={mutation.isLoading}
          >
            Reset Password
          </Button>
          
          <ActionLink to="/login">
            <FiArrowLeft size={14} style={{ marginRight: '4px' }} />
            Back to Login
          </ActionLink>
        </form>
      </FormContainer>
    </PageContainer>
  )
}

export default ResetPasswordPage