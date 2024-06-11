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

const UtilitiesProduct = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const navigate = useNavigate();
  const [newProductData, setNewProductData] = useState({
    brandID: '',
    categoryID: '',
    productName: '',
    productDescription: '',
    productPrice: ''
  });

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('https://3.1.81.96/api/Product', newProductData);
      if (response.status === 201) {
        // Successfully created new product
        setNewProductData({
          brandID: '',
          categoryID: '',
          productName: '',
          productDescription: '',
          productPrice: ''
        });
        setShowAddProductDialog(false);

        // Fetch the updated product data after adding
        const updatedResponse = await axios.get('https://3.1.81.96/api/Product?pageNumber=1&pageSize=10');
        setProductData(updatedResponse.data); // Update the state with the new data

        setOpenSnackbar(true);
        setSnackbarMessage('Product added successfully!');
      } else {
        console.error('Error creating product:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewProductData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCloseAddProductDialog = () => {
    setShowAddProductDialog(false);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://3.1.81.96/api/Product?pageNumber=1&pageSize=10');
        setProductData(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/Product?productId=${productId}`);
      if (response.status === 200) {
        // Successfully deleted product
        setProductData(productData.filter((product) => product.productID !== productId));
        setOpenSnackbar(true);
        setSnackbarMessage('Product deleted successfully!');
      } else {
        console.error('Error deleting product:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const handleViewDetails = (product) => {
    navigate('/product-details', { state: { productData: product } });
  };

  return (
    <div>
      <MainCard title="Products">
        <Button variant="contained" onClick={() => setShowAddProductDialog(true)}>
          Add Product
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
                  <TableCell>Brand ID</TableCell>
                  <TableCell>Category ID</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Product Description</TableCell>
                  <TableCell>Product Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productData.map((product) => (
                  <TableRow key={product.productID}>
                    <TableCell>{product.brandID}</TableCell>
                    <TableCell>{product.categoryID}</TableCell>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.productDescription}</TableCell>
                    <TableCell>{product.productPrice}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" size="small" onClick={() => handleDelete(product.productID)}>
                        Delete
                      </Button>
                      <Button variant="contained" size="small" onClick={() => handleViewDetails(product)}>
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
          open={showAddProductDialog}
          onClose={handleCloseAddProductDialog}
          aria-labelledby="add-store-dialog-title"
          aria-describedby="add-store-dialog-description"
        >
          <DialogTitle id="add-store-dialog-title">Add New Product</DialogTitle>
          <DialogContent>
            <DialogContentText id="add-store-dialog-description">Please enter the details of the new product.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="brandID"
              label="Brand ID"
              type="text"
              fullWidth
              variant="standard"
              value={newProductData.brandID}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="categoryID"
              label="Category ID"
              type="text"
              fullWidth
              variant="standard"
              value={newProductData.categoryID}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="productName"
              label="Product Name"
              type="text"
              fullWidth
              variant="standard"
              value={newProductData.productName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="productDescription"
              label="Product Description"
              type="text"
              fullWidth
              variant="standard"
              value={newProductData.productDescription}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="productPrice"
              label="Product Price"
              type="text"
              fullWidth
              variant="standard"
              value={newProductData.productPrice}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddProductDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleAddProduct}>
              Add Product
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

export default UtilitiesProduct;
