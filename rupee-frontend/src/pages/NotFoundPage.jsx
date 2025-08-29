import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Button from '../components/common/Button'
import { FiArrowLeft } from 'react-icons/fi'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 24px;
`

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 16px;
`

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 16px;
  color: var(--color-text-primary);
`

const Description = styled.p`
  font-size: 1.125rem;
  margin-bottom: 32px;
  color: var(--color-text-secondary);
  max-width: 500px;
`

const NotFoundPage = () => {
  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Description>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Description>
      <Button as={Link} to="/dashboard">
        <FiArrowLeft size={18} />
        Back to Dashboard
      </Button>
    </Container>
  )
}

export default NotFoundPage