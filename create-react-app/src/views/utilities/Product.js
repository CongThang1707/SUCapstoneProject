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
  Grid
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
    categoryId: '',
    productName: '',
    productDescription: ''
  });
  const [filter, setFilter] = useState('');
  const [categoryMap, setCategoryMap] = useState({});

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('https://3.1.81.96/api/Products', newProductData);
      if (response.status === 201) {
        // Successfully created new product
        setNewProductData({
          brandID: '',
          categoryID: '',
          productName: '',
          productDescription: ''
        });
        setShowAddProductDialog(false);

        // Fetch updated product and category data
        const [updatedProductResponse, categoryResponse] = await Promise.all([
          axios.get('https://3.1.81.96/api/Products?pageNumber=1&pageSize=100'),
          axios.get('https://3.1.81.96/api/Categories?pageNumber=1&pageSize=100')
        ]);

        if (!updatedProductResponse.data || !categoryResponse.data) {
          throw new Error('Missing data from API response');
        }

        const updatedProductData = updatedProductResponse.data.map((product) => ({
          ...product,
          categoryName: categoryResponse.data.find((c) => c.categoryId === product.categoryId)?.categoryName || 'Unknown Category'
        }));

        setProductData(updatedProductData);

        setOpenSnackbar(true);
        setSnackbarMessage('Product added successfully!');
      } else {
        console.error('Error creating product:', response);
        // Check if the backend sent a specific error message
        const errorMessage = response.data?.error || response.statusText;
        setError(errorMessage); // Set the error message for display
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError(`An error occurred: ${error.message}`); // Display a generic error message
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
        const [productResponse, categoryResponse] = await Promise.all([
          axios.get('https://3.1.81.96/api/Products?pageNumber=1&pageSize=100'),
          axios.get('https://3.1.81.96/api/Categories?pageNumber=1&pageSize=100')
        ]);

        if (!productResponse.data || !categoryResponse.data) {
          throw new Error('Missing data from API response');
        }

        // Create a map of categoryId to categoryName (correct property name)
        const categoryMap = {};
        categoryResponse.data.forEach((category) => {
          categoryMap[category.categoryId] = category.categoryName; // Use categoryId here
        });
        setCategoryMap(categoryMap);

        setProductData(productResponse.data); // Don't need to map category name here anymore
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/Products/${productId}`);
      if (response.status === 200) {
        // Successfully deleted product
        setProductData(productData.filter((product) => product.productId !== productId));
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
    const productNameMatch = product.productName?.toLowerCase().includes(filter.toLowerCase());
    const categoryIdMatch = product.categoryName?.toLowerCase().includes(filter.toLowerCase());
    return productNameMatch || categoryIdMatch;
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={<Typography variant="h5">Product Table</Typography>}>
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
                      <TableCell>Category</TableCell>
                      <TableCell>Actions</TableCell> {/* Removed Brand Name column */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProductData.map((product) => (
                      <TableRow key={product.productID}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{categoryMap[product.categoryId] || 'Unknown Category'}</TableCell>
                        <TableCell sx={{ display: 'flex', gap: 1 }}>
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
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(product.productId)}
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
            margin="dense"
            name="categoryId"
            label="Category ID"
            type="text"
            fullWidth
            variant="standard"
            value={newProductData.categoryId}
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
