import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import ContentEditable from 'react-contenteditable'
import axios from 'axios'

export default function RightSide({ selectedDate }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const bodyRef = useRef(null)
  const saveTimeout = useRef(null)
  const token = localStorage.getItem("token")
  const API = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const dateKey = selectedDate.toISOString().split("T")[0]

useEffect(() => {
  const loadJournal = async () => {
    try {
      const res = await API.get(`/journal/${dateKey}`)
      console.log("Journal loaded:", res.data)
      setTitle(res.data?.title || "")
      setBody(res.data?.content || "")
    } catch (err) {
      console.error("Failed to load journal", err)
    }
  }

  loadJournal()
}, [dateKey])

useEffect(() => {
  console.log("Saving journal with title:", title)
  if (saveTimeout.current) clearTimeout(saveTimeout.current)
  saveTimeout.current = setTimeout(async () => {
    try {
      const res = await API.post(`/journal/${dateKey}`, {
        title,
        content: body,
      })
      console.log("Journal saved:", res.data)
    } catch (err) {
      console.error("Failed to save journal:", err.response?.data || err.message)
    }
  }, 700)
  return () => clearTimeout(saveTimeout.current)
}, [title, body, dateKey])
  const handleKeyFunctions = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault()
      document.execCommand('bold')
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault()
      document.execCommand('italic')
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      insertTodo()
    }
  }
  const insertTodo = () => {
    const todoHTML = `
      <div data-type="todo" style="
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 6px 0;
      ">
        <input type="checkbox" />
        <span contenteditable="true">New task</span>
      </div>
    `
    document.execCommand('insertHTML', false, todoHTML)
  }

  return (
    <PlannerContainer>
      <Header>
        <Title>Day Planner</Title>
        <Subtitle>
          {selectedDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Subtitle>
      </Header>

      <ContentSection>
        <PageTitle
          placeholder="Page Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <JournalWrapper>
          {!body && <Placeholder>Write something more about this day?</Placeholder>}

          <JournalBody
            innerRef={bodyRef}
            html={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyFunctions}
          />
        </JournalWrapper>
      </ContentSection>
    </PlannerContainer>
  )
}


const PlannerContainer = styled.div`
  background-color: #111111;
  color: white;
  padding: 40px;
  padding-top: 2px;

`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #999;
`;

const ContentSection = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const PageTitle = styled.input`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: white;
`;

const JournalWrapper = styled.div`
  position: relative;
`;

const Placeholder = styled.div`
  position: absolute;
  top: 4px;
  color: #ffffff39;
  pointer-events: none;
`;

const JournalBody = styled(ContentEditable)`
  font-size: 16px;
  line-height: 1.6;
  color: #ccc;
  min-height: 420px;
  outline: none;
  background: transparent;
`;
