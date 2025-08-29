import { forwardRef } from 'react'
import styled from 'styled-components'

const SelectContainer = styled.div`
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

const StyledSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  width: 100%;
  font-size: 0.875rem;
  background-color: var(--color-surface);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
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

const Select = forwardRef(({
  label,
  id,
  options = [],
  placeholder,
  error,
  helperText,
  ...props
}, ref) => {
  return (
    <SelectContainer>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
      <StyledSelect
        id={id}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {error && <ErrorText>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </SelectContainer>
  )
})

Select.displayName = 'Select'

export default Select