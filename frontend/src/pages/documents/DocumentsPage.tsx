import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import {
  Box, Container, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip, CircularProgress,
  Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText,
  LinearProgress, Chip
} from '@mui/material';
import {
  Upload as UploadIcon, Delete as DeleteIcon, CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon, CheckCircle as CheckCircleIcon,
  Pending as PendingIcon, Error as ErrorIcon, CloudDone as CloudDoneIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { uploadDocument, listMyDocuments } from '../../services/api';

type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'expired';

interface Document {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  uploadedAt: string;
  file: File | null;
  progress?: number;
}

const DOCUMENT_TYPES = [
  'Aadhaar Card', 'PAN Card', 'Passport', 'Voter ID', 'Driving License',
  '10th Marksheet', '12th Marksheet', 'Graduation Certificate', 'Resume'
];

const DocumentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  
  const [newDocument, setNewDocument] = useState({
    type: '',
    file: null as File | null,
  });
  
  const [errors, setErrors] = useState({
    type: '',
    file: '',
  });
  
  // Load documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const items = await listMyDocuments();
        const mapped: Document[] = items.map((d: any) => ({
          id: String(d.id),
          name: d.file_name,
          type: d.mime_type || 'Document',
          status: (d.status || 'pending') as DocumentStatus,
          uploadedAt: d.uploaded_at,
          file: null,
        }));
        setDocuments(mapped);
      } catch (error) {
        showSnackbar('Failed to load documents', 'error');
      }
    };
    fetchDocuments();
  }, [dispatch]);
  
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: 'File size should be less than 5MB' }));
      return;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        file: 'Only PDF, JPEG, and PNG files are allowed',
      }));
      return;
    }
    
    setNewDocument(prev => ({ ...prev, file }));
    setErrors(prev => ({ ...prev, file: '' }));
  };
  
  const handleUpload = async () => {
    if (!newDocument.type) {
      setErrors(prev => ({ ...prev, type: 'Document type is required' }));
      return;
    }
    if (!newDocument.file) {
      setErrors(prev => ({ ...prev, file: 'Please select a file' }));
      return;
    }
    
    setIsUploading(true);
    
    try {
      if (!newDocument.file) return;
      await uploadDocument(newDocument.file);
      // refresh list
      const items = await listMyDocuments();
      const mapped: Document[] = items.map((d: any) => ({
        id: String(d.id),
        name: d.file_name,
        type: d.mime_type || 'Document',
        status: (d.status || 'pending') as DocumentStatus,
        uploadedAt: d.uploaded_at,
        file: null,
      }));
      setDocuments(mapped);
      handleCloseUploadDialog();
      showSnackbar('Document uploaded successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to upload document', 'error');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = (docId: string) => {
    setDocumentToDelete(docId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (documentToDelete) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete));
      showSnackbar('Document deleted', 'success');
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleCloseUploadDialog = () => {
    setIsUploadDialogOpen(false);
    setNewDocument({ type: '', file: null });
    setErrors({ type: '', file: '' });
  };
  
  const getStatusChip = (status: DocumentStatus) => {
    const statusConfig = {
      approved: { icon: <CheckCircleIcon fontSize="small" />, label: 'Approved', color: 'success' },
      pending: { icon: <PendingIcon fontSize="small" />, label: 'Pending', color: 'info' },
      rejected: { icon: <ErrorIcon fontSize="small" />, label: 'Rejected', color: 'error' },
      expired: { icon: <ErrorIcon fontSize="small" />, label: 'Expired', color: 'warning' },
    }[status];
    
    return (
      <Chip
        icon={statusConfig.icon}
        label={statusConfig.label}
        color={statusConfig.color as any}
        size="small"
        variant="outlined"
      />
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Documents</Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setIsUploadDialogOpen(true)}
        >
          Upload Document
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Uploaded On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {doc.name}
                    </Box>
                    {doc.progress !== undefined && (
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={doc.progress}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{getStatusChip(doc.status)}</TableCell>
                  <TableCell>{format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View">
                        <IconButton size="small" color="primary">
                          <DescriptionIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton size="small" color="primary">
                          <CloudDoneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(doc.id)}
                          disabled={isUploading}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal" error={!!errors.type}>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={newDocument.type}
                label="Document Type"
                onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                disabled={isUploading}
              >
                <MenuItem value="">Select document type</MenuItem>
                {DOCUMENT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
            
            <Box
              sx={{
                mt: 3,
                mb: 2,
                p: 4,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
              }}
              onClick={() => document.getElementById('document-upload')?.click()}
            >
              <input
                type="file"
                id="document-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography>
                {newDocument.file ? newDocument.file.name : 'Click to select or drag a file'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                PDF, JPG, or PNG (max 5MB)
              </Typography>
              {errors.file && (
                <Typography color="error" variant="caption" display="block">
                  {errors.file}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseUploadDialog} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={isUploading || !newDocument.file || !newDocument.type}
            startIcon={isUploading ? <CircularProgress size={20} /> : null}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this document? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DocumentsPage;
