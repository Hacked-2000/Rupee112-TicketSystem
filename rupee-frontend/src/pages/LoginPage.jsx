import styled from 'styled-components'
import LoginForm from '../components/auth/LoginForm'
import ThemeToggle from '../components/common/ThemeToggle'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background-color: var(--color-background);
`

const Header = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
`

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 24px;
`

const LoginPage = () => {
  return (
    <PageContainer>
      <Header>
        <ThemeToggle />
      </Header>
      
      <Logo>Rupee112</Logo>
      <LoginForm />
    </PageContainer>
  )
}

export default LoginPage