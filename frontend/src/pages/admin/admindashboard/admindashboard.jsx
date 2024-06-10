import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import GradeIcon from "@mui/icons-material/Grade";
import DvrIcon from "@mui/icons-material/Dvr";
import AddCardIcon from "@mui/icons-material/AddCard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Badge from '@mui/material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';

import CSSGridG from "./../../../components/admin/gigprofile/gigProfile.jsx";
import CSSGridB from "./../../../components/admin/buyerprofile/buyerprofile.jsx";
import CSSGridS from "../../../components/admin/sellerProfile/sellerprofile.jsx";
import CSSGridO from "./../../../components/admin/orderProfile/orderProfile.jsx";
import CSSGridP from "./../../../components/admin/paymentProfile/paymentprofile.jsx";
import CSSGridR from "./../../../components/admin/ratingProfile/ratingprofile.jsx";

const drawerWidth = 240;

const handleLogout = () => {
  // logout(navigation);
};

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [activeComponent, setActiveComponent] = React.useState('Sellerprofile');
  const [row, setRow] = React.useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const Sellerprofile = () => {
    setActiveComponent('Sellerprofile');
  };

  const Buyerprofile = () => {
    setActiveComponent('Buyerprofile');
  };

  const Gigprofile = () => {
    setActiveComponent('Gigprofile');
  };

  const RatingProfile = () => {
    setActiveComponent('RatingProfile');
  };

  const OrderProfile = () => {
    setActiveComponent('OrderProfile');
  };

  const PaymentProfile = () => {
    setActiveComponent('PaymentProfile');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      
      <CssBaseline />
      <AppBar position="fixed" open={open} >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" >
          Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography className='mx-5 w-100'
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'block', sm: 'block' } }}
            >
            <span >Menu Bar</span>
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          
        </DrawerHeader>
        <Divider />
        <List
          sx={{ width: '100%', maxWidth: 230, bgcolor: 'background.paper'}}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader" />
            
          }
        >
          
          <br />
          
          <ListItemButton className='active' onClick={Sellerprofile}>
            <ListItemIcon>
              <ManageAccountsIcon sx={activeComponent === 'Sellerprofile'} />
            </ListItemIcon>
            <ListItemText primary={<span >Seller Profile</span>} sx={activeComponent === 'Sellerprofile' } />
          </ListItemButton>
          <br />
          <br />
          <ListItemButton onClick={Buyerprofile}>
            <ListItemIcon>
              <AccountCircleIcon sx={activeComponent === 'Buyerprofile'} />
            </ListItemIcon>
            <ListItemText primary={<span>Buyer Profile</span>} sx={activeComponent === 'Buyerprofile' } />
          </ListItemButton>
          <br />
          <br />
          <ListItemButton onClick={Gigprofile}>
            <ListItemIcon>
              <Badge badgeContent={row} color="success">
                <HomeRepairServiceIcon sx={activeComponent === 'Gigprofile'} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary={<span>Gig Profile</span>} sx={activeComponent === 'Gigprofile' } />
          </ListItemButton>
          <br />
          <br />
          <ListItemButton onClick={RatingProfile}>
            <ListItemIcon>
              <GradeIcon sx={activeComponent === 'RatingProfile' } />
            </ListItemIcon>
            <ListItemText primary={<span >Rating Profile</span>} sx={activeComponent === 'RatingProfile' } />
          </ListItemButton>
          <br />
          <br />
          <ListItemButton onClick={OrderProfile}>
            <ListItemIcon>
              <DvrIcon sx={activeComponent === 'OrderProfile' } />
            </ListItemIcon>
            <ListItemText primary={<span >Order Profile</span>} sx={activeComponent === 'OrderProfile'} />
          </ListItemButton>
          <br />
          <br />
          <ListItemButton onClick={PaymentProfile}>
            <ListItemIcon>
              <AddCardIcon sx={activeComponent === 'PaymentProfile'} />
            </ListItemIcon>
            <ListItemText primary={<span >Payment Profile</span>} sx={activeComponent === 'PaymentProfile'} />
          </ListItemButton>
          <br />
          <br />
          <Link to='/' onClick={handleLogout}>
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={<span>Logout</span>} />
            </ListItemButton>
          </Link>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3}}>
        <DrawerHeader />
        {activeComponent === 'Gigprofile' && <CSSGridG />}
        {activeComponent === 'Buyerprofile' && <CSSGridB />}
        {activeComponent === 'Sellerprofile' && <CSSGridS />}
        {activeComponent === 'OrderProfile' && <CSSGridO />}
        {activeComponent === 'PaymentProfile' && <CSSGridP />}
        {activeComponent === 'RatingProfile' && <CSSGridR />}
      </Box>
    </Box>
  );
}
