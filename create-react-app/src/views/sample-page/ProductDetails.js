import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import { TextField, Button, Snackbar, Alert } from '@mui/material';

const ProductDetails = () => {
  const location = useLocation();
  const { productData } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProductData, setUpdatedProductData] = useState(productData || {});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Update local state when productData changes (after a successful update)
    setUpdatedProductData(productData);
  }, [productData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(`https://3.1.81.96/api/Products/${updatedProductData.productId}`, updatedProductData);
      if (response.status === 200) {
        // Update productData in location state (optional, but recommended)
        location.state.productData = response.data;
        setUpdatedProductData(response.data); // Update local state
        setOpenSnackbar(true);
        setSnackbarMessage('Product updated successfully!');
        setIsEditing(false);
      } else {
        console.error('Error updating product:', response);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (!productData) return <p>Product data not found.</p>;

  return (
    <MainCard title="Product Details">
      <div>
        {/* Conditionally render either text or input fields */}
        {!isEditing ? (
          <>
            <p>Product ID: {productData.productId}</p>
            <p>Category ID: {productData.categoryId}</p>
            <p>Product Name: {productData.productName}</p>
            <p>Product Description: {productData.productDescription}</p>
          </>
        ) : (
          <>
            <TextField
              label="Category ID"
              name="categoryID"
              value={updatedProductData.categoryId}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Product Name"
              name="productName"
              value={updatedProductData.productName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Product Description"
              name="productDescription"
              value={updatedProductData.productDescription}
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
          <Button variant="contained" color="success" onClick={handleUpdateProduct}>
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

export default ProductDetails;
