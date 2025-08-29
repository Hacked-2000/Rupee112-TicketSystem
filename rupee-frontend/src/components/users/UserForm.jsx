import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'

import { useAuth } from '../../context/AuthContext'
import { getRoles, getUsers } from '../../services/api'
import { Controller } from 'react-hook-form'


const FormContainer = styled.div`
  
  width: 100%;
`

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`

const UserForm = ({ user, onSubmit, onCancel, isLoading }) => {
  const { currentUser } = useAuth()
  const { register, handleSubmit, control, reset, formState: { errors }, setValue } = useForm()
  const [rolesData,setrolesData]=useState([])
  // Fetch roles for dropdown

  const [reportingUsers, setReportingUsers] = useState([])
 
  
  // Set initial form values if editing user
  useEffect(() => {
    if (user) {
      console.log(user)
      setValue('lms_user_id', user.lms_user_id)
      setValue('role_id', user.role_id)
      setValue('name', user.name)
      setValue('email', user.email)
      setValue('reporting', user.reporting)
      setValue('is_active', user.is_active)
      setValue('is_deleted', user.is_deleted)
      setValue('id',user?.id)
    }
  }, [user, setValue])
  
  const roles = rolesData?.map(role => ({
    value: role.id,
    label: role.name
  })) || []


  
  // Handle form submission
  const handleFormSubmit = (data) => {
    console.log(data)
    // Add created_by or updated_by based on if we're creating or updating
    if (user) {
      data.updated_by = currentUser.id
    } else {
      data.created_by = currentUser.id
    }
    
    onSubmit(data)
  }
   async function fetchroles(){
     
      let roles= await getRoles();
     
      setrolesData(roles)

    }
   



  useEffect(()=>{
    fetchroles()
    async function fetchReportingUsers() {
      try {
        const admins = await getUsers(1, 100, 3); // Admins
        const managers = await getUsers(1, 100, 2); // Managers
        const combined = [...admins, ...managers];
        console.log(admins,managers)
        const activeUsers = combined
          .filter(user => user.is_active === 1) // ✅ Filter active users
          .map(user => ({
            value: user.id,
            label: user.name
          }));
      
        setReportingUsers(activeUsers);
      } catch (error) {
        console.error('Failed to fetch reporting users:', error);
      }
    }
  
    fetchReportingUsers()
   },[])
  
  return (
    <FormContainer>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGroup>
          <Input
            id="name"
            label="Full Name"
            placeholder="Enter full name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="Enter email address"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />
           <Input
            id="lms_user_id"
            type="number"
            label="LMS User ID"
            placeholder="Enter LMS User ID"
            {...register('lms_user_id', { 
              required: 'LMS User ID is required',
              valueAsNumber: true
            })}
            error={errors.lms_user_id?.message}
          />
        </FormGroup>
        
        <FormGroup>
         
{/*           
          <Select
            id="role_id"
            label="Role"
            placeholder="Select a role"
            options={roles}
            {...register('role_id', { 
              required: 'Role is required',
              valueAsNumber: true
            })}
            error={errors.role_id?.message}
          /> */}
          <Controller
  name="role_id"
  control={control}
  rules={{ required: 'Role is required' }}
  render={({ field }) => (
    <Select
      {...field}
      id="role_id"
      label="Role"
      placeholder="Select a role"
      options={roles}
      error={errors.role_id?.message}
    />
  )}
/>
<Controller
  name="reporting"
  control={control}
  rules={{ required: 'Reporting manager is required' }}
  render={({ field }) => (
    <Select
      {...field}
      id="reporting"
      label="Reporting To"
      placeholder="Select reporting manager"
      options={reportingUsers}
      error={errors.reporting?.message}
    />
  )}
/>


{/* <Select
  id="reporting"
  label="Reporting To"
  placeholder="Select reporting manager"
  options={reportingUsers}
  {...register('reporting', { 
    required: 'Reporting manager is required',
    valueAsNumber: true 
  })}
  error={errors.reporting?.message}
/> */}

          
          {!user && (
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Enter password"
              {...register('password', { 
                required: !user ? 'Password is required' : false,
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message}
            />
          )}
        </FormGroup>
        
       
        
        <ButtonGroup>
          <Button type="submit" disabled={isLoading}>
            {user ? 'Update User' : 'Create User'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  )
}

export default UserForm