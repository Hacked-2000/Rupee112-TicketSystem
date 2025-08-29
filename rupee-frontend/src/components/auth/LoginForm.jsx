import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import Input from '../common/Input'
import Button from '../common/Button'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-fox-toast'
import LoadingSpinner from '../common/LoadingSpinner'


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

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 8px;
`

const ActionLink = styled(Link)`
  display: block;
  text-align: right;
  font-size: 0.875rem;
  margin-bottom: 24px;
`

const LoginForm = () => {
  const [error, setError] = useState('')
 
  const { loginUser, loading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate=useNavigate();
  const onSubmit = async (data) => {
    setError('')
    
    const credentials = {
      user_email: data.email,
      user_password: data.password
    }
    
    try {
      const success = await loginUser(credentials)
      console.log(success)
      if(success){
        toast.success('Logged in successfully!!')
        navigate('/Dashboard')
      }
      if (!success) {
        toast.error('Invalid email or password. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again later.')
    }
  }
  
  return (
    <FormContainer>
      <FormHeader>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your account</Subtitle>
      </FormHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
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
              id="password"
              type="password"
              placeholder="Password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message}
            />
          </InputWrapper>
        </FormGroup>
        
        <ActionLink to="/reset-password">Forgot your password?</ActionLink>
        
        {!loading ? <Button 
          type="submit" 
          fullWidth 
          disabled={loading}
        >
          <FiLogIn />
          Sign In
        </Button>:<LoadingSpinner/>}
      </form>
    </FormContainer>
  )
}

export default LoginForm