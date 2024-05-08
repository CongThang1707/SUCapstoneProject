import { Grid, Paper } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ==============================|| TYPOGRAPHY ||============================== //
const rows = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' }
  // Add more rows as needed
];
const Typography = () => (
  <MainCard title="Users Table">
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                {/* Add more table headers if needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  {/* Add more table cells if needed */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <SubCard title="Heading">
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <MuiTypography variant="h1" gutterBottom>
                h1. Heading
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h2" gutterBottom>
                h2. Heading
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h3" gutterBottom>
                h3. Heading
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h4" gutterBottom>
                h4. Heading
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h5" gutterBottom>
                h5. Heading
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h6" gutterBottom>
                h6. Heading
              </MuiTypography>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SubCard title="Sub title">
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <MuiTypography variant="subtitle1" gutterBottom>
                subtitle1. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="subtitle2" gutterBottom>
                subtitle2. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur
              </MuiTypography>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SubCard title="Body">
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <MuiTypography variant="body1" gutterBottom>
                body1. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="body2" gutterBottom>
                body2. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
              </MuiTypography>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SubCard title="Extra">
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <MuiTypography variant="button" display="block" gutterBottom>
                button text
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="caption" display="block" gutterBottom>
                caption text
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="overline" display="block" gutterBottom>
                overline text
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography
                variant="body2"
                color="primary"
                component={Link}
                href="https://berrydashboard.io"
                target="_blank"
                display="block"
                underline="hover"
                gutterBottom
              >
                https://berrydashboard.io
              </MuiTypography>
            </Grid>
          </Grid>
        </SubCard> */}
      </Grid>
    </Grid>
  </MainCard>
);

export default Typography;
