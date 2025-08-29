import { forwardRef } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
  margin-bottom: 16px;
  width: 100%;
`

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
`

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(0, 71, 171, 0.2);
  }
  
  &:disabled {
    background-color: var(--color-background);
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  &::placeholder {
    color: var(--color-text-tertiary);
  }
`

const ErrorText = styled.div`
  color: var(--color-error);
  font-size: 0.75rem;
  margin-top: 4px;
`

const HelperText = styled.div`
  color: var(--color-text-tertiary);
  font-size: 0.75rem;
  margin-top: 4px;
`

const Input = forwardRef(({ 
  label, 
  id, 
  error, 
  helperText,
  ...props 
}, ref) => {
  return (
    <InputContainer>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
      <StyledInput 
        id={id} 
        ref={ref} 
        {...props} 
      />
      {error && <ErrorText>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputContainer>
  )
})

Input.displayName = 'Input'

export default Input