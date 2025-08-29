import styled from 'styled-components'

const variants = {
  primary: {
    bg: 'var(--color-primary)',
    color: 'white',
  },
  secondary: {
    bg: 'var(--color-secondary)',
    color: 'white',
  },
  success: {
    bg: 'var(--color-success)',
    color: 'white',
  },
  warning: {
    bg: 'var(--color-warning)',
    color: 'black',
  },
  error: {
    bg: 'var(--color-error)',
    color: 'white',
  },
  neutral: {
    bg: 'var(--color-text-tertiary)',
    color: 'white',
  },
}

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
  background-color: ${props => variants[props.variant]?.bg || variants.primary.bg};
  color: ${props => variants[props.variant]?.color || variants.primary.color};
  white-space: nowrap;
`

const Badge = ({ children, variant = 'primary', ...props }) => {
  return (
    <StyledBadge variant={variant} {...props}>
      {children}
    </StyledBadge>
  )
}

export default Badge