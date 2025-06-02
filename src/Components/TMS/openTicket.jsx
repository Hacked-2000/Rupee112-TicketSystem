import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, isValid } from "date-fns";
import DOMPurify from "dompurify";

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
  Grid,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  AttachFile,
  Send,
  CheckCircle,
  Refresh,
  InsertDriveFile,
  Reply,
} from "@mui/icons-material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTicketReplies,
  addTicketReply,
  changeTicketStatus,
} from "../../Store/Reducers/tmsSlice";

const statusColors = {
  open: "warning",
  in_progress: "info",
  resolved: "success",
  closed: "error",
  reopened: "primary",
  default: "default",
};

const getStatusBadge = (status) => {
  if (!status) return null;
  const statusLabel = status.toString().replace("_", " ");
  return (
    <Chip
      label={statusLabel}
      color={statusColors[status] || "default"}
      size="small"
      sx={{ ml: 1, textTransform: "capitalize" }}
    />
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy HH:mm") : "N/A";
  } catch {
    return "N/A";
  }
};

const ticket_idReply = ({ isSupport = false }) => {
  const [replyText, setReplyText] = React.useState("");
  const [attachments, setAttachments] = React.useState([]);
  const dispatch = useDispatch();
  const {
    replies = [],
    loading,
    currentTicket,
  } = useSelector((state) => state.tms);
  // const { replies, loading } = useSelector((state) => {state.tms.replies});
  const auth = useSelector((state) => state.auth);
  const userId = auth?.user?.protected?.user?.id;
  const { ticket_id } = useParams();

  console.log(replies);

  useEffect(() => {
    if (ticket_id) {
      dispatch(fetchTicketReplies(ticket_id));
    }
  }, [dispatch, ticket_id]);

  const handleFileUpload = (e) => {
    setAttachments([...e.target.files]);
  };

  const handleReply = () => {
    if (!replyText.trim() || !ticket_id) return;

    const formData = new FormData();
    formData.append("message", replyText);
    formData.append("ticket_id", ticket_id);
    formData.append("user_id", userId);

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    dispatch(
      addTicketReply({
        ticket_id: ticket_id,
        data: formData,
      })
    ).then(() => {
      setReplyText("");
      setAttachments([]);
      dispatch(fetchTicketReplies(ticket_id));
    });
  };

  const handleResolve = (action) => {
    const statusData = {
      ticket_id: ticket_id,
      status: action === "resolved" ? "resolved" : "reopened",
    };
    dispatch(changeTicketStatus(statusData));
  };
  // for not getting html tag in response in CKEditor
  function stripHTML(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = DOMPurify.sanitize(html); // Optional: remove dangerous HTML
    return tmp.textContent || tmp.innerText || "";
  }

  const renderReplies = () => {
    // const parseAttachments = (attachmentsStr) => {
    //   try {
    //     const parsed = JSON.parse(attachmentsStr);
    //     return Array.isArray(parsed) ? parsed : [];
    //   } catch {
    //     return [];
    //   }
    // };
    const conversation = [
      {
        id: ticket_id,
        user_name: replies?.user_name,
        message: replies?.description,
        created_at: replies?.created_at,
        is_description: true,
        attachments: attachments ? Array.from(attachments) : [],
      },
      ...(replies?.replies || []),
    ];

    return conversation.map((item, index) => (
      <React.Fragment key={item.id || index}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar>{item.user_name?.charAt(0) || "U"}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <Typography variant="subtitle1" component="span">
                  {item.user_name || "Unknown"}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  {formatDate(item.created_at)}
                </Typography>
                {item.is_description && (
                  <Chip
                    label="Original Message"
                    size="small"
                    color="info"
                    sx={{ ml: 1 }}
                  />
                )}
              </>
            }
            secondary={
              <>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ mt: 1, whiteSpace: "pre-line" }}
                >
                  {item.message}
                </Typography>
                {item.attachments && item.attachments.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {JSON.parse(item.attachments).map((attachment, idx) => (
                      <Button
                        key={idx}
                        variant="outlined"
                        startIcon={<InsertDriveFile />}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      >
                        {attachment.name || "Attachment"}
                      </Button>
                    ))}
                  </Box>
                )}
              </>
            }
          />
        </ListItem>
        {index < conversation.length - 1 && (
          <Divider variant="inset" component="li" sx={{ ml: 6 }} />
        )}
      </React.Fragment>
    ));
  };

  const wordCount = replyText ? replyText.split(/\s+/).length : 0;

  if (!ticket_id) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="div">
          #{ticket_id} {replies.title}
          {getStatusBadge(replies.status)}
        </Typography>

        {isSupport && (
          <Stack direction="row" spacing={2}>
            {replies.status === "in_progress" && (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleResolve("resolved")}
                disabled={loading}
              >
                Mark Resolved
              </Button>
            )}
            {(replies.status === "resolved" || replies.status === "closed") && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Refresh />}
                onClick={() => handleResolve("reopen")}
                disabled={loading}
              >
                Reopen ticket_id
              </Button>
            )}
          </Stack>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created By
            </Typography>
            <Typography variant="body1">
              {replies.user_name || "Unknown"}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1">
              {formatDate(replies.created_at)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body1">
              {formatDate(replies.updated_at)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Assigned To
            </Typography>
            <Typography variant="body1">
              {replies.allocated_name || "Not assigned"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Conversation
      </Typography>
      <Paper elevation={2} sx={{ mb: 4 }}>
        <List>{renderReplies()}</List>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Add Reply
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <CKEditor
          editor={ClassicEditor}
          data={replyText}
          onChange={(event, editor) => {
            const htmlData = editor.getData();
            const plainText = stripHTML(htmlData); // remove tags
            setReplyText(plainText); // save plain text only
          }}
          config={{
            toolbar: [
              "bold",
              "italic",
              "underline",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "blockQuote",
              "link",
              "code",
              "|",
              "undo",
              "redo",
            ],
            removePlugins: ["Heading"],
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Button
            component="label"
            startIcon={<AttachFile />}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Attach Files
            <input type="file" hidden multiple onChange={handleFileUpload} />
          </Button>
          <Typography variant="caption" color="text.secondary">
            {attachments.length > 0
              ? `${attachments.length} files selected`
              : "No files attached"}
          </Typography>
        </Box>

        {attachments.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {attachments.map((file, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{ display: "block" }}
              >
                • {file.name}
              </Typography>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {wordCount} words
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={
              loading ? (
                <Refresh sx={{ animation: "spin 2s linear infinite" }} />
              ) : (
                <Send />
              )
            }
            onClick={handleReply}
            disabled={!replyText.trim() || loading}
            sx={{ textTransform: "none", minWidth: 150 }}
          >
            {loading ? "Submitting..." : "Submit Reply"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ticket_idReply;
