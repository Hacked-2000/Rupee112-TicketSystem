import { Link, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { format } from 'date-fns'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { FiEye } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { FaPaperclip } from 'react-icons/fa';

import { useState } from 'react'
import AttachmentsModal from '../common/AttachmentModal'
import { selfallocateticket } from '../../services/api'
import { toast } from 'react-fox-toast'

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 24px;
`

const TableHead = styled.thead`
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
`

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`

const TableBody = styled.tbody`
  background-color: var(--color-surface);
`

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  [data-theme='dark'] &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`

const TableCell = styled.td`
  padding: 16px;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
`

const ActionButton = styled(Button)`
  padding: 6px 12px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
`

const EmptyStateTitle = styled.h3`
  margin-bottom: 8px;
  color: var(--color-text-secondary);
`

const EmptyStateText = styled.p`
  color: var(--color-text-tertiary);
  margin-bottom: 24px;
`

const getStatusBadge = (status) => {
  if(status){
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge variant="primary">Open</Badge>
      case 'in progress':
        return <Badge variant="warning">In Progress</Badge>
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>
      case 'closed':
        return <Badge variant="neutral">Closed</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

}

const TicketList = ({ tickets, isLoading, onCreateClick,fetchTickets, createTicketLink }) => {
  const { isManager, isAgent } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAttachments, setSelectedAttachments] = useState([]);
      const [searchParams, setSearchParams] = useSearchParams();
  
 const {currentUser}=useAuth()
 
  const handleViewAttachments = (attachments) => {
    // Parse the JSON string to an array
    const parsedAttachments = JSON.parse(attachments);
    setSelectedAttachments(parsedAttachments);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAttachments([])
  }

  async function handleSelfAllocate(id){
    try {
      let data={
        ticket_id:id,
        user_id:currentUser?.id
      }
      const res=await selfallocateticket(data);
      if(res?.status=='success'){
        toast?.success(res?.message)
        fetchTickets()
      }
      else{
        toast?.error(res?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) {
    return <p>Loading tickets...</p>
  }
  
  if (!tickets || tickets.length === 0) {
    return (
      <EmptyState>
        <EmptyStateTitle>No Tickets Found</EmptyStateTitle>
        <EmptyStateText>There are no tickets to display at this time.</EmptyStateText>
        {(isManager || isAgent) && (
          <Button onClick={onCreateClick}>Create Ticket</Button>
        )}
      </EmptyState>
    )
  }
  const queryString = searchParams.toString();

  
  return (
    <>
      <Table>
        <TableHead>
          <tr>
            <TableHeader>TicketID</TableHeader>
            <TableHeader>Title</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>RaisedBy</TableHeader>
            <TableHeader>Raised On</TableHeader>
            <TableHeader>Allocated To</TableHeader>
            <TableHeader>Attachments</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {tickets.map((ticket, index) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket?.id}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>{getStatusBadge(ticket?.status)}</TableCell>
              <TableCell>{ticket?.user_name}</TableCell>
              <TableCell>{format(new Date(ticket.created_at), 'MMM dd, yyyy')}</TableCell>
             
              <TableCell>
                {console.log(currentUser)}
  {['open', 'reopen'].includes(ticket.status) && currentUser?.role_id === 1 ? (
    <button
      onClick={() => handleSelfAllocate(ticket.id)}
      className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
    >
      Self Allocate
    </button>
  ) : (
    ticket?.allocated_name || 'Unallocated'
  )}
</TableCell>

              

<TableCell>
  
  {JSON.parse(ticket.attachments).length > 0 ? (
   <span style={{cursor:'pointer'}}>  <FaPaperclip  onClick={() => handleViewAttachments(ticket.attachments)} />View</span>
  
  ) : (
    <span>
       No Attachments
    </span>
  )}
</TableCell>

              <TableCell>
                <ActionButton 
                  as={Link}
                  to={`/tickets/${ticket.id}?${queryString}`}
                  size="small"
                  variant="outline"
                >
                  <FiEye size={14} />
                  View
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AttachmentsModal
        isOpen={isModalOpen} 
        onClose={closeModal} 
        attachments={selectedAttachments} 
      />
    </>
  )
}

export default TicketList
