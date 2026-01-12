import styled from 'styled-components'
import { useState, useEffect } from 'react'

export default function TwoMonthModal({ currentDate, monthNames, onPrev, onNext, onClose }) {
  const [isClosing, setIsClosing] = useState(false)
  const currentMonth = currentDate.getMonth()

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => onClose(), 180) 
  }

  const handlePrev = () => {
    onPrev()
    handleClose()
  }

  const handleNext = () => {
    onNext()
    handleClose()
  }

  const handleWrapperClick = e => e.stopPropagation()

  return (
    <>
      <Backdrop onClick={handleClose} />

      <ModalWrapper
        onClick={handleWrapperClick}
        isClosing={isClosing}
      >
        <Modal>
          <button onClick={handlePrev}>
            {currentMonth === 0 ? monthNames[11] : monthNames[currentMonth - 1]}
          </button>

          <button className="active" onClick={handleClose}>
            {monthNames[currentMonth]}
          </button>

          <button onClick={handleNext}>
            {currentMonth === 11 ? monthNames[0] : monthNames[currentMonth + 1]}
          </button>
        </Modal>
      </ModalWrapper>
    </>
  )
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
  background: transparent;
`

const ModalWrapper = styled.div`
  position: absolute;           
  top: 50%;                     
  left: 100%;                   
  transform: translateY(-50%) scale(${props => (props.isClosing ? 0.92 : 1)});
  display: inline-flex;
  justify-content: center;
  z-index: 20;
  transition: opacity 0.18s ease, transform 0.18s ease;
  opacity: ${props => (props.isClosing ? 0 : 1)};
`


const Modal = styled.div`
  display: flex;
  gap: 8px;
  background: #1a1a1a;
  border: 1px solid #555;
  padding: 6px 12px;
  border-radius: 999px;
  transition: all 0.18s ease;

  button {
    background: transparent;
    border: none;
    color: #aaa;
    padding: 6px 12px;
    border-radius: 999px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.15s ease;

    &:hover {
      background: #2a2a2a;
      color: white;
    }

    &.active {
      background: #3a3a3a;
      color: white;
      font-weight: 500;
      cursor: default;
    }
  }
`
