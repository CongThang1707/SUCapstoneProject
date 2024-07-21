// import React, { useEffect, useState } from 'react';
// import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import axios from 'axios';
// import CircularProgress from '@mui/material/CircularProgress';
// import { useNavigate } from 'react-router-dom';

// // ==============================|| TYPOGRAPHY ||============================== //

// const UtilitiesBrandStaff = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [brandData, setBrandData] = useState([]);
//   const [, setUserData] = useState({}); // State to store user data
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const [userResponse, brandResponse] = await Promise.all([
//           axios.get('https://3.1.81.96/api/Users'), // Fetch user data
//           axios.get('https://3.1.81.96/api/Brands/BrandStaff') // Fetch brand data (this will include brandStaffs)
//         ]);

//         // Create a map of userId to userData
//         const userMap = {};
//         userResponse.data.forEach((user) => {
//           userMap[user.userId] = user;
//         });
//         setUserData(userMap);

//         // Update the brandData state with user data from API
//         const updatedBrandData = brandResponse.data.map((brand) => ({
//           ...brand,
//           brandStaffs: brand.brandStaffs
//             .filter((staff) => userMap[staff.userId]?.role !== 0)
//             .map((staff) => ({
//               ...staff,
//               userName: userMap[staff.userId]?.userName || 'Unknown User', // Add userName from userMap
//               email: userMap[staff.userId]?.email || 'Unknown Email',
//               role: userMap[staff.userId]?.role || 'Unknown Role'
//             }))
//         }));

//         setBrandData(updatedBrandData);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to fetch data.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const getRoleName = (role) => {
//     switch (role) {
//       case 1:
//         return 'Brand Manager';
//       case 2:
//         return 'Store Manager';
//       default:
//         return 'User';
//     }
//   };

//   const handleViewDetails = (staff) => {
//     navigate('/staff-details', { state: { staffData: staff } });
//   };

//   // ... your existing code ...

//   return (
//     <MainCard title={<Typography variant="h5">Brand Staff Table</Typography>}>
//       <Grid container spacing={gridSpacing}>
//         <Grid item xs={12}>
//           {isLoading ? (
//             <CircularProgress />
//           ) : error ? (
//             <Typography color="error">{error}</Typography>
//           ) : (
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>User Name</TableCell>
//                     <TableCell>Email</TableCell>
//                     <TableCell>Role</TableCell>
//                     <TableCell>Brand Name</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {brandData
//                     .flatMap((brand) => brand.brandStaffs)
//                     .map((staff) => {
//                       const brandOfStaff = brandData.find((b) => b.brandId === staff.brandId);
//                       return (
//                         <TableRow key={staff.brandStaffId} hover onClick={() => handleViewDetails(staff)}>
//                           <TableCell>{staff.userName}</TableCell>
//                           <TableCell>{staff.email}</TableCell>
//                           <TableCell>{getRoleName(staff.role)}</TableCell>
//                           <TableCell>{brandOfStaff.brandName}</TableCell>
//                         </TableRow>
//                       );
//                     })}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </Grid>
//       </Grid>
//     </MainCard>
//   );
// };

// export default UtilitiesBrandStaff;

import React, { useEffect, useState } from 'react';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

const UtilitiesBrandStaff = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brandData, setBrandData] = useState([]);
  const [, setUserData] = useState({}); // State to store user data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [userResponse, brandResponse] = await Promise.all([
          axios.get('https://3.1.81.96/api/Users'),
          axios.get('https://3.1.81.96/api/Brands/BrandStaff')
        ]);

        // Create a map of userId to userData
        const userMap = {};
        userResponse.data.forEach((user) => {
          userMap[user.userId] = user;
        });
        setUserData(userMap);

        const assignedUserIds = new Set(brandResponse.data.flatMap((brand) => brand.brandStaffs.map((staff) => staff.userId)));

        // Filter out users with role 0
        const filteredUsers = userResponse.data.filter((user) => user.role !== 0);

        // Combine brand and user data
        const updatedBrandData = brandResponse.data.map((brand) => {
          const updatedBrandStaffs = brand.brandStaffs
            .filter((staff) => assignedUserIds.has(staff.userId)) // Filter out staff not in userMap
            .map((staff) => ({
              ...staff,
              userName: userMap[staff.userId]?.userName || 'Unknown User',
              email: userMap[staff.userId]?.email || 'Unknown Email',
              role: userMap[staff.userId]?.role || 'Unknown Role'
            }));

          return {
            ...brand,
            brandStaffs: updatedBrandStaffs
          };
        });

        // Add unassigned users with role 1 or 2
        const unassignedUsers = filteredUsers
          .filter((user) => !assignedUserIds.has(user.userId))
          .map((user) => ({
            ...user, // Include all user details (userId, userName, email, role)
            brandName: 'Unassigned'
          }));

        // Flatten the brandStaffs arrays and add unassigned users to the resulting array
        const allUsers = [...updatedBrandData.flatMap((brand) => brand.brandStaffs), ...unassignedUsers];

        setBrandData(allUsers);
      } catch (err) {
        // ... error handling
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

  return (
    <MainCard title={<Typography variant="h5">Brand Staff Table</Typography>}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : brandData ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* Table Headers (assuming your brandStaff has these properties) */}
                    <TableCell>User Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Brand Name</TableCell> {/* Added a new column for Brand Name */}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {brandData.map((staff) => (
                    <TableRow key={staff.brandStaffId} hover onClick={() => handleViewDetails(staff)}>
                      <TableCell>{staff.userName}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{getRoleName(staff.role)}</TableCell>
                      <TableCell>{staff.brandName}</TableCell> {/* Display brand name */}
                      <TableCell>
                        <Button size="small" color="primary" onClick={() => handleViewDetails(staff)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No brand data found.</Typography> // Handle the case where brandData is null
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default UtilitiesBrandStaff;
