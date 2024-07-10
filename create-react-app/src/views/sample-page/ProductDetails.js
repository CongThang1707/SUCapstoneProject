import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Stack,
  Divider,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Import Edit Icon
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const ProductDetails = () => {
  const location = useLocation();
  const { productData } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProductData, setUpdatedProductData] = useState(productData || {});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [productSizePrices, setProductSizePrices] = useState([]);
  const [editingSizePrice, setEditingSizePrice] = useState(null);

  useEffect(() => {
    // Update local state when productData changes (after a successful update)
    setUpdatedProductData(productData);
    if (productData?.productId) {
      // Check if productId is available
      const fetchProductSizePrices = async () => {
        try {
          const response = await axios.get(`https://3.1.81.96/api/ProductSizePrices?productId=${productData.productId}`); // Filter by productId
          setProductSizePrices(response.data);
        } catch (error) {
          console.error('Error fetching product size prices:', error);
        }
      };

      if (productData?.productId) {
        fetchProductSizePrices();
      }
    }
  }, [productData]);

  const getProductSizeType = (sizeType) => {
    switch (sizeType) {
      case 0:
        return 'S';
      case 1:
        return 'M';
      case 2:
        return 'L';
      default:
        return 'Unknown';
    }
  };

  const filteredProductSizePrices = productSizePrices.filter((sizePrice) => sizePrice.productId === productData.productId);

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

  const handleDeleteSizePrice = async (sizePriceId) => {
    // Implement your delete size price logic here
    // For example:
    try {
      const response = await axios.delete(`https://3.1.81.96/api/ProductSizePrices/${sizePriceId}`);
      if (response.status === 200) {
        setProductSizePrices((prevPrices) => prevPrices.filter((p) => p.productSizePriceId !== sizePriceId));
        setOpenSnackbar(true);
        setSnackbarMessage('Size price deleted successfully!');
      } else {
        console.error('Error deleting size price:', response);
        // Set error message in snackbar
      }
    } catch (error) {
      console.error('Error deleting size price:', error);
      // Set error message in snackbar
    }
  };

  const handleEditSizePrice = (sizePrice) => {
    setEditingSizePrice(sizePrice);
  };

  const handleCancelEdit = () => {
    setEditingSizePrice(null);
  };

  const handleSaveSizePrice = async () => {
    try {
      const response = await axios.put(
        `https://3.1.81.96/api/ProductSizePrices/${editingSizePrice.productSizePriceId}`,
        {
          productSizeType: editingSizePrice.productSizeType,
          price: editingSizePrice.price
        } // Use the correct request body format
      );

      if (response.status === 200) {
        setProductSizePrices((prevPrices) =>
          prevPrices.map((sizePrice) => (sizePrice.productSizePriceId === editingSizePrice.productSizePriceId ? response.data : sizePrice))
        );
        setOpenSnackbar(true);
        setSnackbarMessage('Size price updated successfully!');
      } else {
        console.error('Error updating size price:', response);
        // Set error message in snackbar
      }
    } catch (error) {
      console.error('Error updating size price:', error);
      // Set error message in snackbar
    } finally {
      setEditingSizePrice(null); // Exit edit mode
    }
  };

  return (
    <MainCard title={<Typography variant="h5">Product Details</Typography>}>
      <Stack spacing={2}>
        {/* Conditionally render either text or input fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Product ID:
            </Typography>
            <Typography variant="body1">{productData.productId}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Category ID:
            </Typography>
            <Typography variant="body1">{productData.categoryId || 'Unknown Category'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Product Name:
            </Typography>
            <Typography variant="body1">{productData.productName}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Product Description:
            </Typography>
            <Typography variant="body1">{productData.productDescription}</Typography>
          </Box>
          <Button variant="outlined" color="primary" onClick={() => setIsEditing(true)} startIcon={<EditIcon />}>
            Update
          </Button>
          <Divider sx={{ my: 2 }} /> {/* Add a divider */}
          <Typography variant="h6">Size Prices:</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="size prices table">
              <TableHead>
                <TableRow>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProductSizePrices
                  .sort((a, b) => a.productSizeType - b.productSizeType) // Sort by size type
                  .map((sizePrice) => (
                    <TableRow key={sizePrice.productSizePriceId}>
                      <TableCell>{getProductSizeType(sizePrice.productSizeType)}</TableCell>
                      <TableCell align="right">
                        {editingSizePrice?.productSizePriceId === sizePrice.productSizePriceId ? (
                          <TextField
                            type="number"
                            value={editingSizePrice.price} // Use editingSizePrice.price
                            onChange={(e) => setEditingSizePrice({ ...editingSizePrice, price: e.target.value })}
                            autoFocus
                            onBlur={handleSaveSizePrice}
                          />
                        ) : (
                          `$${sizePrice.price}`
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {editingSizePrice?.productSizePriceId === sizePrice.productSizePriceId ? ( // Check if editingSizePrice exists
                          <IconButton onClick={handleCancelEdit} color="primary">
                            <CloseIcon />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => handleEditSizePrice(sizePrice)} color="primary">
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton onClick={() => handleDeleteSizePrice(sizePrice.productSizePriceId)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!isEditing && filteredProductSizePrices.length === 0 && <p>No size prices found</p>}
        </Box>

        {/* Update and Cancel buttons */}
        {/* Update Dialog */}
        <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
          <DialogTitle>Update Product</DialogTitle>
          <DialogContent>
            <DialogContentText>Make changes to the product details:</DialogContentText>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditing(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} color="primary" variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
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
