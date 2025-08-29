import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { FiHome, FiUsers, FiTag, FiSettings, FiClipboard } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const SidebarContainer = styled.aside`
  background-color: var(--color-surface);
  width: 250px;
  height: calc(100vh - 64px);
  position: fixed;
  top: 64px;
  left: 0;
  z-index: 90;
  box-shadow: var(--shadow-sm);
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    position: fixed;
  }
`

const NavContainer = styled.nav`
  padding: 24px 0;
`

const NavSection = styled.div`
  margin-bottom: 24px;
`

const NavSectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  padding: 0 24px;
  margin-bottom: 8px;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--color-primary);
    text-decoration: none;
  }
  
  &.active {
    color: var(--color-primary);
    background-color: rgba(0, 71, 171, 0.1);
    border-left: 3px solid var(--color-primary);
    font-weight: 500;
  }
  
  [data-theme='dark'] &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  [data-theme='dark'] &.active {
    background-color: rgba(59, 130, 246, 0.2);
  }
`

const Overlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 80;
  }
`

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { currentUser, isAdmin, isManager } = useAuth()
  
  const handleOverlayClick = () => {
    setIsOpen(false)
  }
  
  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <NavContainer>
          <NavSection>
            <NavSectionTitle>Main</NavSectionTitle>
            <NavItem to="/dashboard" onClick={() => setIsOpen(false)}>
              <FiHome size={18} />
              Dashboard
            </NavItem>
            <NavItem to="/tickets" onClick={() => setIsOpen(false)}>
              <FiTag size={18} />
              Tickets
            </NavItem>
          </NavSection>
          
          {(isAdmin || isManager) && (
            <NavSection>
              <NavSectionTitle>Administration</NavSectionTitle>
              {isAdmin && (
                <NavItem to="/users" onClick={() => setIsOpen(false)}>
                  <FiUsers size={18} />
                  User Management
                </NavItem>
              )}
              <NavItem to="/reports" onClick={() => setIsOpen(false)}>
                <FiClipboard size={18} />
                Reports
              </NavItem>
            </NavSection>
          )}
          
         
        </NavContainer>
      </SidebarContainer>
      <Overlay isOpen={isOpen} onClick={handleOverlayClick} />
    </>
  )
}

export default Sidebar