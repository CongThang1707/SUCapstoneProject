import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AddCircleOutlined, Visibility, Delete } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';

const UtilitiesBrand = () => {
  const [brandData, setBrandData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAddBrandDialog, setShowAddBrandDialog] = useState(false);
  // const navigate = useNavigate();
  const [newBrandData, setNewBrandData] = useState({
    brandName: '',
    brandDescription: '',
    brandImage: '',
    brandContactEmail: ''
  });
  const [filter, setFilter] = useState('');

  const handleAddBrand = async () => {
    try {
      const response = await axios.post('https://3.1.81.96/api/Brands', newBrandData);
      if (response.status === 201) {
        // Successfully created new brand
        setNewBrandData({
          brandName: '',
          brandDescription: '',
          brandImage: '',
          brandContactEmail: ''
        });
        setShowAddBrandDialog(false);
        // Fetch the updated brand data after adding
        const updatedResponse = await axios.get('https://3.1.81.96/api/Brands?pageNumber=1&pageSize=10');
        setBrandData(updatedResponse.data);
        setOpenSnackbar(true);
        setSnackbarMessage('Brand added successfully!');
      } else {
        console.error('Error creating brand:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating brand:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBrandData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCloseAddBrandDialog = () => {
    setShowAddBrandDialog(false);
  };

  useEffect(() => {
    const fetchBrandData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://3.1.81.96/api/Brands?pageNumber=1&pageSize=10');
        setBrandData(response.data);
      } catch (error) {
        console.error('Error fetching brand data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrandData();
  }, []);

  const handleDeleteBrand = async (brandId) => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/Brands/${brandId}`);
      if (response.status === 200) {
        // Successfully deleted brand
        setBrandData(brandData.filter((brand) => brand.brandID !== brandId));
        setOpenSnackbar(true);
        setSnackbarMessage('Brand deleted successfully!');
      } else {
        console.error('Error deleting brand:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const filteredBrandData = brandData.filter((brand) => {
    return (
      brand.brandName.toLowerCase().includes(filter.toLowerCase()) || brand.brandContactEmail.toLowerCase().includes(filter.toLowerCase())
    );
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={<Typography variant="h5">Brand Table</Typography>}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
              <TextField
                label="Search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowAddBrandDialog(true)}
                startIcon={<AddCircleOutlined />}
                sx={{ borderRadius: 2, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                size="small"
              >
                Add Brand
              </Button>
            </Box>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </div>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 450, overflowY: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Brand Name</TableCell>
                      <TableCell>Brand Logo</TableCell>
                      <TableCell>Brand Contact</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBrandData.map((brand) => (
                      <TableRow key={brand.brandID}>
                        <TableCell>{brand.brandName}</TableCell>
                        <TableCell>
                          <Avatar
                            alt={brand.brandName || 'Unknown Brand'}
                            src={brand.brandImage}
                            sx={{ width: 56, height: 56 }} // Adjust size as needed
                          />
                        </TableCell>
                        <TableCell>{brand.brandContactEmail}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteBrand(brand.brandID)}
                              startIcon={<Delete />} // Add delete icon
                            >
                              Delete
                            </Button>
                            <Button
                              variant="outlined"
                              color="info"
                              size="small"
                              onClick={() => handleViewDetails(brand)}
                              startIcon={<Visibility />} // Add view details icon
                            >
                              View Details
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </MainCard>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarMessage ? 'success' : 'error'}>{snackbarMessage}</Alert>
      </Snackbar>
      <Dialog open={showAddBrandDialog} onClose={handleCloseAddBrandDialog}>
        <DialogTitle id="add-brand-dialog-title">Add New Brand</DialogTitle>
        <DialogContent>
          <DialogContentText id="add-brand-dialog-description">Please enter the details of the new brand.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="brandName"
            label="Brand Name"
            type="text"
            fullWidth
            variant="standard"
            value={newBrandData.brandName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="brandDescription"
            label="Brand Description"
            type="text"
            fullWidth
            variant="standard"
            value={newBrandData.brandDescription}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="brandImage"
            label="Brand Logo URL"
            type="text"
            fullWidth
            variant="standard"
            value={newBrandData.brandImage}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ImageIcon />
                </InputAdornment>
              )
            }}
          />
          <TextField
            margin="dense"
            name="brandContactEmail"
            label="Brand Contact Email"
            type="text"
            fullWidth
            variant="standard"
            value={newBrandData.brandContactEmail}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddBrandDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddBrand}>
            Add Brand
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UtilitiesBrand;
