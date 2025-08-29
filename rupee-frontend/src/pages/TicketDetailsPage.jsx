import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import styled from 'styled-components'
import { toast } from 'react-fox-toast'
import { FiArrowLeft } from 'react-icons/fi'
import Button from '../components/common/Button'
import TicketDetails from '../components/tickets/TicketDetails'

import { addTicketReply, changeTicketStatus, getTicketReplyById } from '../services/api'
import { setLoading } from '../store/slices/userSlice'

const PageHeader = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
`

const Title = styled.h1`
  margin: 0;
`

const TicketDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket,setticket]=useState(null);
  const [isLoading,setloading]=useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
  

  
async function fetchticket (){
  
  const response = await getTicketReplyById(id);
  setticket(response?.ticket)
}

  useEffect(() => {
     fetchticket();
  }, [id])
  

  
  const handleReply = async(replyData) => {
    try {
      setLoading(true)
      let res=await addTicketReply(id,replyData);

      console.log(res)
       if(res?.status=='success'){
          toast?.success(res?.message);
          fetchticket();
          setLoading(false)
       }
       else {
        setLoading(false)
        toast?.error(res?.error)
       }

    } catch (error) {
      setLoading(false)
       console.log(error)
    }

  }

  

  
  const handleClose = () => {
  
  }
  
  const handleReopen = () => {
  
  }
  const queryString = searchParams.toString();
  
  return (
    <div>
      <PageHeader>
        <Button
          variant="text"
          onClick={() => navigate(`/tickets?${queryString}`)}
        >
          <FiArrowLeft size={18} />
        </Button>
        <Title>Ticket Details</Title>
      </PageHeader>
      
      <TicketDetails
        ticket={ticket}
        onReply={handleReply}
        
        onClose={handleClose}
        onReopen={handleReopen}
        isLoading={isLoading}
      />
    </div>
  )
}

export default TicketDetailsPage