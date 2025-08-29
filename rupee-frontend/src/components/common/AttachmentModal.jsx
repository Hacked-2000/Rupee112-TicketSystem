import React from 'react'
import styled from 'styled-components'
import Button from '../common/Button'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`

const ModalTitle = styled.h3`
  margin: 0 0 16px;
`

const AttachmentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
`

const AttachmentItem = styled.li`
  margin: 8px 0;
  word-break: break-word;
`

const CloseButton = styled(Button)`
  margin-top: 8px;
`

const AttachmentsModal = ({ isOpen, onClose, attachments }) => {
  if (!isOpen) return null
  console.log(attachments);
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>Attachments</ModalTitle>
        {attachments && attachments.length > 0 ? (
          <AttachmentList>
            {attachments.map((attachment, index) => (
              <AttachmentItem key={index}>
                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                  {attachment.name || `Attachment ${index + 1}`}
                </a>
              </AttachmentItem>
            ))}
          </AttachmentList>
        ) : (
          <p>No attachments available.</p>
        )}
        <CloseButton onClick={onClose}>Close</CloseButton>
      </ModalContent>
    </ModalOverlay>
  )
}

export default AttachmentsModal

