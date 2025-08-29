import styled from 'styled-components'

const CardContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`

const CardTitle = styled.h3`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
`

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color || 'var(--color-primary)'};
`

const CardFooter = styled.div`
  margin-top: 16px;
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
`

const StatCard = ({ title, value, color, footer }) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <CardValue color={color}>{value}</CardValue>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardContainer>
  )
}

export default StatCard