import { forwardRef } from 'react'
import styled, { css } from 'styled-components'

// Button variants
const variants = {
  primary: css`
    background-color: var(--color-primary);
    color: white;
    &:hover:not(:disabled) {
      background-color: var(--color-primary-light);
    }
  `,
  secondary: css`
    background-color: var(--color-secondary);
    color: white;
    &:hover:not(:disabled) {
      background-color: var(--color-secondary-light);
    }
  `,
  success: css`
    background-color: var(--color-success);
    color: white;
    &:hover:not(:disabled) {
      filter: brightness(1.1);
    }
  `,
  danger: css`
    background-color: var(--color-error);
    color: white;
    &:hover:not(:disabled) {
      filter: brightness(1.1);
    }
  `,
  outline: css`
    background-color: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    &:hover:not(:disabled) {
      background-color: var(--color-primary);
      color: white;
    }
  `,
  text: css`
    background-color: transparent;
    color: var(--color-primary);
    padding: 8px;
    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  `,
}

// Button sizes
const sizes = {
  small: css`
    padding: 6px 12px;
    font-size: 0.875rem;
  `,
  medium: css`
    padding: 8px 16px;
    font-size: 1rem;
  `,
  large: css`
    padding: 12px 24px;
    font-size: 1.125rem;
  `,
}

const StyledButton = styled.button`
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  ${props => variants[props.variant] || variants.primary}
  ${props => sizes[props.size] || sizes.medium}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
`

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  fullWidth = false,
  ...props
}, ref) => {
  return (
    <StyledButton
      ref={ref}
      variant={variant}
      size={size}
      type={type}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  )
})

Button.displayName = 'Button'

export default Button