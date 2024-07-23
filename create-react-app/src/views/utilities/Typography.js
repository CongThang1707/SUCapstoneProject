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
  InputLabel,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const [stores, setStores] = useState([]); // State for stores
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignData, setAssignData] = useState({
    brandId: '',
    userId: '',
    storeId: 0
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

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

        console.log('Stores data:', allStoresResponse.data);

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
  };

  const handleAssignOpen = (user) => {
    setSelectedUser(user);
    setAssignData({ ...assignData, userId: user.userId });
    setAssignOpen(true);
  };

  const handleAssignClose = () => {
    setAssignOpen(false);
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAssignChange = (e) => {
    setAssignData({ ...assignData, [e.target.name]: e.target.value });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://3.1.81.96/api/Auth/Register', newUser);
      setSnackbarMessage('User created successfully');
      setSnackbarOpen(true);
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

  const handleAssignSubmit = async () => {
    try {
      await axios.post('https://3.1.81.96/api/BrandStaffs', assignData);
      setSnackbarMessage('Brand assigned successfully');
      setSnackbarOpen(true);
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
          ) : error ? (
            <Typography color="error">{error}</Typography>
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
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={handleChange}
          />
          <TextField margin="dense" label="Email" name="email" type="email" fullWidth value={newUser.email} onChange={handleChange} />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Role</InputLabel>
            <Select labelId="role-label" name="role" value={newUser.role} onChange={handleChange}>
              <MenuItem value={0}>Admin</MenuItem>
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
          </FormControl>
          {selectedUser?.role === 2 && ( // Check if the role is Store Manager
            <FormControl fullWidth margin="dense">
              <InputLabel id="store-label">Store</InputLabel>
              <Select labelId="store-label" name="storeId" value={assignData.storeId} onChange={handleAssignChange}>
                {stores.map((store) => (
                  <MenuItem key={store.storeId} value={store.storeId}>
                    {store.storeLocation}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default UtilitiesBrandStaff;
