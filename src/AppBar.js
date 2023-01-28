import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import logo from './logo-white.png';


const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Logout'];

function ResponsiveAppBar(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      
    };
  }, []);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const navigatepage = (page) =>{
      navigate(page);
  }
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    props.handleSignout();
    setAnchorElUser(null);
  };
  // <Avatar sx={{ width: 56, height: 56 }} alt="Scanner App" src={logo} />
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ADC Scanner
          </Typography>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ADC Scanner
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Stack direction="row" spacing={2}>
              <Typography 
                style={{ display: "flex", justifyContent: 'center', alignItems: 'center', cursor :'pointer'  }}
                variant="h6"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                  minWidth: 100 }}
                component="a"
                onClick={() => navigatepage('/')}
                >Scans
               </Typography>
               <Typography 
                style={{ display: "flex", justifyContent: 'center', alignItems: 'center', cursor :'pointer' }}
                variant="h6"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                  minWidth: 100 }}
                  component="a"
                // href="/pallet"
                  onClick={() => navigatepage('/pallet')}
                >Pallet
               </Typography>
               <Typography 
                style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}
                variant="h6"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                  minWidth: 100 }}
                
                component="a"
                href="#"
                onClick={handleCloseUserMenu}
                >Logout
               </Typography>
              
              {/* <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={props.userName} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip> */}
            </Stack>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
