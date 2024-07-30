// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Divider,
//   Grid,
//   Stack,
//   Typography,
//   useMediaQuery,
//   Box,
//   Button,
//   Checkbox,
//   FormControl,
//   FormControlLabel,
//   FormHelperText,
//   IconButton,
//   InputAdornment,
//   InputLabel,
//   OutlinedInput
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import { Formik } from 'formik';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import AuthWrapper1 from '../AuthWrapper1';
// import AuthCardWrapper from '../AuthCardWrapper';
// import Logo from 'ui-component/Logo';
// import AuthFooter from 'ui-component/cards/AuthFooter';
// import AnimateButton from 'ui-component/extended/AnimateButton';
// const ConfirmPassword = ({ ...others }) => {
//   const theme = useTheme();
//   const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
//   const [checked, setChecked] = useState(true);

//   const [showPassword, setShowPassword] = useState(false);
//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   useEffect(() => {}, []);

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };
//   const navigate = useNavigate();
//   const [loginError, setLoginError] = useState(null);
//   return (
//     <AuthWrapper1>
//       <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
//         <Grid item xs={12}>
//           <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
//             <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
//               <AuthCardWrapper>
//                 <Grid container spacing={2} alignItems="center" justifyContent="center">
//                   <Grid item sx={{ mb: 3 }}>
//                     <Link to="#">
//                       <Logo />
//                     </Link>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
//                       <Grid item>
//                         <Stack alignItems="center" justifyContent="center" spacing={1}>
//                           <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
//                             Hi, Welcome Back
//                           </Typography>
//                         </Stack>
//                       </Grid>
//                     </Grid>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <>
//                       <Grid container direction="column" justifyContent="center" spacing={2}>
//                         <Grid item xs={12} container alignItems="center" justifyContent="center">
//                           <Box sx={{ mb: 2 }}>
//                             <Typography variant="subtitle1">Sign in with Email address</Typography>
//                           </Box>
//                         </Grid>
//                       </Grid>

//                       <Formik
//                         initialValues={{
//                           userName: 'info@codedthemes.com',
//                           password: '123456',
//                           submit: null
//                         }}
//                         onSubmit={async (values, { setStatus, setSubmitting }) => {
//                           try {
//                             const response = await axios.post(
//                               'https://3.1.81.96/api/Auth/Login',
//                               {
//                                 userName: values.userName,
//                                 password: values.password
//                               },
//                               {
//                                 headers: {
//                                   'Content-Type': 'application/json' // Set content type explicitly
//                                 }
//                               }
//                             );

//                             if (response.status === 200) {
//                               // Successful login (handle token/session storage, etc.)
//                               localStorage.setItem('token', response.data.token);
//                               localStorage.setItem('userId', response.data.userId);
//                               localStorage.setItem('role', response.data.role);
//                               localStorage.setItem('brandId', response.data.brandId);

//                               setStatus({ success: true });
//                               setSubmitting(false);
//                               navigate('/dashboard/default', { replace: true });
//                             } else {
//                               // Handle login error
//                               const errorData = response.data;
//                               if (errorData && errorData.error) {
//                                 setLoginError(errorData.error);
//                               } else {
//                                 setLoginError('Login failed. Please try again.');
//                               }
//                               setStatus({ success: false });
//                               setSubmitting(false);
//                             }
//                           } catch (error) {
//                             // Handle network errors or other exceptions
//                             setLoginError('Login failed. Please try again.');
//                             setStatus({ success: false });
//                             setSubmitting(false);
//                           }
//                         }}
//                       >
//                         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//                           <form noValidate onSubmit={handleSubmit} {...others}>
//                             <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
//                               <InputLabel htmlFor="outlined-adornment-email-login">Username</InputLabel>
//                               <OutlinedInput
//                                 id="outlined-adornment-email-login"
//                                 type="text"
//                                 value={values.userName}
//                                 name="userName"
//                                 onBlur={handleBlur}
//                                 onChange={handleChange}
//                                 label="Username"
//                                 inputProps={{}}
//                               />
//                             </FormControl>

//                             <FormControl
//                               fullWidth
//                               error={Boolean(touched.password && errors.password)}
//                               sx={{ ...theme.typography.customInput }}
//                             >
//                               <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
//                               <OutlinedInput
//                                 id="outlined-adornment-password-login"
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={values.password}
//                                 name="password"
//                                 onBlur={handleBlur}
//                                 onChange={handleChange}
//                                 endAdornment={
//                                   <InputAdornment position="end">
//                                     <IconButton
//                                       aria-label="toggle password visibility"
//                                       onClick={handleClickShowPassword}
//                                       onMouseDown={handleMouseDownPassword}
//                                       edge="end"
//                                       size="large"
//                                     >
//                                       {showPassword ? <Visibility /> : <VisibilityOff />}
//                                     </IconButton>
//                                   </InputAdornment>
//                                 }
//                                 label="Password"
//                                 inputProps={{}}
//                               />
//                               {touched.password && errors.password && (
//                                 <FormHelperText error id="standard-weight-helper-text-password-login">
//                                   {errors.password}
//                                 </FormHelperText>
//                               )}
//                             </FormControl>
//                             <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
//                               <FormControlLabel
//                                 control={
//                                   <Checkbox
//                                     checked={checked}
//                                     onChange={(event) => setChecked(event.target.checked)}
//                                     name="checked"
//                                     color="primary"
//                                   />
//                                 }
//                                 label="Remember me"
//                               />
//                               <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
//                                 Forgot Password?
//                               </Typography>
//                             </Stack>
//                             {errors.submit && (
//                               <Box sx={{ mt: 3 }}>
//                                 <FormHelperText error>{errors.submit}</FormHelperText>
//                               </Box>
//                             )}

//                             <Box sx={{ mt: 2 }}>
//                               <AnimateButton>
//                                 <Button
//                                   disableElevation
//                                   disabled={isSubmitting}
//                                   fullWidth
//                                   size="large"
//                                   type="submit"
//                                   variant="contained"
//                                   color="secondary"
//                                 >
//                                   Sign in
//                                 </Button>
//                               </AnimateButton>
//                             </Box>
//                             {loginError && ( // Only show error message if loginError is not null
//                               <Box sx={{ mt: 3 }}>
//                                 <FormHelperText error>{loginError}</FormHelperText>
//                               </Box>
//                             )}
//                           </form>
//                         )}
//                       </Formik>
//                     </>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Divider />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Grid item container direction="column" alignItems="center" xs={12}>
//                       <Typography component={Link} to="/pages/register/register3" variant="subtitle1" sx={{ textDecoration: 'none' }}>
//                         Don&apos;t have an account?
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </AuthCardWrapper>
//             </Grid>
//           </Grid>
//         </Grid>
//         <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
//           <AuthFooter />
//         </Grid>
//       </Grid>
//     </AuthWrapper1>
//   );
// };
// export default ConfirmPassword;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AnimateButton from 'ui-component/extended/AnimateButton';

const SetNewPassword = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
  });

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link to="#">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Set New Password
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <>
                      <Grid container direction="column" justifyContent="center" spacing={2}>
                        <Grid item xs={12} container alignItems="center" justifyContent="center">
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">Enter your new password</Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Formik
                        initialValues={{
                          password: '',
                          confirmPassword: '',
                          submit: null
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setStatus, setSubmitting }) => {
                          try {
                            const response = await axios.post(
                              'https://3.1.81.96/api/Auth/SetNewPassword', // Change this to your actual endpoint
                              {
                                password: values.password
                              },
                              {
                                headers: {
                                  'Content-Type': 'application/json'
                                }
                              }
                            );

                            if (response.status === 200) {
                              setStatus({ success: true });
                              setSubmitting(false);
                              navigate('/login', { replace: true });
                            } else {
                              const errorData = response.data;
                              if (errorData && errorData.error) {
                                setErrorMessage(errorData.error);
                              } else {
                                setErrorMessage('Failed to set new password. Please try again.');
                              }
                              setStatus({ success: false });
                              setSubmitting(false);
                            }
                          } catch (error) {
                            setErrorMessage('Failed to set new password. Please try again.');
                            setStatus({ success: false });
                            setSubmitting(false);
                          }
                        }}
                      >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                          <form noValidate onSubmit={handleSubmit} {...others}>
                            <FormControl
                              fullWidth
                              error={Boolean(touched.password && errors.password)}
                              sx={{ ...theme.typography.customInput }}
                            >
                              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                      size="large"
                                    >
                                      {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                              />
                              {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password">
                                  {errors.password}
                                </FormHelperText>
                              )}
                            </FormControl>

                            <FormControl
                              fullWidth
                              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                              sx={{ ...theme.typography.customInput }}
                            >
                              <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={values.confirmPassword}
                                name="confirmPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowConfirmPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                      size="large"
                                    >
                                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                                label="Confirm Password"
                                inputProps={{}}
                              />
                              {touched.confirmPassword && errors.confirmPassword && (
                                <FormHelperText error id="standard-weight-helper-text-confirm-password">
                                  {errors.confirmPassword}
                                </FormHelperText>
                              )}
                            </FormControl>

                            <Box sx={{ mt: 2 }}>
                              <AnimateButton>
                                <Button
                                  disableElevation
                                  disabled={isSubmitting}
                                  fullWidth
                                  size="large"
                                  type="submit"
                                  variant="contained"
                                  color="secondary"
                                >
                                  Set New Password
                                </Button>
                              </AnimateButton>
                            </Box>
                            {errorMessage && ( // Only show error message if errorMessage is not null
                              <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errorMessage}</FormHelperText>
                              </Box>
                            )}
                          </form>
                        )}
                      </Formik>
                    </>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography component={Link} to="/login" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                        Go back to login
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default SetNewPassword;
