import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, AddCircleOutlined } from '@mui/icons-material';

const MyProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // new state for categories
  const [categoryMap, setCategoryMap] = useState({}); // new state for categoryMap
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    categoryId: '',
    productName: '',
    productDescription: ''
  });
  const navigate = useNavigate();

  const handleAddProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('https://3.1.81.96/api/Products', newProduct);

      if (response.status === 201) {
        // Successfully created new product
        setNewProduct({ categoryId: '', productName: '', productDescription: '' }); // Reset form fields
        setShowAddDialog(false);
        fetchProducts(); // Refresh product list
        setOpenSnackbar(true);
        setSnackbarMessage('Product added successfully!');
      } else {
        console.error('Error creating product:', response);
        setError(response.data?.error || response.statusText); // Show error message from backend
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError('An error occurred while creating the product.');
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch categories and filter by brandId = 2
      const [categoryResponse, productResponse] = await Promise.all([
        axios.get('https://3.1.81.96/api/Categories?pageNumber=1&pageSize=1000'), // Get all categories
        axios.get('https://3.1.81.96/api/Products?pageNumber=1&pageSize=1000') // Fetch all products
      ]);

      // Create a map of category IDs to category names
      const categoryMap = {};
      categoryResponse.data.forEach((category) => {
        categoryMap[category.categoryId] = category.categoryName;
      });
      setCategoryMap(categoryMap);
      setCategories(categoryResponse.data); // Assuming your API returns an array of user objects

      // Filter products by brand ID
      const filteredProducts = productResponse.data.filter((product) => {
        const brandId = localStorage.getItem('brandId');
        // Get the category for this product
        const category = categoryResponse.data.find((c) => c.categoryId === product.categoryId);
        return category.brandId === Number(brandId);
      });
      setProducts(filteredProducts);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data.'); // Set error message
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const brandId = localStorage.getItem('brandId');
      const categoryResponse = await axios.get(`https://3.1.81.96/api/Categories?brandId=${brandId}`);
      setCategories(categoryResponse.data);
      // setFilteredCategories(categoryResponse.data); // Initialize filteredCategories with all categories for this brand
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'An error occurred while fetching categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleViewDetails = (product) => {
    navigate('/my-product-details', { state: { productData: product } });
  };

  // ... existing functions (handleViewDetails, getRoleName) ...

  return (
    <MainCard title={<Typography variant="h5">Product Table</Typography>}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => setShowAddDialog(true)} startIcon={<AddCircleOutlined />}>
            Add Product
          </Button>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : products.length === 0 ? (
            <Typography variant="body1">No products found.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {/* Table Headers (add new Category column) */}
                    <TableCell>Product Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                {/* Table Rows (Dynamically Rendered) */}
                <TableBody>
                  {products.map((product) => {
                    const categoryName = categoryMap[product.categoryId] || 'Unknown Category';
                    return (
                      <TableRow key={product.productId} hover onClick={() => handleViewDetails(product)}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{product.productDescription}</TableCell>

                        {/* Display Category Name */}
                        <TableCell>{categoryName}</TableCell>

                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<Edit />}
                            sx={{
                              color: 'primary.main',
                              borderColor: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.light'
                              }
                            }}
                            onClick={(event) => {
                              event.stopPropagation(); // Prevent the row from being clicked
                              // handleEdit(product.productId);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                            sx={{
                              color: 'error.main',
                              borderColor: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.light'
                              }
                            }}
                            onClick={(event) => {
                              event.stopPropagation(); // Prevent the row from being clicked
                              // handleDelete(product.productId);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={snackbarMessage ? 'success' : 'error'}>{snackbarMessage}</Alert>
      </Snackbar>

      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the details of the new product.</DialogContentText>
          <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              name="categoryId"
              value={newProduct.categoryId}
              onChange={handleAddProductChange}
              label="Category"
            >
              {categories
                .filter((category) => category.brandId === Number(localStorage.getItem('brandId')))
                .map((category) => (
                  <MenuItem key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="productName"
            label="Product Name"
            type="text"
            fullWidth
            variant="standard"
            value={newProduct.productName}
            onChange={handleAddProductChange}
          />
          <TextField
            margin="dense"
            name="productDescription"
            label="Product Description"
            type="text"
            fullWidth
            variant="standard"
            value={newProduct.productDescription}
            onChange={handleAddProductChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddProduct} variant="contained">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default MyProduct;
