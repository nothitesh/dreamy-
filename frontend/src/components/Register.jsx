import { useState } from "react"
import styled from "styled-components"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields")
      return
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        email,
        password,
      })

      localStorage.setItem("token", res.data.token)
      navigate("/home")
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <LoginCard>
        <Header>
          <Title>Welcome!</Title>
          <Subtitle>Sign Up to continue</Subtitle>
        </Header>

        <InputSec>
          <InputGroup>
            <Label>Email</Label>
            <Email
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <PasswordWrapper>
              <Password
                type={showPassword ? "text" : "password"}
                placeholder="Eg: ••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <ShowPasswordB
                type="button"
                onClick={() => setShowPassword(v => !v)}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </ShowPasswordB>
            </PasswordWrapper>
          </InputGroup>

          <InputGroup>
            <Label>Confirm Password</Label>
            <ConfirmPasswordWrapper>
              <ConfirmPassword
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </ConfirmPasswordWrapper>
          </InputGroup>

          <Button onClick={handleRegister} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>

          <Line />

          <Other>
            <SignUp>
              Already have an account?{" "}
              <SignUpB onClick={() => navigate("/")}>
                Log In
              </SignUpB>
            </SignUp>
          </Other>
        </InputSec>
      </LoginCard>
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #0f0f0f;
`;

const LoginCard = styled.div`
  background: #1a1a1a;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  border: 1px solid #222;
  border-radius: 20px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
  color: #f5f5f5;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 300;
  color: #9a9a9a;
`;

const InputSec = styled.div`
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 500;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 18px;
  position: relative;
`;

const InputStyle = `
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 8px;
  background: #121212;
  border: 0.5px solid #2a2a2a;
  color: #f5f5f5;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #f1f1f175;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: rgb(102, 102, 102);
  }
`;

const Email = styled.input`
  ${InputStyle}
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Password = styled.input`
  ${InputStyle}
  padding-right: 60px;
`;

const Button = styled.button`
  width: 100%;
  margin-top: 22px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #4f8cff;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover:not(:disabled) {
    opacity: 0.7;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Other = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 12px;
  gap: 12px;
`;

const SignUp = styled.p`
  margin: 0;
  font-size: 13px;
  color: #9a9a9a;
`;

const SignUpB = styled.a`
  color: #4f8cff;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #2a2a2a;
  margin: 20px 0;
`;

const ShowPasswordB = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  outline: none;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  color: #8a8a8a;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #3a3a3a;
  }
  
  &:active {
    border: none;
    outline: none;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfirmPassword = styled.input`
  ${InputStyle}
`;

const ConfirmPasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;