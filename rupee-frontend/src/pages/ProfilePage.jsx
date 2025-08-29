import { useState } from 'react'
import { useMutation } from 'react-query'
import styled from 'styled-components'
import { toast } from 'react-fox-toast'
import { useForm } from 'react-hook-form'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { resetPassword } from '../services/auth'
import { useAuth } from '../context/AuthContext'

const PageHeader = styled.div`
  margin-bottom: 24px;
`

const Title = styled.h1`
  margin-bottom: 8px;
`

const Subtitle = styled.p`
  color: var(--color-text-secondary);
`

const FormContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 24px;
  max-width: 500px;
`

const FormGroup = styled.div`
  margin-bottom: 24px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`

const ProfilePage = () => {
  const { currentUser } = useAuth()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  // Reset password mutation
  const mutation = useMutation(resetPassword, {
    onSuccess: () => {
      toast.success('Password updated successfully')
      reset()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update password')
    }
  })
  
  const handleFormSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    const passwordData = {
      email: currentUser.email,
      old_password: data.currentPassword,
      new_password: data.newPassword
    }
    
    mutation.mutate(passwordData)
  }
  
  return (
    <div>
      <PageHeader>
        <Title>Profile Settings</Title>
        <Subtitle>Manage your account settings</Subtitle>
      </PageHeader>
      
      <FormContainer>
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormGroup>
            <Input
              id="currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter your current password"
              {...register('currentPassword', { 
                required: 'Current password is required' 
              })}
              error={errors.currentPassword?.message}
            />
            
            <Input
              id="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.newPassword?.message}
            />
            
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              {...register('confirmPassword', { 
                required: 'Please confirm your new password',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.confirmPassword?.message}
            />
          </FormGroup>
          
          <ButtonGroup>
            <Button 
              type="submit" 
              disabled={mutation.isLoading}
            >
              Update Password
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => reset()}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </div>
  )
}

export default ProfilePage