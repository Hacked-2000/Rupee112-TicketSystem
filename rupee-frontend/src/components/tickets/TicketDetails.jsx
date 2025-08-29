import styled from 'styled-components'
import { format } from 'date-fns'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { FiPaperclip, FiMessageSquare, FiLock, FiRefreshCw } from 'react-icons/fi'
import { useState } from 'react'
import Textarea from '../common/Textarea'
import { useAuth } from '../../context/AuthContext'
import { changeTicketStatus } from '../../services/api'
import { toast } from 'react-fox-toast'
import LoadingSpinner from '../common/LoadingSpinner'
import { setLoading } from '../../store/slices/userSlice'

const TicketContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
`

const TicketHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
`

const TicketTitle = styled.h2`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`

const TicketMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 16px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const MetaLabel = styled.span`
  font-weight: 500;
  color: var(--color-text-tertiary);
  font-size: 0.75rem;
`

const TicketBody = styled.div`
  padding: 24px;
`

const TicketDescription = styled.div`
  line-height: 1.6;
  margin-bottom: 24px;
  white-space: pre-wrap;
`

// const AttachmentList = styled.div`
//   margin-top: 16px;
//   display: flex;
//   flex-wrap: wrap;
//   gap: 8px;
// `

// const Attachment = styled.a`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   padding: 8px 12px;
//   background-color: var(--color-background);
//   border-radius: var(--border-radius-sm);
//   color: var(--color-primary);
//   font-size: 0.875rem;
//   transition: all 0.3s ease;
  
//   &:hover {
//     background-color: rgba(0, 71, 171, 0.1);
//   }
// `

const Replies = styled.div`
  margin-top: 32px;
  padding: 24px;
  background: #f9f9fb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`

const ReplyList = styled.div`
  margin-top: 16px;
`

const Reply = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.07);
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.01);
  }
`

const ReplyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: #6b7280;
`

const ReplyAuthor = styled.span`
  font-weight: 600;
  color: #111827;
`

const ReplyDate = styled.span`
  color: #9ca3af;
  font-size: 0.8rem;
`

const ReplyContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
  color: #374151;
  font-size: 0.95rem;
  margin-top: 4px;
`

const ReplyForm = styled.div`
  margin-top: 32px;
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
`

const AttachmentList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const Attachment = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  background-color: #f3f4f6;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #2563eb;
  text-decoration: none;
  transition: background 0.2s;
  &:hover {
    background-color: #e0e7ff;
  }
  svg {
    margin-right: 6px;
  }
`

const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  input {
    display: none;
  }
`


const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`

const TicketDetails = ({ ticket, onReply, onClose, onReopen, isLoading, location }) => {
  const [reply, setReply] = useState('')
  const [attachments, setAttachments] = useState(null)
  const { currentUser, isSupport } = useAuth()
  const [loading,setloading]=useState(false)
  
  if (!ticket) {
    return <LoadingSpinner/>
  }
  
  const handleFileChange = (e) => {
    setAttachments(e.target.files)
  }
  
  const handleReply = () => {
    if (!reply.trim()) return
    
    const replyData = {
      message: reply,
      user_id: currentUser.id,
      attachments: attachments ? Array.from(attachments) : [],
      ticket_id:ticket?.id
    }
    
    
    onReply(replyData)
    setReply('')
    setAttachments(null)
  }
   const handleResolve = async(status) => {
      setloading(true)
      try {

        let data={
          ticket_id:ticket?.id,
          new_status:status,
          updated_by:currentUser.id
        }
         let res=await changeTicketStatus(data);
         console.log(res?.status)
         if(res?.status=='success'){
          setloading(false)
            toast?.success(res?.message);
            fetchticket();
         }
         else {
          setloading(false)
          toast?.error(res?.error)
         }
      } catch (error) {
        console.log(error)
        setloading(false)
      }
    }


  
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
  console.log(ticket)
  
  return (
    <div>
      <TicketContainer>
        <TicketHeader>
          <TicketTitle>
            #{ticket.id} {ticket.title}
            {getStatusBadge(ticket.status)}
          </TicketTitle>
          
          <TicketMeta>
            <MetaItem>
              <MetaLabel>Created By</MetaLabel>
              {ticket.user_name|| 'Unknown'}
            </MetaItem>
            
            <MetaItem>
              <MetaLabel>Created At</MetaLabel>
              {format(new Date(ticket.created_at), 'MMM dd, yyyy HH:mm')}
            </MetaItem>
            
            <MetaItem>
              <MetaLabel>Last Updated</MetaLabel>
              {format(new Date(ticket.updated_at), 'MMM dd, yyyy HH:mm')}
            </MetaItem>
            
            <MetaItem>
              <MetaLabel>Assigned To</MetaLabel>
              {ticket.allocated_name || 'Not assigned'}
            </MetaItem>
          </TicketMeta>
        </TicketHeader>
        
        <TicketBody>
          <TicketDescription>
            {ticket.description}
          </TicketDescription>
          
          {ticket.attachments && ticket.attachments.length > 0 && (
            <>
              <h4>Attachments</h4>
              <AttachmentList>
                {JSON.parse(ticket.attachments).map((attachment, index) => (
                  <Attachment 
                    key={index} 
                    href={attachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FiPaperclip size={16} />
                    {attachment.name}
                  </Attachment>
                ))}
              </AttachmentList>
            </>
          )}
        </TicketBody>
      </TicketContainer>
      
      <Replies>
        <h3>Replies</h3>
        
        <ReplyList>
          {ticket.replies && ticket.replies.length > 0 ? (
            ticket.replies.map(reply => (
              <Reply key={reply.id}>
                <ReplyHeader>
                  <ReplyAuthor>{reply.user_name || 'Unknown'}</ReplyAuthor>
                  <ReplyDate>{format(new Date(reply.created_at), 'MMM dd, yyyy HH:mm')}</ReplyDate>
                </ReplyHeader>
                <ReplyContent>{reply.message}</ReplyContent>
                
                {reply.attachments && reply.attachments.length > 0 && (
                  <AttachmentList>
                    {JSON.parse(reply.attachments).map((attachment, index) => (
                      <Attachment 
                        key={index} 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FiPaperclip size={16} />
                        {attachment.name}
                      </Attachment>
                    ))}
                  </AttachmentList>
                )}
              </Reply>
            ))
          ) : (
            <p>No replies yet.</p>
          )}
        </ReplyList>
        
        <ReplyForm>
          <h4>Add Reply</h4>
          <Textarea
            placeholder="Write your reply here..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
          />
          
          <FileInputLabel>
            <FiPaperclip size={18} />
            Attach Files (optional)
            <input
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </FileInputLabel>
          
          {attachments && Array.from(attachments).map((file, index) => (
            <div key={index}>{file.name}</div>
          ))}
          
         {!loading ? <ButtonGroup>
           {!isLoading ? <Button 
              onClick={handleReply} 
              disabled={!reply.trim() || isLoading}
            >
              <FiMessageSquare size={16} />
              Submit Reply
            </Button>:<LoadingSpinner/>}
            
            {isSupport && (
              <>
                {ticket.status === 'in_progress' && (
                   <Button 
                   variant="danger" 
                   onClick={()=>{handleResolve('resolved')}}
                   disabled={isLoading}
                 >
                    Mark as Resolved
                  </Button> 
                )}
                
                {/* {ticket.status !== 'resolved' && (
                  <Button 
                    variant="danger" 
                    onClick={()=>{handleResolve('resolved')}}
                    disabled={isLoading}
                  >
                    <FiLock size={16} />
                    Close Ticket
                  </Button>
                )} */}
                
                {ticket.status === 'resolved' && (
                  <Button 
                    variant="primary" 
                    onClick={()=>{handleResolve('reopen')}}
                    disabled={isLoading}
                  >
                    <FiRefreshCw size={16} />
                    Reopen Ticket
                  </Button>
                )}
              </>
            )}
          </ButtonGroup>:<LoadingSpinner/>}
        </ReplyForm>
      </Replies>
    </div>
  )
}

export default TicketDetails