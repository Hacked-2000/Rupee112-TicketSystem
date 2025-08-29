import styled from 'styled-components'
import { useTheme } from '../../context/ThemeContext'
import { FiSun, FiMoon } from 'react-icons/fi'

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  color: var(--color-text-primary);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  [data-theme='dark'] &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <ToggleButton 
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
    </ToggleButton>
  )
}

export default ThemeToggle