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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const UtilitiesBrandStaff = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brandData, setBrandData] = useState([]);
  const [, setUserData] = useState([]);
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    userName: '',
    password: '',
    email: '',
    role: 1
  });
  const [brands, setBrands] = useState([]);
  const [, setStores] = useState([]); // State for stores
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignData, setAssignData] = useState({
    brandId: '',
    userId: '',
    storeId: 0
  });
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [filteredStores, setFilteredStores] = useState([]);

  const validateNewUserData = () => {
    const errors = {};
    if (!newUser.userName.trim()) {
      errors.userName = 'User name is required';
    }
    if (!newUser.password.trim()) {
      errors.password = 'Password is required';
    }
    if (!newUser.email.trim()) {
      errors.email = 'Email is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAssignData = () => {
    const errors = {};
    if (!assignData.brandId) {
      errors.brandId = 'Brand is required';
    }
    if (selectedUser?.role === 2 && !assignData.storeId) {
      errors.storeId = 'Store is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [userResponse, brandResponse, allBrandsResponse, allStoresResponse] = await Promise.all([
          axios.get('https://3.1.81.96/api/Users?pageNumber=1&pageSize=1000'),
          axios.get('https://3.1.81.96/api/Brands/BrandStaff'),
          axios.get('https://3.1.81.96/api/Brands'),
          axios.get('https://3.1.81.96/api/Stores') // Fetch stores
        ]);

        const filteredUsers = userResponse.data.filter((user) => user.role !== 0);
        const userMap = {};
        filteredUsers.forEach((user) => {
          userMap[user.userId] = user;
        });
        setUserData(userMap);

        const assignedUserIds = new Set(brandResponse.data.flatMap((brand) => brand.brandStaffs.map((staff) => staff.userId)));

        const updatedBrandData = brandResponse.data.map((brand) => {
          const updatedBrandStaffs = brand.brandStaffs
            .filter((staff) => assignedUserIds.has(staff.userId))
            .map((staff) => ({
              ...staff,
              userName: userMap[staff.userId]?.userName || 'Unknown User',
              email: userMap[staff.userId]?.email || 'Unknown Email',
              role: userMap[staff.userId]?.role || 'Unknown Role',
              brandName: brand.brandName
            }));

          return {
            ...brand,
            brandStaffs: updatedBrandStaffs
          };
        });

        const unassignedUsers = filteredUsers
          .filter((user) => !assignedUserIds.has(user.userId))
          .map((user) => ({
            ...user,
            brandName: 'Unassigned'
          }));

        const allUsers = [...updatedBrandData.flatMap((brand) => brand.brandStaffs), ...unassignedUsers];

        setBrandData(allUsers);
        setBrands(allBrandsResponse.data);
        setStores(allStoresResponse.data); // Set stores data
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleName = (role) => {
    switch (role) {
      case 1:
        return 'Brand Manager';
      case 2:
        return 'Store Manager';
      default:
        return 'User';
    }
  };

  const handleViewDetails = (staff) => {
    navigate('/staff-details', { state: { staffData: staff } });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValidationErrors({});
  };

  const handleAssignOpen = (user) => {
    setSelectedUser(user);
    setAssignData({ ...assignData, userId: user.userId });
    setAssignOpen(true);
  };

  const handleAssignClose = () => {
    setAssignOpen(false);
    setValidationErrors({});
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: '' });
  };

  const handleAssignChange = async (e) => {
    const { name, value } = e.target;
    setAssignData({ ...assignData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: '' });

    if (name === 'brandId') {
      try {
        const response = await axios.get(`https://3.1.81.96/api/Stores?brandId=${value}`);
        setFilteredStores(response.data);
      } catch (err) {
        setError('Error fetching stores for selected brand');
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateNewUserData()) {
      return;
    }
    try {
      await axios.post('https://3.1.81.96/api/Auth/Register', newUser);
      Toastify({
        text: 'User created successfully!',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)'
      }).showToast();
      setIsLoading(true);
      const [userResponse, brandResponse] = await Promise.all([
        axios.get('https://3.1.81.96/api/Users'),
        axios.get('https://3.1.81.96/api/Brands/BrandStaff')
      ]);
      const filteredUsers = userResponse.data.filter((user) => user.role !== 0);
      const userMap = {};
      filteredUsers.forEach((user) => {
        userMap[user.userId] = user;
      });
      setUserData(userMap);
      const assignedUserIds = new Set(brandResponse.data.flatMap((brand) => brand.brandStaffs.map((staff) => staff.userId)));
      const updatedBrandData = brandResponse.data.map((brand) => {
        const updatedBrandStaffs = brand.brandStaffs
          .filter((staff) => assignedUserIds.has(staff.userId))
          .map((staff) => ({
            ...staff,
            userName: userMap[staff.userId]?.userName || 'Unknown User',
            email: userMap[staff.userId]?.email || 'Unknown Email',
            role: userMap[staff.userId]?.role || 'Unknown Role',
            brandName: brand.brandName
          }));
        return {
          ...brand,
          brandStaffs: updatedBrandStaffs
        };
      });
      const unassignedUsers = filteredUsers
        .filter((user) => !assignedUserIds.has(user.userId))
        .map((user) => ({
          ...user,
          brandName: 'Unassigned'
        }));
      const allUsers = [...updatedBrandData.flatMap((brand) => brand.brandStaffs), ...unassignedUsers];
      setBrandData(allUsers);
    } catch (err) {
      setError('Error adding user');
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  const checkExistingAssignment = async () => {
    try {
      const response = await axios.get(`https://3.1.81.96/api/BrandStaffs?brandId=${assignData.brandId}`);
      const existingStoreManagers = response.data.filter((staff) => staff.storeId !== null && staff.storeId === assignData.storeId);
      return existingStoreManagers.length > 0; // If there are any store managers, it means an assignment exists
    } catch (err) {
      setError('Error checking existing assignments');
      return false;
    }
  };

  const handleAssignSubmit = async () => {
    if (!validateAssignData()) {
      return;
    }
    if (selectedUser?.role === 2) {
      const existingAssignment = await checkExistingAssignment();
      if (existingAssignment) {
        setError('This store already has a Store Manager assigned for the selected brand.');
        return;
      }
    }
    try {
      await axios.post('https://3.1.81.96/api/BrandStaffs', assignData);
      Toastify({
        text: 'Assigned successfully!',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)'
      }).showToast();
      setIsLoading(true);
      const [userResponse, brandResponse] = await Promise.all([
        axios.get('https://3.1.81.96/api/Users'),
        axios.get('https://3.1.81.96/api/Brands/BrandStaff')
      ]);
      const filteredUsers = userResponse.data.filter((user) => user.role !== 0);
      const userMap = {};
      filteredUsers.forEach((user) => {
        userMap[user.userId] = user;
      });
      setUserData(userMap);
      const assignedUserIds = new Set(brandResponse.data.flatMap((brand) => brand.brandStaffs.map((staff) => staff.userId)));
      const updatedBrandData = brandResponse.data.map((brand) => {
        const updatedBrandStaffs = brand.brandStaffs
          .filter((staff) => assignedUserIds.has(staff.userId))
          .map((staff) => ({
            ...staff,
            userName: userMap[staff.userId]?.userName || 'Unknown User',
            email: userMap[staff.userId]?.email || 'Unknown Email',
            role: userMap[staff.userId]?.role || 'Unknown Role',
            brandName: brand.brandName
          }));
        return {
          ...brand,
          brandStaffs: updatedBrandStaffs
        };
      });
      const unassignedUsers = filteredUsers
        .filter((user) => !assignedUserIds.has(user.userId))
        .map((user) => ({
          ...user,
          brandName: 'Unassigned'
        }));
      const allUsers = [...updatedBrandData.flatMap((brand) => brand.brandStaffs), ...unassignedUsers];
      setBrandData(allUsers);
    } catch (err) {
      setError('Error assigning user to brand');
    } finally {
      setIsLoading(false);
      handleAssignClose();
    }
  };

  return (
    <MainCard title={<Typography variant="h5">Brand Staff Table</Typography>}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add User
          </Button>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
            </Box>
          ) : brandData.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Brand Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {brandData.map((staff) => (
                    <TableRow key={staff.userId} hover>
                      <TableCell>{staff.userName}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{getRoleName(staff.role)}</TableCell>
                      <TableCell>{staff.brandName}</TableCell>
                      <TableCell>
                        <Button size="small" color="primary" onClick={() => handleViewDetails(staff)}>
                          View Details
                        </Button>
                        {staff.brandName === 'Unassigned' && (
                          <Button size="small" color="secondary" onClick={() => handleAssignOpen(staff)}>
                            Assign Brand
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No brand data found.</Typography>
          )}
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="User Name"
            name="userName"
            type="text"
            fullWidth
            value={newUser.userName}
            onChange={handleChange}
            error={!!validationErrors.userName}
            helperText={validationErrors.userName}
            required
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={handleChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={handleChange}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Role</InputLabel>
            <Select labelId="role-label" name="role" value={newUser.role} onChange={handleChange}>
              <MenuItem value={1}>Brand Manager</MenuItem>
              <MenuItem value={2}>Store Manager</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={assignOpen} onClose={handleAssignClose}>
        <DialogTitle>Assign Brand to User</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="brand-label">Brand</InputLabel>
            <Select labelId="brand-label" name="brandId" value={assignData.brandId} onChange={handleAssignChange}>
              {brands.map((brand) => (
                <MenuItem key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </MenuItem>
              ))}
            </Select>
            {validationErrors.brandId && (
              <Typography variant="caption" color="error">
                {validationErrors.brandId}
              </Typography>
            )}
          </FormControl>
          {selectedUser?.role === 2 && (
            <FormControl fullWidth margin="dense">
              <InputLabel id="store-label">Store</InputLabel>
              <Select labelId="store-label" name="storeId" value={assignData.storeId} onChange={handleAssignChange}>
                {filteredStores.map((store) => (
                  <MenuItem key={store.storeId} value={store.storeId}>
                    {store.storeName}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.storeId && (
                <Typography variant="caption" color="error">
                  {validationErrors.storeId}
                </Typography>
              )}
            </FormControl>
          )}
          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssignClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAssignSubmit} color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default UtilitiesBrandStaff;
