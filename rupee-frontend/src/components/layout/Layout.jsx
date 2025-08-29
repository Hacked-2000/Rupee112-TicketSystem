import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
`

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  margin-top: var(--header-height);
  max-width: var(--max-width);
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const Main = styled.main`
  flex: 1;
  margin-left: ${props => props.isSidebarVisible ? 'var(--sidebar-width)' : '0'};
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - var(--header-height));
  width: ${props => props.isSidebarVisible ? 'calc(100% - var(--sidebar-width))' : '100%'};
  padding: var(--content-padding);
  backgroundcolor:blue
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: calc(var(--content-padding) / 2);
  }
`

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { currentUser } = useAuth()
  
  const isSidebarVisible = !!currentUser && sidebarOpen
  
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  return (
    <LayoutContainer>
      <Header 
        sidebarOpen={sidebarOpen} 
        onToggleSidebar={handleToggleSidebar}
        showMenuButton={!!currentUser}
      />
      <ContentWrapper>
        {currentUser && (
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        )}
        <Main isSidebarVisible={isSidebarVisible}>
          <Outlet />
        </Main>
      </ContentWrapper>
    </LayoutContainer>
  )
}

export default Layout