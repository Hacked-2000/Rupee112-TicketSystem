import { useState } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { toast } from 'react-fox-toast'
import { FiArrowLeft } from 'react-icons/fi'
import Button from '../components/common/Button'
import TicketForm from '../components/tickets/TicketForm'

import { useAuth } from '../context/AuthContext'
import { createTicket } from '../services/api'

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

const CreateTicketPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [isLoading,setIsLoading]=useState(false)
  // Create ticket mutation

  
  const handleSubmit = async (data) => {
   
    
    try {
      data.user_id = currentUser.id
    data.updated_by = currentUser.id
    data.status='open'
    let response=await createTicket(data)
      if(response?.status=='success'){
        toast.success(response?.message)
      }
      if(response?.status=='failure'){
        toast.error(response?.message)
      }
    } catch (error) {
      console.log(error)
    }
   
  }
  
  const handleCancel = () => {
    navigate('/tickets')
  }
  
  return (
    <div>
      <PageHeader>
        <Button
          variant="text"
          onClick={() => navigate('/tickets')}
        >
          <FiArrowLeft size={18} />
        </Button>
        <Title>Create New Ticket</Title>
      </PageHeader>
      
      <FormContainer>
        <TicketForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </FormContainer>
    </div>
  )
}

export default CreateTicketPage