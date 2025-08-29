import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiPlus, FiAlertCircle, FiClock, FiCheckCircle, FiArchive, FiRotateCcw
} from 'react-icons/fi'
import StatCard from '../components/dashboard/StatCard'
import Button from '../components/common/Button'
import TicketList from '../components/tickets/TicketList'
import { getTickets, getdashboarddata } from '../services/api'
import { useAuth } from '../context/AuthContext'
import dayjs from 'dayjs'

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const Title = styled.h1`
  margin: 0;
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
`

const DateFilter = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`

const SectionTitle = styled.h2`
  margin-bottom: 16px;
  color: var(--color-text-primary);
`

const DashboardPage = () => {
  const { isAgent } = useAuth()
  const navigate = useNavigate()

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusCounts, setStatusCounts] = useState({})

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
console.log(startDate,endDate)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [dashboardRes, ticketsRes] = await Promise.all([
          getdashboarddata(startDate, endDate),
          getTickets(startDate, endDate, 1, 5,'',1),
        ])
        setStatusCounts(dashboardRes?.data?.overall || {})
        setTickets(ticketsRes?.data?.tickets || [])
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  const {
    open = 0,
    in_progress = 0,
    resolved = 0,
    closed = 0,
    reopen = 0,
  } = statusCounts

  const total = open + in_progress + resolved + closed + reopen

  return (
    <div>
      <DashboardHeader>
        <Title>Dashboard</Title>
        {isAgent && (
          <Button as={Link} to="/tickets/create">
            <FiPlus size={18} />
            Create Ticket
          </Button>
        )}
      </DashboardHeader>

      <DateFilter>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          max={new Date(endDate).toISOString().split('T')[0]}
        />
        <input
          type="date"
          value={endDate}
          min={new Date(startDate).toISOString().split('T')[0]}
          onChange={e => setEndDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
      </DateFilter>

      <StatsContainer>
      <StatCard title="Tickets Raised" value={total} color="var(--color-text-primary)" />
        <StatCard title="Open Tickets" value={open} color="var(--color-primary)" icon={<FiAlertCircle />} />
        <StatCard title="In Progress" value={in_progress} color="var(--color-warning)" icon={<FiClock />} />
        <StatCard title="Resolved" value={resolved} color="var(--color-success)" icon={<FiCheckCircle />} />
        {/* <StatCard title="Closed" value={closed} color="var(--color-muted)" icon={<FiArchive />} /> */}
        <StatCard title="Reopened" value={reopen} color="var(--color-secondary)" icon={<FiRotateCcw />} />
        
      </StatsContainer>

      <div>
        <SectionTitle>Recent Tickets</SectionTitle>
        <TicketList
          tickets={tickets}
          isLoading={loading}
          onCreateClick={() => navigate('/tickets/create')}
        />

        {tickets?.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button as={Link} to="/tickets" variant="outline">
              View All Tickets
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
