import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import styled from 'styled-components'
import { toast } from 'react-fox-toast'
import { FiArrowLeft } from 'react-icons/fi'
import Button from '../components/common/Button'
import UserForm from '../components/users/UserForm'
import { updateUser } from '../services/api'


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

const EditUserPage = () => {
  const [isLoading,setloading]=useState(false)
  const navigate = useNavigate()
  const location =useLocation()
 

  const passedUser = location.state?.user || null

 

  const handleSubmit = async (data) => {
    console.log(data)
  
    // Remove email from the data object
    const { email, ...dataWithoutEmail } = data
  
    try {
      const response = await updateUser(data?.id, dataWithoutEmail)
      
      if (response?.status === 'success') {
        toast.success(response?.message)
        navigate('/users')
      } else {
        toast.error(response?.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occurred while updating the user')
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
        <Title>Edit User</Title>
      </PageHeader>
      
      <FormContainer>
        {!isLoading && passedUser && (
          <UserForm
            user={passedUser}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}
      </FormContainer>
    </div>
  )
}

export default EditUserPage