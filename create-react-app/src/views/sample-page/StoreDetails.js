import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import { TextField, Button, Snackbar, Alert } from '@mui/material';

const StoreDetails = () => {
  const location = useLocation();
  const { storeData } = location.state || {};

  const [isEditing, setIsEditing] = useState(false);
  const [updatedStoreData, setUpdatedStoreData] = useState(storeData || {});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Update local state when storeData changes (after a successful update)
    setUpdatedStoreData(storeData);
  }, [storeData]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedStoreData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateStore = async () => {
    try {
      const response = await axios.put(`https://3.1.81.96/api/Stores?storeId=${updatedStoreData.storeID}`, updatedStoreData);
      if (response.status === 200) {
        // Update storeData in location state (optional, but recommended)
        location.state.storeData = response.data;
        setUpdatedStoreData(response.data); // Update local state
        setOpenSnackbar(true);
        setSnackbarMessage('Store updated successfully!');
        setIsEditing(false);
      } else {
        console.error('Error updating store:', response);
      }
    } catch (error) {
      console.error('Error updating store:', error);
    }
  };

  if (!storeData) return <p>Store data not found.</p>;

  return (
    <MainCard title="Store Details">
      <div>
        {/* Conditionally render either text or input fields */}
        {!isEditing ? (
          <>
            <p>Store ID: {storeData.storeID}</p>
            <p>Brand ID: {storeData.brandID}</p>
            <p>Brand Name: {storeData.brandName}</p>
            <p>Location: {storeData.storeLocation}</p>
            <p>Contact Email: {storeData.storeContactEmail}</p>
            <p>Contact Number: {storeData.storeContactNumber}</p>
          </>
        ) : (
          <>
            <TextField
              label="Location"
              name="storeLocation"
              value={updatedStoreData.storeLocation}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact Email"
              name="storeContactEmail"
              value={updatedStoreData.storeContactEmail}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact Number"
              name="storeContactNumber"
              value={updatedStoreData.storeContactNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        )}

        {/* Update and Cancel buttons */}
        <Button variant="contained" color="primary" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Update'}
        </Button>

        {isEditing && (
          <Button variant="contained" color="success" onClick={handleUpdateStore}>
            Save Changes
          </Button>
        )}
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarMessage ? 'success' : 'error'}>{snackbarMessage}</Alert>
      </Snackbar>
    </MainCard>
  );
};

export default StoreDetails;
