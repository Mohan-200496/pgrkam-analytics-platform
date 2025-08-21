import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { API_BASE_URL } from '../../../config';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Tabs, Tab, Button, Chip, Avatar,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, TextField, Divider, LinearProgress, Alert, Snackbar
} from '@mui/material';
import {
  CheckCircle as ApproveIcon, Cancel as RejectIcon, Visibility as ViewIcon,
  Download as DownloadIcon, Refresh as RefreshIcon, ArrowBack as BackIcon,
  Close as CloseIcon, Error as ErrorIcon, Warning as WarningIcon
} from '@mui/icons-material';

type DocumentStatus = 'pending' | 'approved' | 'rejected';

interface Document {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: string;
  status: DocumentStatus;
  uploadedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  fileSize: string;
}

const DocumentVerificationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // State
  const [activeTab, setActiveTab] = useState<DocumentStatus>('pending');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Load documents based on active tab
  useEffect(() => {
    fetchDocuments(activeTab);
  }, [activeTab]);
  
  // Fetch documents from API
  const fetchDocuments = async (status: DocumentStatus) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/documents/admin${status ? `?status_filter=${status}` : ''}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      } else {
        throw new Error('Failed to load');
      }
    } catch (error) {
      showSnackbar('Failed to load documents', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: DocumentStatus) => {
    setActiveTab(newValue);
  };
  
  // Open document viewer
  const handleViewDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setIsViewerOpen(true);
  };
  
  // Close document viewer
  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedDoc(null);
  };
  
  // Approve document
  const handleApprove = async () => {
    if (!selectedDoc) return;
    
    setIsProcessing(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${selectedDoc.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      if (!res.ok) throw new Error('Verify failed');
      
      // Update document status
      const updatedDocs = documents.map(doc => 
        doc.id === selectedDoc.id 
          ? { 
              ...doc, 
              status: 'approved',
              reviewedBy: user?.full_name || 'Admin',
              reviewedAt: new Date().toISOString(),
              rejectionReason: undefined
            } 
          : doc
      );
      
      setDocuments(updatedDocs.filter(doc => doc.status === activeTab));
      showSnackbar('Document approved successfully', 'success');
      handleCloseViewer();
    } catch (error) {
      showSnackbar('Failed to approve document', 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Reject document
  const handleReject = async () => {
    if (!selectedDoc || !rejectionReason) return;
    
    setIsProcessing(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${selectedDoc.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      if (!res.ok) throw new Error('Reject failed');
      
      // Update document status
      const updatedDocs = documents.map(doc => 
        doc.id === selectedDoc.id 
          ? { 
              ...doc, 
              status: 'rejected',
              reviewedBy: user?.full_name || 'Admin',
              reviewedAt: new Date().toISOString(),
              rejectionReason
            } 
          : doc
      );
      
      setDocuments(updatedDocs.filter(doc => doc.status === activeTab));
      showSnackbar('Document rejected', 'success');
      setShowRejectDialog(false);
      handleCloseViewer();
      setRejectionReason('');
    } catch (error) {
      showSnackbar('Failed to reject document', 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Download document
  const handleDownload = () => {
    if (!selectedDoc) return;
    
    // In a real app, this would trigger a download
    const link = document.createElement('a');
    link.href = selectedDoc.fileUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Show snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Get status chip
  const getStatusChip = (status: DocumentStatus) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'warning' as const },
      approved: { label: 'Approved', color: 'success' as const },
      rejected: { label: 'Rejected', color: 'error' as const },
    };
    
    const config = statusConfig[status];
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/admin')} sx={{ mr: 1 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4">Document Verification</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => fetchDocuments(activeTab)}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>
      
      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 1, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Pending Review</span>
                {documents.length > 0 && (
                  <Chip 
                    label={documents.length} 
                    size="small" 
                    color="warning"
                    sx={{ minWidth: 24, height: 24 }}
                  />
                )}
              </Box>
            } 
            value="pending" 
          />
          <Tab label="Approved" value="approved" />
          <Tab label="Rejected" value="rejected" />
        </Tabs>
      </Paper>
      
      {/* Documents List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ maxWidth: 400, mx: 'auto', py: 4 }}>
            <ErrorIcon color="action" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No {activeTab} documents found
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
              {activeTab === 'pending' 
                ? 'All documents have been reviewed.' 
                : `No documents have been ${activeTab} yet.`}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => fetchDocuments(activeTab)}
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {documents.map((doc) => (
            <Paper key={doc.id} sx={{ p: 2, '&:hover': { bgcolor: 'action.hover' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {doc.type.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" noWrap>{doc.type}</Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {doc.userName} • {doc.userEmail}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip 
                      label={doc.fileType.toUpperCase()} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={doc.fileSize} 
                      size="small" 
                      variant="outlined"
                    />
                    {getStatusChip(doc.status)}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="View Document">
                    <IconButton onClick={() => handleViewDocument(doc)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton onClick={() => {
                      setSelectedDoc(doc);
                      handleDownload();
                    }}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  Uploaded: {formatDate(doc.uploadedAt)}
                </Typography>
                {doc.reviewedAt && (
                  <Typography variant="caption" color="textSecondary">
                    {doc.status === 'approved' ? 'Approved' : 'Rejected'} by {doc.reviewedBy} on {formatDate(doc.reviewedAt)}
                  </Typography>
                )}
              </Box>
              {doc.rejectionReason && (
                <Alert 
                  severity="error" 
                  icon={<WarningIcon />}
                  sx={{ mt: 1 }}
                >
                  <Typography variant="body2">
                    <strong>Reason for rejection:</strong> {doc.rejectionReason}
                  </Typography>
                </Alert>
              )}
            </Paper>
          ))}
        </Box>
      )}
      
      {/* Document Viewer Modal */}
      <Dialog
        open={isViewerOpen}
        onClose={handleCloseViewer}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{selectedDoc?.type}</Typography>
            {selectedDoc && getStatusChip(selectedDoc.status)}
          </Box>
          <IconButton onClick={handleCloseViewer}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
          {selectedDoc?.fileType === 'pdf' ? (
            <iframe 
              src={selectedDoc?.fileUrl} 
              title={selectedDoc?.type}
              style={{ 
                flexGrow: 1, 
                width: '100%', 
                border: 'none',
                backgroundColor: '#f5f5f5',
              }}
            />
          ) : (
            <Box 
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                p: 2,
                overflow: 'auto',
              }}
            >
              <img 
                src={selectedDoc?.fileUrl} 
                alt={selectedDoc?.type}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
          
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>Document Details</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
              <div>
                <Typography variant="caption" color="textSecondary">User</Typography>
                <Typography>{selectedDoc?.userName}</Typography>
              </div>
              <div>
                <Typography variant="caption" color="textSecondary">Email</Typography>
                <Typography>{selectedDoc?.userEmail}</Typography>
              </div>
              <div>
                <Typography variant="caption" color="textSecondary">Uploaded</Typography>
                <Typography>{selectedDoc ? formatDate(selectedDoc.uploadedAt) : ''}</Typography>
              </div>
              <div>
                <Typography variant="caption" color="textSecondary">File Type</Typography>
                <Typography>{selectedDoc?.fileType.toUpperCase()}</Typography>
              </div>
              <div>
                <Typography variant="caption" color="textSecondary">File Size</Typography>
                <Typography>{selectedDoc?.fileSize}</Typography>
              </div>
              {selectedDoc?.reviewedAt && (
                <div>
                  <Typography variant="caption" color="textSecondary">
                    {selectedDoc.status === 'approved' ? 'Approved' : 'Rejected'} By
                  </Typography>
                  <Typography>
                    {selectedDoc.reviewedBy} on {formatDate(selectedDoc.reviewedAt)}
                  </Typography>
                </div>
              )}
            </Box>
            
            {selectedDoc?.rejectionReason && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Reason for rejection:</strong> {selectedDoc.rejectionReason}
                </Typography>
              </Alert>
            )}
            
            {selectedDoc?.status === 'pending' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isProcessing}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ApproveIcon />}
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  Approve
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Reject Document Dialog */}
      <Dialog
        open={showRejectDialog}
        onClose={() => !isProcessing && setShowRejectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Document</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for rejecting this document. This will be shared with the user.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            disabled={isProcessing}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowRejectDialog(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={!rejectionReason.trim() || isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <RejectIcon />}
          >
            {isProcessing ? 'Rejecting...' : 'Reject Document'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DocumentVerificationPage;
