import { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { format, subDays } from 'date-fns'
import { utils, writeFile } from 'xlsx'
import { FiDownload } from 'react-icons/fi'
import Button from '../components/common/Button'
import Select from '../components/common/Select'
import { getTickets } from '../services/tickets'
import { getUsers } from '../services/users'

const PageHeader = styled.div`
  margin-bottom: 24px;
`

const Title = styled.h1`
  margin-bottom: 8px;
`

const Description = styled.p`
  color: var(--color-text-secondary);
`

const ReportSection = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 24px;
  margin-bottom: 24px;
`

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const ReportTitle = styled.h2`
  margin: 0;
`

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`

const FilterGroup = styled.div`
  flex: 1;
  max-width: 200px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 16px;
`

const TableHead = styled.thead`
  background-color: var(--color-background);
`

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`

const TableBody = styled.tbody``

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-border);
  
  &:hover {
    background-color: var(--color-background);
  }
`

const TableCell = styled.td`
  padding: 12px 16px;
  color: var(--color-text-primary);
`

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState('7days')
  
  // Fetch all tickets
  const { data: ticketsData } = useQuery(['tickets', 1, 1000], () => 
    getTickets(1, 1000)
  )
  
  // Fetch all users
  const { data: usersData } = useQuery(['users', 1, 1000], () => 
    getUsers(1, 1000)
  )
  
  const tickets = ticketsData?.data?.data || []
  const users = usersData?.data?.users || []
  
  // Filter tickets by date range
  const getDateRange = () => {
    const now = new Date()
    switch (timeRange) {
      case '7days':
        return subDays(now, 7)
      case '30days':
        return subDays(now, 30)
      case '90days':
        return subDays(now, 90)
      default:
        return new Date(0)
    }
  }
  
  const filteredTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.created_at)
    return ticketDate >= getDateRange()
  })
  
  // Calculate performance metrics
  const calculatePerformanceMetrics = () => {
    const metrics = {}
    
    // Get support and agent users
    const supportStaff = users.filter(user => 
      user.role_id === 3 || user.role_id === 4
    )
    
    supportStaff.forEach(staff => {
      metrics[staff.id] = {
        name: staff.name,
        role: staff.role_id === 3 ? 'Support' : 'Agent',
        ticketsCreated: 0,
        ticketsResolved: 0,
        totalReplies: 0,
        averageResponseTime: 0,
        responseTimeSum: 0,
        responseCount: 0
      }
    })
    
    filteredTickets.forEach(ticket => {
      // Count tickets created by agents
      if (metrics[ticket.created_by]) {
        metrics[ticket.created_by].ticketsCreated++
      }
      
      // Count resolved tickets and replies for support staff
      if (metrics[ticket.assigned_to]) {
        if (ticket.status === 'resolved') {
          metrics[ticket.assigned_to].ticketsResolved++
        }
        
        // Count replies and calculate response times
        if (ticket.replies && ticket.replies.length > 0) {
          const staffReplies = ticket.replies.filter(reply => 
            reply.user_id === ticket.assigned_to
          )
          
          metrics[ticket.assigned_to].totalReplies += staffReplies.length
          
          // Calculate response time for first reply
          if (staffReplies.length > 0) {
            const firstReplyTime = new Date(staffReplies[0].created_at)
            const ticketCreationTime = new Date(ticket.created_at)
            const responseTime = (firstReplyTime - ticketCreationTime) / (1000 * 60 * 60) // hours
            
            metrics[ticket.assigned_to].responseTimeSum += responseTime
            metrics[ticket.assigned_to].responseCount++
          }
        }
      }
    })
    
    // Calculate average response times
    Object.values(metrics).forEach(metric => {
      metric.averageResponseTime = metric.responseCount > 0
        ? (metric.responseTimeSum / metric.responseCount).toFixed(2)
        : 0
    })
    
    return metrics
  }
  
  const performanceMetrics = calculatePerformanceMetrics()
  
  // Export to Excel
  const exportToExcel = () => {
    const exportData = Object.values(performanceMetrics).map(metric => ({
      'Name': metric.name,
      'Role': metric.role,
      'Tickets Created': metric.ticketsCreated,
      'Tickets Resolved': metric.ticketsResolved,
      'Total Replies': metric.totalReplies,
      'Average Response Time (hours)': metric.averageResponseTime
    }))
    
    const ws = utils.json_to_sheet(exportData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Performance Report')
    
    writeFile(wb, `performance_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }
  
  return (
    <div>
      <PageHeader>
        <Title>Staff Performance Reports</Title>
        <Description>View detailed performance metrics for support staff and agents</Description>
      </PageHeader>
      
      <ReportSection>
        <ReportHeader>
          <ReportTitle>Performance Metrics</ReportTitle>
          <Button onClick={exportToExcel}>
            <FiDownload size={18} />
            Export to Excel
          </Button>
        </ReportHeader>
        
        <FiltersContainer>
          <FilterGroup>
            <Select
              id="timeRange"
              label="Time Range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={[
                { value: '7days', label: 'Last 7 Days' },
                { value: '30days', label: 'Last 30 Days' },
                { value: '90days', label: 'Last 90 Days' },
                { value: 'all', label: 'All Time' }
              ]}
            />
          </FilterGroup>
        </FiltersContainer>
        
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Tickets Created</TableHeader>
              <TableHeader>Tickets Resolved</TableHeader>
              <TableHeader>Total Replies</TableHeader>
              <TableHeader>Avg. Response Time (hours)</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {Object.values(performanceMetrics).map(metric => (
              <TableRow key={metric.name}>
                <TableCell>{metric.name}</TableCell>
                <TableCell>{metric.role}</TableCell>
                <TableCell>{metric.ticketsCreated}</TableCell>
                <TableCell>{metric.ticketsResolved}</TableCell>
                <TableCell>{metric.totalReplies}</TableCell>
                <TableCell>{metric.averageResponseTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ReportSection>
    </div>
  )
}

export default ReportsPage