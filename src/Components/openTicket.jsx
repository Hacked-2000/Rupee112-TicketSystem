import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
} from '@mui/material';
import {
  AttachFile,
  Send,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  FormatListBulleted,
  FormatQuote,
  InsertLink,
  FormatColorText,
} from '@mui/icons-material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TicketReply = ({ ticketId }) => {
  const [replyText, setReplyText] = React.useState('');
  const [attachments, setAttachments] = React.useState([]);

  const handleFileUpload = (e) => {
    setAttachments([...e.target.files]);
  };
  const wordCount = replyText ? replyText.split(/\s+/).length : 0;

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Ticket Reply For #{ticketId}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip label="Resolved" color="success" />
          <Button variant="contained" color="primary">
            UPDATE STATUS
          </Button>
        </Box>
      </Box>

      {/* Ticket Title */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Code Coverage
      </Typography>

      {/* Message Thread */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <List>
          {/* Original Message */}
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>VT</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="VAIBHAV TOTLA"
              secondary={
                <>
                  <Typography variant="body2" color="text.primary">
                    Unit test coverage is below the required threshold of 80%.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    DOPS253978874570BFA210654497968APHG
                  </Typography>
                </>
              }
            />
          </ListItem>

          <Divider variant="inset" component="li" sx={{ ml: 4.5 }} />

          {/* Reply Message */}
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>A</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Amit"
              secondary={
                <>
                  <Typography variant="body2" color="text.primary">
                    same has been resolved. Kindly check and update
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    waer[vukgf@hkhi].h.m
                  </Typography>
                </>
              }
            />
          </ListItem>
        </List>
      </Paper>

      {/* Reply Editor */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Write Reply
        </Typography>

        {/* Formatting Toolbar */}
        <CKEditor
          editor={ClassicEditor}
          data={replyText}
          onChange={(event, editor) => {
            const data = editor.getData();
            setReplyText(data);
          }}
          config={{
            toolbar: [
              'bold', 'italic', 'underline', '|',
              'bulletedList', 'numberedList', '|',
              'blockQuote', 'link', 'code', '|',
              'undo', 'redo'
            ],
            removePlugins: ['Heading'],
          }}
        />

        {/* Attachment Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Button
            component="label"
            startIcon={<AttachFile />}
            sx={{ textTransform: 'none' }}
          >
            Attach Files
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileUpload}
            />
          </Button>
          <Typography variant="caption">
            {attachments.length} files attached
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Reply Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant="caption">
            {wordCount} words
          </Typography>
          <Button
            variant="contained"
            endIcon={<Send />}
            sx={{ textTransform: 'none' }}
          >
            REPLY TICKET
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketReply;