import React from 'react'
import styled from 'styled-components'
import IsModalOpen from './IsModalOpen'
import TimeInfo from './TimeInfo'
import axios from 'axios'

export default function Center({ selectedDate }) { 
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [blocks, setBlocks] = React.useState([])
  const [editingBlock, setEditingBlock] = React.useState(null)
  const token = localStorage.getItem("token")
  const API = axios.create({
    baseURL: "http://localhost:5000",
    headers: { Authorization: `Bearer ${token}` }
  })

  const dateKey = selectedDate.toISOString().split("T")[0]

  React.useEffect(() => {
    fetchTodos()
  }, [dateKey])

  const fetchTodos = async () => {
    try {
      const res = await API.get("/todos", {
        params: { date: dateKey } 
      })
      console.log("Todos loaded:", res.data)
      setBlocks(res.data)
    } catch (err) {
      console.error("Failed to fetch todos", err)
    }
}

  const getPositionOnCircle = (hour, radius) => {
    const angle = hour * 15
    const rad = (angle - 90) * (Math.PI / 180)
    const x = 50 + Math.cos(rad) * radius
    const y = 50 + Math.sin(rad) * radius
    return { left: `${x}%`, top: `${y}%` }
  }

  const labels = [
    { label: '00', hour: 0 },
    { label: '03', hour: 3 },
    { label: '06', hour: 6 },
    { label: '09', hour: 9 },
    { label: '12', hour: 12 },
    { label: '15', hour: 15 },
    { label: '18', hour: 18 },
    { label: '21', hour: 21 },
  ].map(t => ({ ...t, ...getPositionOnCircle(t.hour, 36) }))

  const buildTimeGradient = () => {
    if (blocks.length === 0) return 'transparent'

    const ranges = blocks
      .flatMap(b => {
        const start = Number(b.start)
        const end = Number(b.end)
        if (end < start) {
          return [
            { start, end: 24, color: b.color, _id: b._id },
            { start: 0, end, color: b.color, _id: b._id }
          ]
        }
        return [{ start, end, color: b.color, _id: b._id }]
      })
      .map(b => ({ ...b, start: b.start * 15, end: b.end * 15 }))
      .sort((a,b) => a.start - b.start)

    const segments = []
    let cursor = 0
    for (const r of ranges) {
      if (r.start > cursor) segments.push(`transparent ${cursor}deg ${r.start}deg`)
      segments.push(`${r.color} ${r.start}deg ${r.end}deg`)
      cursor = r.end
    }
    if (cursor < 360) segments.push(`transparent ${cursor}deg 360deg`)
    return `conic-gradient(${segments.join(', ')})`
  }

const handleSave = async (newBlock) => {
    try {
      const blockId = editingBlock?._id
      
      const blockData = {
        start: Number(newBlock.start),
        end: Number(newBlock.end),
        color: newBlock.color,
        title: newBlock.task,
        date: dateKey 
      }

      if (blockId) {
        await API.put(`/todos/${blockId}`, blockData)
        
        setBlocks(prev =>
          prev.map(b => b._id === blockId ? { ...b, start: blockData.start, end: blockData.end, color: blockData.color, title: blockData.title, _id: blockId } : b)
        )
      } else {
        const res = await API.post("/todos", blockData)
        
        setBlocks(prev => [...prev, { ...blockData, _id: res.data._id }])
      }

      setIsModalOpen(false)
      setEditingBlock(null)
    } catch (err) {
      console.error("Failed to save block:", err.response?.data || err.message)
    }
  }

  const handleDelete = async blockToDelete => {
    try {
      if (blockToDelete._id) {
        await API.delete(`/todos/${blockToDelete._id}`)
      }
      setBlocks(prev => prev.filter(b => b._id !== blockToDelete._id))
    } catch (err) {
      console.error("Failed to delete block", err)
    }
  }

  const handleEdit = block => {
    setEditingBlock(block)
    setIsModalOpen(true)
  }

  const getDuration = (start, end) => {
    const s = Number(start)
    const e = Number(end)
    if (e >= s) return e - s
    return (24 - s) + e
  }

  return (
    <CenterContainer>
      <Title>Time Visual</Title>
      <AddTimeButton onClick={() => { setEditingBlock(null); setIsModalOpen(true); }}>
        Add a time
      </AddTimeButton>

      {isModalOpen && (
        <IsModalOpen 
          onClose={() => { setIsModalOpen(false); setEditingBlock(null); }} 
          onSave={handleSave}
          editingBlock={editingBlock}
          onDelete={handleDelete}
        />
      )}

      <ClockContainer>
        <TimeBlocks gradient={buildTimeGradient()} />
        <FiveMinuteTicks />
        <QuarterHourTicks />
        <HourTicks />
        <InnerCircle>
         <TimeInfo 
          blocks={blocks} 
          getDuration={getDuration}
          onEdit={handleEdit}
          onDelete={handleDelete}
         />
        </InnerCircle>

        {labels.map((l, i) => (
          <TimeLabel key={i} style={{ top: l.top, left: l.left }}>
            {l.label}
          </TimeLabel>
        ))}
      </ClockContainer>
    </CenterContainer>
  )
}


const CenterContainer = styled.div`
  background-color: #111111;
  color: white;
  padding: 40px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding-top: 5px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
`;

const AddTimeButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid #667;
  border-radius: 8px;
  padding: 12px 70px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 60px;

  transition: transform 0.18s ease, opacity 0.18s ease;

  &:hover {
    background-color: #3a3a3a;
    border: 1px solid #667;
    color: #ccc;
    transform: translateY(-3px) scale(1.03);
  }

  &:active {
    transform: scale(0.96);
    opacity: 0.8;
  }
`;

const ClockContainer = styled.div`
  position: relative;
  width: 380px;
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FiveMinuteTicks = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  z-index: 2;
  background: repeating-conic-gradient(
    from -90deg,
    rgba(255,255,255,0.22) 0deg 0.25deg,
    transparent 0.25deg 1.25deg
  );
  -webkit-mask: radial-gradient(circle, transparent 64%, black 64.6%);
  mask: radial-gradient(circle, transparent 64%, black 64.6%);
`;

const QuarterHourTicks = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: repeating-conic-gradient(
    from -90deg,
    rgba(255,255,255,0.45) 0deg 0.6deg,
    transparent 0.6deg 3.75deg
  );
  -webkit-mask: radial-gradient(circle, transparent 61%, black 61.7%);
  mask: radial-gradient(circle, transparent 61%, black 61.7%);
`;

const HourTicks = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: repeating-conic-gradient(
    from -90deg,
    rgba(255,255,255,0.95) 0deg 0.2deg,
    transparent 1.2deg 15deg
  );
  -webkit-mask: radial-gradient(circle, transparent 57%, black 57.8%);
  mask: radial-gradient(circle, transparent 57%, black 57.8%);
`;

const InnerCircle = styled.div`
  position: absolute;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background-color: #1b1b1b;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 300ms ease;
`;

const TimeLabel = styled.div`
  position: absolute;
  font-size: 16px;
  font-weight: 600;
  color: white;
  transform: translate(-50%, -50%);
  z-index: 20;
`;

const TimeBlocks = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: ${p => p.gradient};
  z-index: 1;
  -webkit-mask: radial-gradient(circle, transparent 58%, black 70%);
  mask: radial-gradient(circle, transparent 58%, black 70%);
  transition:
    background 420ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 220ms ease,
    filter 220ms ease;

  &:hover {
    transform: scale(1.015);
    filter: drop-shadow(0 0 14px rgba(255,255,255,0.25));
  }
`;