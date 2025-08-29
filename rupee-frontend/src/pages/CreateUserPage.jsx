import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { toast } from 'react-fox-toast'
import { FiArrowLeft } from 'react-icons/fi'
import Button from '../components/common/Button'
import UserForm from '../components/users/UserForm'

import { useState } from 'react'
import { createUser } from '../services/api'

const PageHeader = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
`

const Title = styled.h1`
  margin: 0;
`

const FormContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 24px;
`

const CreateUserPage = () => {
  const navigate = useNavigate()
  const [isLoading,setIsLoading]=useState(false)
  // Create user mutation
  
  const handleSubmit = async (data) => {
    try {
      let response=await createUser(data);
      if(response?.status==='success') {
       toast.success(response?.message)
       navigate('/users')
      }
      else {
       toast.error(response?.message)
      }
    } catch (error) {
      console.log(error)
    }
  
  
  }
  
  const handleCancel = () => {
    navigate('/users')
  }
  
  return (
    <div>
      <PageHeader>
        <Button
          variant="text"
          onClick={() => navigate('/users')}
        >
          <FiArrowLeft size={18} />
        </Button>
        <Title>Create New User</Title>
      </PageHeader>
      
      <FormContainer>
        <UserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </FormContainer>
    </div>
  )
}

export default CreateUserPage