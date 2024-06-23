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
  TextField,
  CircularProgress,
  InputAdornment,
  Box,
  Typography,
  Grid // Import additional components
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AddCircleOutlined, Visibility, Delete } from '@mui/icons-material';

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
  const [filter, setFilter] = useState('');

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
      setError(null); // Reset error state before fetching

      try {
        const [productResponse, brandResponse, categoryResponse] = await Promise.all([
          axios.get('https://3.1.81.96/api/Product?pageNumber=1&pageSize=10'),
          axios.get('https://3.1.81.96/api/Brand?pageNumber=1&pageSize=10'),
          axios.get('https://3.1.81.96/api/Category?pageNumber=1&pageSize=10') // Replace with your category API endpoint
        ]);
        const updatedProductData = productResponse.data.map((product) => ({
          ...product,
          brandName: brandResponse.data.find((brand) => brand.brandID === product.brandID)?.brandName || 'Unknown Brand',
          categoryName:
            categoryResponse.data.find((category) => category.categoryID === product.categoryID)?.categoryName || 'Unknown Category'
        }));

        setProductData(updatedProductData);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError(error.message); // Store only the error message, not the entire object
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

  const filteredProductData = productData.filter((product) => {
    const productNameMatch = product.productName.toLowerCase().includes(filter.toLowerCase());
    const categoryIdMatch = product.categoryName.toLowerCase().includes(filter.toLowerCase()); // Convert categoryID to string for matching
    const brandNameMatch = product.brandName.toLowerCase().includes(filter.toLowerCase());
    return productNameMatch || categoryIdMatch || brandNameMatch;
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={<Typography variant="h5">Product Table</Typography>}>
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
                onClick={() => setShowAddProductDialog(true)}
                startIcon={<AddCircleOutlined />}
                sx={{
                  borderRadius: 2, // Round the button corners
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' // Add a subtle shadow
                }}
                size="small"
              >
                Add Product
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
                      <TableCell>Product Name</TableCell>
                      <TableCell>Category ID</TableCell>
                      <TableCell>Brand Name</TableCell>
                      <TableCell>Product Price</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProductData.map((product) => (
                      <TableRow key={product.productID}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{product.categoryName}</TableCell>
                        <TableCell>{product.brandName}</TableCell>
                        <TableCell>{product.productPrice}</TableCell>
                        <TableCell sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(product.productID)}
                            startIcon={<Delete />} // Add delete icon
                            sx={{
                              color: 'error.main', // Ensure text color matches even when hovered
                              borderColor: 'error.main', // Ensure border color matches even when hovered
                              '&:hover': {
                                backgroundColor: 'error.light' // Lighten background on hover
                              }
                            }}
                          >
                            Delete
                          </Button>

                          <Button
                            variant="outlined"
                            color="info"
                            size="small"
                            onClick={() => handleViewDetails(product)}
                            startIcon={<Visibility />} // Add view details icon
                            sx={{
                              color: 'info.main',
                              borderColor: 'info.main',
                              '&:hover': {
                                backgroundColor: 'info.light'
                              }
                            }}
                          >
                            View Details
                          </Button>
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
    </Box>
  );
};

export default UtilitiesProduct;
