import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }
  return (
    <NavbarContainer>
      <Logo>Dreamy</Logo>
      <LogoutButton onClick={handleLogout}>
        Logout
      </LogoutButton>
    </NavbarContainer>
  )
}

const NavbarContainer = styled.div`
  background-color: #111111;
  border-bottom: 1px solid #333;
  padding: 5px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const Logo = styled.h1`
  font-family: sans-serif;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #4f8cff, #7b68ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LogoutButton = styled.button`
  background-color: 1111110;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff4f4f;
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }
`;