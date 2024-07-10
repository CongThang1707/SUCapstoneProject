import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AddCircleOutlined, Visibility } from '@mui/icons-material';

const EntityTemplate = () => {
  const [templateData, setTemplateData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(''); // New state for search filter
  const navigate = useNavigate();

  const handleViewDetails = (template) => {
    navigate('/template-details', { state: { templateData: template } });
  };

  useEffect(() => {
    const fetchTemplateData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://3.1.81.96/api/Templates?pageNumber=1&pageSize=10');
        setTemplateData(response.data);
      } catch (error) {
        console.error('Error fetching brand data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplateData();
  }, []);

  const filteredTemplates = templateData.filter((template) => template.templateName.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={<Typography variant="h5">Templates</Typography>}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{
                  width: '500px',
                  mr: 60, // Set a fixed width (adjust as needed)
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    paddingRight: 1
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowAddProductDialog(true)}
                startIcon={<AddCircleOutlined />}
                sx={{
                  borderRadius: 2,
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2, // Increase horizontal padding further
                  py: 1.5,
                  whiteSpace: 'nowrap' // Prevent text from wrapping
                }}
                size="small"
              >
                Add Template
              </Button>
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Grid container spacing={3}>
                {filteredTemplates.map(
                  (
                    template // Use filtered data
                  ) => (
                    <Grid item xs={12} sm={6} md={4} key={template.templateId}>
                      <Card sx={{ border: 1, borderColor: 'divider' }}>
                        {/* Optional: Display an image */}
                        {template.templateImgPath && (
                          <CardMedia component="img" height="200" image={template.templateImgPath} alt={template.templateName} />
                        )}
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {template.templateName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {template.templateWidth} : {template.templateHeight}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" onClick={() => handleViewDetails(template)} startIcon={<Visibility />}>
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>
            )}
          </MainCard>
        </Grid>
      </Grid>

      {/* ... (your existing Snackbar and Dialog) ... */}
    </Box>
  );
};

export default EntityTemplate;
