import React from "react"
import styled from "styled-components"

const PAGE_SIZE = 4

export default function TimeInfo({ blocks, getDuration, onEdit, onDelete }) {
  const [page, setPage] = React.useState(0)
  const [hoveredIndex, setHoveredIndex] = React.useState(null)
  const totalPages = Math.ceil(blocks.length / PAGE_SIZE)
  const visibleBlocks = blocks.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  )

  return (
    <Wrapper>
      {page > 0 && (
        <ScrollButton2 onClick={() => setPage(p => p - 1)}>
          Scroll up
        </ScrollButton2>
      )}
      <List>
        <AnimatedPage key={page}>
          {visibleBlocks.map((b, i) => {
            const duration = getDuration(b.start, b.end)
            return (
              <LineWrapper
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Line>
                  <Left>
                    <ColorDot color={b.color} />
                    <Task title={b.title}>{b.title || "Untitled task"}</Task>
                  </Left>

                  <Duration>{duration}h</Duration>
                </Line>

                {hoveredIndex === i && (
                  <ButtonGroup>
                    <ActionButton onClick={() => onEdit(b)}>
                      ✎
                    </ActionButton>
                    <ActionButton onClick={() => onDelete(b)}>
                      ✕
                    </ActionButton>
                  </ButtonGroup>
                )}
              </LineWrapper>
            );
          })}
        </AnimatedPage>
      </List>

      {page < totalPages - 1 && (
        <ScrollButton onClick={() => setPage(p => p + 1)}>
          More
        </ScrollButton>
      )}
    </Wrapper>
  )
}


const Wrapper = styled.div`
  position: relative;
  z-index: 30;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: white;
`;

const List = styled.div`
  overflow: visible;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnimatedPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  animation: slide 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slide {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LineWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: auto;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(18px);
  padding: 4px 8px;
  width: 120px;
  font-size: 13px;
  border-radius: 999px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const ColorDot = styled.div`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${p => p.color};
  flex-shrink: 0;
`;

const Task = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
  opacity: 0.85;
`;

const Duration = styled.div`
  font-size: 11px;
  opacity: 0.6;
  flex-shrink: 0;
`;

const ScrollButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: none;
  outline: none;
  color: white;
  font-size: 11px;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  opacity: 0.7;
  backdrop-filter: blur(12px);
  transition: opacity 0.2s ease, transform 0.2s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

const ScrollButton2 = styled(ScrollButton)``;

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
  animation: fadeIn 0.2s ease;
  pointer-events: auto;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ActionButton = styled.button`
  background: rgba(79, 140, 255, 0.2);
  border: 1px solid rgba(79, 140, 255, 0.5);
  color: #4f8cff;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.15s ease;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    background: rgba(79, 140, 255, 0.4);
    border-color: #4f8cff;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;