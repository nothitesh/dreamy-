import React from 'react'
import styled from 'styled-components'

export default function IsModalOpen({ onClose, onSave, editingBlock, onDelete }) {
  const [start, setStart] = React.useState(0)
  const [end, setEnd] = React.useState(1)
  const [color, setColor] = React.useState('#4f8cff')
  const [task, setTask] = React.useState('')

  React.useEffect(() => {
    if (editingBlock) {
      setStart(editingBlock.start || 0)
      setEnd(editingBlock.end || 1)
      setColor(editingBlock.color || '#4f8cff')
      setTask(editingBlock.title || '')
      console.log("Set task to:", editingBlock.title)
    } else {
      setStart(0)
      setEnd(1)
      setColor('#4f8cff')
      setTask('')
    }
  }, [editingBlock])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSave({ start, end, color, task })
    }
  }

  const handleSave = () => {
    console.log("Saving with task:", task)
    onSave({ start, end, color, task })
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <h3>{editingBlock ? 'Edit Time' : 'Add Time'}</h3>

        <Field>
          <Label>Start hour (0–24)</Label>
          <Input
            type="number"
            step="0.25"
            value={start}
            onChange={e => setStart(e.target.value)}
            onKeyPress={handleKeyPress}
            max='24'
          />
        </Field>

        <Field>
          <Label>End hour (0–24)</Label>
          <Input
            type="number"
            step="0.25"
            value={end}
            onChange={e => setEnd(e.target.value)}
            onKeyPress={handleKeyPress}
            max='24'
          />
        </Field>

        <FieldTask>
          <Label>What is this time for?</Label>
          <Input 
            value={task}
            onChange={e => setTask(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </FieldTask>

        <FieldColor>
          <Label>Color</Label>
          <Input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
          />
        </FieldColor>

        <Actions>
          <Button onClick={onClose}>Cancel</Button>
          {editingBlock && (
            <DeleteButton onClick={() => {
              onDelete(editingBlock)
              onClose()
            }}>
              Delete
            </DeleteButton>
          )}
          <Button
            $primary
            onClick={handleSave}
          >
            {editingBlock ? 'Update' : 'Save'}
          </Button>
        </Actions>
      </Modal>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const Modal = styled.div`
  background: #1b1b1b;
  padding: 24px;
  border-radius: 12px;
  width: 320px;
  color: white;
`;

const Field = styled.div`
  margin-bottom: 12px;
`;

const FieldColor = styled.div`
  margin-bottom: 12px;
`

const FieldTask = styled.div`
  margin-bottom: 12px;
`


const Label = styled.label`
  font-size: 13px;
  opacity: 0.8;
`;

const Input = styled.input`
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  border-radius: 6px;
  border: none;
  background: #2a2a2a;
  color: white;

  &[type="color"] {
    width: 100%;    
    height: 30px;   
    padding: 2px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }
`;


const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  background: ${p => (p.$primary ? '#4f8cff' : 'transparent')};
  border: 1px solid #4f8cff;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.96);
  }
`;

const DeleteButton = styled(Button)`
  background: transparent;
  border: 1px solid #ff4f4f;
  color: #ff6b6b;

  &:hover {
    background: rgba(255, 75, 75, 0.1);
    border-color: #ff6b6b;
  }
`;