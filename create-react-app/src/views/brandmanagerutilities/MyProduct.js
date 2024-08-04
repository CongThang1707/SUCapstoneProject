import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MyProduct = () => {
  const location = useLocation();
  const { state } = location;
  const categoryId = state?.categoryId; // Get categoryId from location state
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productDescription: ''
  });
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});

  const validateNewProductData = () => {
    const errors = {};
    if (!newProduct.productName.trim()) {
      errors.productName = 'Product name is required';
    }
    if (!newProduct.productDescription.trim()) {
      errors.productDescription = 'Product description is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditProductData = () => {
    const errors = {};
    if (!productToEdit.productName.trim()) {
      errors.productName = 'Product name is required';
    }
    if (!productToEdit.productDescription.trim()) {
      errors.productDescription = 'Product description is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (categoryId) {
      const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response = await axios.get('https://3.1.81.96/api/Products', {
            params: {
              pageNumber: 1,
              pageSize: 100, // Adjust pageSize as needed
              categoryId: categoryId // Use categoryId for filtering
            }
          });

          if (!response.data) {
            throw new Error('Missing data from API response');
          }

          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProducts();
    }
  }, [categoryId]);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewProduct({
      productName: '',
      productDescription: ''
    });
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleAddProduct = async () => {
    if (!validateNewProductData()) {
      return;
    }
    try {
      await axios.post('https://3.1.81.96/api/Products', {
        ...newProduct,
        categoryId
      });
      // Fetch the updated list of products
      const response = await axios.get('https://3.1.81.96/api/Products', {
        params: {
          pageNumber: 1,
          pageSize: 100,
          categoryId
        }
      });
      setProducts(response.data);
      handleCloseAddDialog();
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message);
    }
  };

  const handleOpenEditDialog = (product) => {
    setProductToEdit(product);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setProductToEdit(null);
    setOpenEditDialog(false);
    setValidationErrors({});
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setProductToEdit((prev) => ({
      ...prev,
      [name]: value
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleUpdateProduct = async () => {
    if (!validateEditProductData()) {
      return;
    }
    try {
      await axios.put(`https://3.1.81.96/api/Products/${productToEdit.productId}`, productToEdit);
      // Fetch the updated list of products
      const response = await axios.get('https://3.1.81.96/api/Products', {
        params: {
          pageNumber: 1,
          pageSize: 100,
          categoryId
        }
      });
      setProducts(response.data);
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message);
    }
  };

  const handleOpenConfirmDialog = (productId) => {
    setProductToDelete(productId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setProductToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleViewDetails = (product) => {
    navigate('/my-product-details', { state: { productData: product } });
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`https://3.1.81.96/api/Products/${productToDelete}`);
      // Fetch the updated list of products
      const response = await axios.get('https://3.1.81.96/api/Products', {
        params: {
          pageNumber: 1,
          pageSize: 100,
          categoryId
        }
      });
      setProducts(response.data);
      handleCloseConfirmDialog();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenAddDialog} sx={{ mb: 2 }}>
        Add Product
      </Button>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.productDescription}</TableCell>
                    <TableCell sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(product)}
                        sx={{
                          color: 'primary.main',
                          borderColor: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.light'
                          }
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleOpenEditDialog(product)}
                        sx={{
                          color: 'primary.main',
                          borderColor: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.light'
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleOpenConfirmDialog(product.productId)}
                        sx={{
                          color: 'error.main',
                          borderColor: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.light'
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

          <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="productName"
                label="Product Name"
                type="text"
                fullWidth
                variant="outlined"
                value={newProduct.productName}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                required
                error={!!validationErrors.productName}
                helperText={validationErrors.productName}
              />
              <TextField
                margin="dense"
                name="productDescription"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={newProduct.productDescription}
                onChange={handleInputChange}
                required
                error={!!validationErrors.productDescription}
                helperText={validationErrors.productDescription}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddDialog}>Cancel</Button>
              <Button onClick={handleAddProduct}>Add</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="productName"
                label="Product Name"
                type="text"
                fullWidth
                variant="outlined"
                value={productToEdit?.productName || ''}
                onChange={handleEditInputChange}
                sx={{ mb: 2 }}
                required
                error={!!validationErrors.productName}
                helperText={validationErrors.productName}
              />
              <TextField
                margin="dense"
                name="productDescription"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={productToEdit?.productDescription || ''}
                onChange={handleEditInputChange}
                required
                error={!!validationErrors.productDescription}
                helperText={validationErrors.productDescription}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              <Button onClick={handleUpdateProduct}>Update</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete this product?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
              <Button onClick={handleDeleteProduct} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default MyProduct;
