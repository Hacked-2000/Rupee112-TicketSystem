import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FiMenu, FiX, FiBell, FiUser, FiLogOut, FiSearch } from 'react-icons/fi'
import ThemeToggle from '../common/ThemeToggle'
import { useAuth } from '../../context/AuthContext'
import { fetchnotifs, getTicketReplyById } from '../../services/api'
import { toast } from 'react-fox-toast'

// Styled components
const HeaderContainer = styled.header`
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  display: flex;
  align-items: center;
`

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const UserContainer = styled.div`
  position: relative;
  margin-left: 16px;
`

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--border-radius-sm);

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  [data-theme='dark'] &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const UserMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  min-width: 200px;
  overflow: hidden;
  z-index: 20;
`

const UserMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: var(--color-text-primary);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    text-decoration: none;
  }

  [data-theme='dark'] &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  [data-theme='dark'] &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`

const MenuButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-sm);

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  [data-theme='dark'] &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const NotificationButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--border-radius-sm);
  position: relative;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  [data-theme='dark'] &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: red;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 9999px;
`

const NotificationDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  min-width: 350px;
  z-index: 20;
  max-height: 300px;
  overflow-y: auto;
`

const NotificationItem = styled(Link)`
  display: block;
  padding: 12px 16px;
  color: var(--color-text-primary);
  text-decoration: none;
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  [data-theme='dark'] &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`
const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 16px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: 4px 8px;

  input {
    border: none;
    outline: none;
    padding: 6px 8px;
    background: transparent;
    color: var(--color-text-primary);
    width: 200px;
  }

  svg {
    color: gray;
  }

  @media (max-width: 600px) {
    input {
      width: 120px;
    }
  }
`

// Header Component
const Header = ({ sidebarOpen, onToggleSidebar, showMenuButton }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { currentUser, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
   const navigate = useNavigate()

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen)

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  const fetchNotif = async () => {
    try {
      if (!currentUser?.id) return
      const response = await fetchnotifs(currentUser.id)
      setNotifications(response?.data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }
  const handleSearchKeyDown = async (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      try {
       let response=await getTicketReplyById(searchTerm);
        if(response?.success==false){
          toast?.error(response?.message)
        }
        if(response?.success==true){
          navigate(`tickets/${searchTerm}`)
        }
        
      } catch (error) {
        console.error('Search error:', error)
      }
    }
  }

  useEffect(() => {
    fetchNotif()
    const interval = setInterval(fetchNotif, 5000)
    return () => clearInterval(interval)
  }, [currentUser?.id])
  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
  
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };
  
console.log(notifications)
  return (
    <HeaderContainer>
      <HeaderLeft>
        {showMenuButton && (
          <MenuButton onClick={onToggleSidebar}>
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MenuButton>
        )}
        <Logo to="/dashboard">Rupee112</Logo>
      </HeaderLeft>

      <NavContainer>
      <SearchContainer>
          <FiSearch size={16} />
          <input
            type="number"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </SearchContainer>
        <NotificationButton onClick={() => setNotifOpen(!notifOpen)}>
          <FiBell size={20} />
          {notifications?.length > 0 && (
            <NotificationBadge>{notifications.length}</NotificationBadge>
          )}
          {notifOpen && (
            <NotificationDropdown>
             
                {notifications?.map((ticket, index) => (
                  <NotificationItem
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  onClick={() => setNotifOpen(false)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{index + 1}. {ticket.title}</span>
                    {ticket.created_at && (
                      <span style={{ fontSize: '11px', color: 'gray', marginLeft: '8px' }}>
                        {timeAgo(ticket.created_at)}
                      </span>
                    )}
                  </div>
                </NotificationItem>
                
                ))}
                
           
            </NotificationDropdown>
          )}
        </NotificationButton>

        <ThemeToggle />

        {currentUser && (
          <UserContainer>
            <UserButton onClick={toggleUserMenu}>
              <FiUser />
              {currentUser.name || 'User'}
            </UserButton>

            {userMenuOpen && (
              <UserMenu>
                <UserMenuItem to="/profile">
                  <FiUser size={16} />
                  Profile
                </UserMenuItem>
                <UserMenuButton onClick={handleLogout}>
                  <FiLogOut size={16} />
                  Logout
                </UserMenuButton>
              </UserMenu>
            )}
          </UserContainer>
        )}
      </NavContainer>
    </HeaderContainer>
  )
}

export default Header

