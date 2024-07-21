import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';

const UtilitiesShadow = () => {
  const [storeData, setStoreData] = useState([]);
  const [, setBrandData] = useState([]); // State to store brand data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAddStoreDialog, setShowAddStoreDialog] = useState(false);
  const navigate = useNavigate();
  const [newStoreData, setNewStoreData] = useState({
    brandID: '',
    storeLocation: '',
    storeContactEmail: '',
    storeContactNumber: ''
  });
  const handleAddStore = async () => {
    try {
      const response = await axios.post('https://3.1.81.96/api/Stores', newStoreData);

      if (response.status === 201) {
        // Successfully created new store

        // Reset the form
        setNewStoreData({
          brandID: '',
          storeLocation: '',
          storeContactEmail: '',
          storeContactNumber: ''
        });
        setShowAddStoreDialog(false);

        // Fetch the updated store data after adding
        const updatedResponse = await axios.get('https://3.1.81.96/api/Stores?pageNumber=1&pageSize=10');
        setStoreData(updatedResponse.data); // Update the state with the new data

        setOpenSnackbar(true);
        setSnackbarMessage('Store added successfully!');
      } else {
        console.error('Error creating store:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating store:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewStoreData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCloseAddStoreDialog = () => {
    setShowAddStoreDialog(false);
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      setIsLoading(true);
      try {
        const [storeResponse, brandResponse] = await Promise.all([
          axios.get('https://3.1.81.96/api/Stores'),
          axios.get('https://3.1.81.96/api/Brands?') // Replace with your brand API endpoint
        ]);

        // Map brand names to stores
        const storeDataWithBrandNames = storeResponse.data.map((store) => ({
          ...store,
          brandName: brandResponse.data.find((brand) => brand.brandID === store.brandID)?.brandName || 'Unknown Brand'
        }));
        setStoreData(storeDataWithBrandNames);
        setBrandData(brandResponse.data); // Store brand data for future use
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  const handleDelete = async (storeId) => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/Stores?storeId=${storeId}`);

      if (response.status === 200) {
        // Successfully deleted the store
        setStoreData(storeData.filter((store) => store.storeID !== storeId)); // Update storeData locally
        setOpenSnackbar(true);
        setSnackbarMessage('Store deleted successfully!');
      } else {
        console.error('Error deleting store:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const handleViewDetails = (store) => {
    navigate('/store-details', { state: { storeData: store } }); // Pass store data as state
  };

  return (
    <div>
      <MainCard title="Store Table">
        <Button variant="contained" onClick={() => setShowAddStoreDialog(true)}>
          Add Store
        </Button>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Brand Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {storeData.map((store) => (
                  <TableRow key={store.storeID}>
                    <TableCell>{store.brandName}</TableCell>
                    <TableCell>{store.storeLocation}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" size="small" onClick={() => handleDelete(store.storeID)}>
                        Delete
                      </Button>
                      <Button variant="contained" size="small" onClick={() => handleViewDetails(store)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Dialog
          open={showAddStoreDialog}
          onClose={handleCloseAddStoreDialog}
          aria-labelledby="add-store-dialog-title"
          aria-describedby="add-store-dialog-description"
        >
          <DialogTitle id="add-store-dialog-title">Add New Store</DialogTitle>
          <DialogContent>
            <DialogContentText id="add-store-dialog-description">Please enter the details of the new store.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="brandID"
              label="Brand ID"
              type="text"
              fullWidth
              variant="standard"
              value={newStoreData.brandID}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="storeLocation"
              label="Store Location"
              type="text"
              fullWidth
              variant="standard"
              value={newStoreData.storeLocation}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="storeContactEmail"
              label="Store Contact Email"
              type="email"
              fullWidth
              variant="standard"
              value={newStoreData.storeContactEmail}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="storeContactNumber"
              label="Store Contact Number"
              type="text"
              fullWidth
              variant="standard"
              value={newStoreData.storeContactNumber}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddStoreDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleAddStore}>
              Add Store
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarMessage ? 'success' : 'error'}>{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  );
};

export default UtilitiesShadow;
