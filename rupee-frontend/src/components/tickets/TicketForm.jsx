import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import Button from '../common/Button'
import { useAuth } from '../../context/AuthContext'
import { FiPaperclip } from 'react-icons/fi'

const FormContainer = styled.div`
  max-width: 800px;
  width: 100%;
`

const FormGroup = styled.div`
  margin-bottom: 16px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  margin-bottom: 16px;
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
  
  input {
    display: none;
  }
`

const FileList = styled.div`
  margin-top: 8px;
`

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-sm);
  margin-bottom: 4px;
  
  button {
    background: none;
    border: none;
    color: var(--color-error);
    cursor: pointer;
  }
`

const TicketForm = ({ onSubmit, onCancel, isLoading }) => {
  const { currentUser } = useAuth()
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      user_id: currentUser?.id,
      updated_by: currentUser?.id,
    }
  })
  
  const selectedFiles = watch('attachments')
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setValue('attachments', files)
  }
  
  const handleFormSubmit = (data) => {
    onSubmit(data)
  }
  
  return (
    <FormContainer>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGroup>
          <Input
            id="title"
            label="Ticket Title"
            placeholder="Enter a descriptive title for your issue"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
        </FormGroup>
        
        <FormGroup>
          <Textarea
            id="description"
            label="Description"
            placeholder="Please provide details about your issue"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
          />
        </FormGroup>
        
        <FormGroup>
          <FileInputLabel>
            <FiPaperclip size={18} />
            Attach Files (optional)
            <input
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </FileInputLabel>
          
          {selectedFiles && selectedFiles.length > 0 && (
            <FileList>
              {Array.from(selectedFiles).map((file, index) => (
                <FileItem key={index}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = Array.from(selectedFiles).filter((_, i) => i !== index)
                      setValue('attachments', newFiles.length ? newFiles : null)
                    }}
                  >
                    Remove
                  </button>
                </FileItem>
              ))}
            </FileList>
          )}
        </FormGroup>
        
        <ButtonGroup>
          <Button type="submit" disabled={isLoading}>
            Submit Ticket
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  )
}

export default TicketForm