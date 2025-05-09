import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Link,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Stack
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import GavelIcon from '@mui/icons-material/Gavel';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HistoryIcon from '@mui/icons-material/History';
import { fetchCitation } from '../services/citationService';

/**
 * Component to display citation references with interactive features
 */
const CitationDisplay = ({ citations = [] }) => {
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [citationDetails, setCitationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  // Group citations by act
  const groupedCitations = useMemo(() => {
    const groups = {};
    citations.forEach(citation => {
      if (!groups[citation.actName]) {
        groups[citation.actName] = [];
      }
      groups[citation.actName].push(citation);
    });
    return groups;
  }, [citations]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCitationClick = useCallback(async (citation) => {
    setSelectedCitation(citation);
    setLoading(true);
    setActiveTab(0);
    
    try {
      // In a real implementation, you would use actual IDs from your API
      const actId = encodeURIComponent(citation.actName);
      const sectionId = encodeURIComponent(citation.sectionNumber);
      
      const details = await fetchCitation(actId, sectionId);
      setCitationDetails(details);
    } catch (error) {
      console.error('Error fetching citation details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectedCitation(null);
    setCitationDetails(null);
    setCopySuccess(false);
  }, []);

  const handleCopyText = useCallback(() => {
    if (citationDetails) {
      navigator.clipboard.writeText(citationDetails.text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [citationDetails]);

  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <>
      <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <GavelIcon fontSize="small" sx={{ mr: 0.5 }} />
          Legal Citations:
        </Typography>
        
        {Object.entries(groupedCitations).map(([actName, actCitations]) => (
          <Box key={actName} sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {actName}:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {actCitations.map((citation, index) => (
                <Chip
                  key={citation.id || index}
                  label={`Section ${citation.sectionNumber} ${citation.markerText}`}
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleCitationClick(citation)}
                  clickable
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Box>

      <Dialog 
        open={Boolean(selectedCitation)} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Legal Citation</Typography>
            <IconButton onClick={handleClose} size="small" aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        {selectedCitation && (
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            centered
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Citation Details" icon={<MenuBookIcon />} iconPosition="start" />
            <Tab label="Legal Context" icon={<GavelIcon />} iconPosition="start" />
            <Tab label="Amendment History" icon={<HistoryIcon />} iconPosition="start" />
          </Tabs>
        )}

        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : citationDetails ? (
            <>
              {activeTab === 0 && (
                <>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6">{citationDetails.actName}</Typography>
                    <Typography variant="subtitle1">
                      Section {citationDetails.sectionNumber}, {citationDetails.year}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                      <Tooltip title={copySuccess ? "Copied!" : "Copy text"}>
                        <IconButton size="small" onClick={handleCopyText} color={copySuccess ? "success" : "default"}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Open source">
                        <IconButton 
                          size="small" 
                          component={Link}
                          href={citationDetails.url}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                  
                  <Typography variant="body1" paragraph>
                    {citationDetails.text}
                  </Typography>
                </>
              )}
              
              {activeTab === 1 && (
                <Box sx={{ p: 1 }}>
                  <Typography variant="h6" gutterBottom>Legal Context</Typography>
                  <Typography variant="body2" paragraph>
                    This section should be interpreted in conjunction with other relevant provisions of {citationDetails.actName} 
                    and Supreme Court judgments that have interpreted this section.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Related Sections:</Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                    {[1, 2, 3].map(i => (
                      <Chip 
                        key={i} 
                        label={`Section ${parseInt(citationDetails.sectionNumber) + i}`}
                        variant="outlined" 
                        size="small" 
                        clickable
                      />
                    ))}
                  </Stack>
                  
                  <Typography variant="subtitle2" gutterBottom>Key Supreme Court Judgments:</Typography>
                  <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                    <Typography variant="body2">
                      <strong>State of Maharashtra vs. Xyz (2018)</strong> - Supreme Court interpretation of this section.
                    </Typography>
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="body2">
                      <strong>Abc vs. Union of India (2015)</strong> - Constitutional validity of this provision.
                    </Typography>
                  </Paper>
                </Box>
              )}
              
              {activeTab === 2 && (
                <Box sx={{ p: 1 }}>
                  <Typography variant="h6" gutterBottom>Amendment History</Typography>
                  <Typography variant="body2" paragraph>
                    Tracking changes to this section over time:
                  </Typography>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">Original Text (1950)</Typography>
                      <Chip label="Original" size="small" color="primary" variant="outlined" />
                    </Box>
                    <Typography variant="body2">
                      Original text of the section as enacted.
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">Amendment (2008)</Typography>
                      <Chip label="Amended" size="small" color="secondary" variant="outlined" />
                    </Box>
                    <Typography variant="body2">
                      Text after the 2008 amendment.
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">Current Text</Typography>
                      <Chip label="Current" size="small" color="success" variant="outlined" />
                    </Box>
                    <Typography variant="body2">
                      {citationDetails.text}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </>
          ) : selectedCitation ? (
            <Typography variant="body1" color="text.secondary">
              Could not retrieve citation details for {selectedCitation.actName}, Section {selectedCitation.sectionNumber}.
            </Typography>
          ) : null}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {citationDetails && (
            <Button 
              component="a" 
              href={citationDetails.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              endIcon={<OpenInNewIcon />}
            >
              View Official Text
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CitationDisplay;
