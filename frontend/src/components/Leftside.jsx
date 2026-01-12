import React, { useState } from 'react'
import styled from 'styled-components'
import TwoMonthModal from './Twomonthmodal'

export default function Calendar({ selectedDate, setSelectedDate}) {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const [view, setView] = useState('days'); 
  const [twoMonthModal, setTwoMonthModal] = useState(false)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  const getDaysArray = (date) => {
    const daysInMonth = getDaysInMonth(date)
    const firstDay = getFirstDayOfMonth(date)
    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1))
    setView('days')
  }

  const handleYearSelect = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1))
    setView('months')
  }

  const getYearRange = () => {
    const currentYear = currentDate.getFullYear()
    const startYear = currentYear - 5
    return [startYear, startYear + 6]
  }

  const renderDaysView = () => {
    const days = getDaysArray(currentDate)
    const weeks = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return (
      <>
        <MonthWrapper>
          <MonthTitle onClick={() => setTwoMonthModal(true)}>
            {monthNames[currentDate.getMonth()]} <p>{currentDate.getFullYear()}</p> <span style={{ fontSize: '12px' }}>▼</span>
          </MonthTitle>

          {twoMonthModal && (
            <TwoMonthModal 
              currentDate={currentDate}
              monthNames={monthNames}
              onClose={() => setTwoMonthModal(false)} 
              onPrev={handlePrevMonth}
              onNext={handleNextMonth}/>
          )}

        </MonthWrapper>

        <WeekDays>
          {weekDays.map((day, index) => (
            <WeekDay key={index}>{day}</WeekDay>
          ))}
        </WeekDays>

        <DaysGrid>
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <DayCell
                key={`${weekIndex}-${dayIndex}`}
                isEmpty={day === null}
                isSelected={
                  day !== null &&
                  day === selectedDate.getDate() &&
                  currentDate.getMonth() === selectedDate.getMonth() &&
                  currentDate.getFullYear() === selectedDate.getFullYear()
                }
                onClick={() => {
                  if (day !== null) {
                    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                  }
                }}
              >
                {day}
              </DayCell>
            ))
          )}
        </DaysGrid>
      </>
    )
  }

  const renderMonthsView = () => {
    return (
      <>
        <YearTitle>{currentDate.getFullYear()}</YearTitle>
        <MonthsGrid>
          {monthNames.map((month, index) => (
            <MonthCell key={index} onClick={() => handleMonthSelect(index)}>
              {month.slice(0, 3)}
            </MonthCell>
          ))}
        </MonthsGrid>
      </>
    )
  }

  const renderYearsView = () => {
    const [startYear, endYear] = getYearRange()
    const years = []
    for (let i = startYear; i < endYear; i++) {
      years.push(i)
    }

    return (
      <>
        <YearTitle>
          {startYear}-{endYear - 1}
        </YearTitle>
        <YearsGrid>
          {years.map((year) => (
            <YearCell key={year} onClick={() => handleYearSelect(year)}>
              {year}
            </YearCell>
          ))}
        </YearsGrid>
      </>
    )
  }

  return (
    <CenterContainer>
      <Title>Calendar</Title>

      <MonthSelector>
        <MonthButton onClick={() => setView(view === 'days' ? 'months' : 'years')}>
          {view === 'days' ? 'Month' : view === 'months' ? 'Year' : 'Month'}
          <span>▼</span>
        </MonthButton>
      </MonthSelector>

      <CalendarGrid>
        {view === 'days' && renderDaysView()}
        {view === 'months' && renderMonthsView()}
        {view === 'years' && renderYearsView()}
      </CalendarGrid>
    </CenterContainer>
  )
}

const CenterContainer = styled.div`
  background-color: #111111;
  color: white;
  padding: 40px;
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
  text-align: center;
`;

const MonthSelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;

  transition: transform 0.18s ease, opacity 0.18s ease;

  &:hover{
  transform: scale(1.1);
  }
`;

const MonthWrapper = styled.div`
  position: relative;
  display: inline-block;
`

const MonthButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid #797979;
  border-radius: 8px;
  padding: 8px 24px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #3a3a3a;
    border: 1px solid #797979;
  }
`;

const CalendarGrid = styled.div`
  border: 1px solid #555;
  border-radius: 12px;
  padding: 24px;
  width: 290px;
  margin: 0 auto;
`;

const MonthTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  transition: transform 0.18s ease, opacity 0.18s ease;

  &:active {
    transform: scale(0.96);
    opacity: 0.8;
  }

  &:hover {
    color: #ccc;
    transform: translateY(-5px) scale(1.2);
  }
`;

const YearTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const WeekDay = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999;
  text-transform: lowercase;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

const DayCell = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #555;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  opacity: ${(props) => (props.isEmpty ? 0 : 1)};
  pointer-events: ${(props) => (props.isEmpty ? 'none' : 'auto')};

  transition: all 0.18s ease;

  background-color: ${(props) => (props.isSelected ? '#1e90ff' : 'transparent')};
  color: ${(props) => (props.isSelected ? '#fff' : '#ccc')};
  box-shadow: ${(props) =>
    props.isSelected ? '0 0 12px rgba(30,144,255,0.6)' : 'none'};

  &:hover {
    ${(props) => !props.isEmpty && 'background-color: #898989;'}
    color: #181818;
    transform: scale(1.2) translateY(-5px);
  }
`;

const MonthsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const MonthCell = styled.div`
  aspect-ratio: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #3a3a3a;
    border-color: #797979;
  }
`;

const YearsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const YearCell = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #3a3a3a;
    border-color: #797979;
  }
`;
