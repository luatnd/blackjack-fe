import * as React from 'react';
import {useEffect, useMemo} from "react";
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {AppBar} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {observer} from "mobx-react-lite"
import Button from "@mui/material/Button";
// import {useRouter} from "next/router";
import {useRouter} from 'next/navigation';


import {authStore} from "../(EmptyLayout)/auth/store";
import {restoreAuthFromCache, useLogout} from "../(EmptyLayout)/auth/service";
import Link from "next/link";


export default observer(function Header() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const {logout} = useLogout();

  const handleCloseUserMenu = (setting: any) => {
    setAnchorElUser(null);
    if (setting.id === 'logout') {
      logout()
    }
  };

  const router = useRouter();
  const {isLoggedIn, currentAuth} = authStore;
  useEffect(() => {
    restoreAuthFromCache()
  }, []) // NOTE: don't need to depend on currentAuth

  const settings = useMemo(() => {
    return [
      {
        id: 'display_name',
        txt: currentAuth?.user.email || "",
      }, {
        id: 'logout',
        txt: 'Logout',
        route: '/auth',
      }
    ]
  }, [currentAuth]);

  // console.log('{Header} render: ');

  return (
    <AppBar position="static" variant="outlined" elevation={0} color="transparent">
      <Container maxWidth="lg">
        <Toolbar disableGutters>

          <Link href="/" style={{textDecoration: 'none'}}>
            <Typography
              variant="h5" noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex' },
                flexGrow: 0,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'black',
                textDecoration: 'none',
              }}
            >
              DEMO
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex' } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn
              ? <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                    <Avatar role='user_avatar' alt={currentAuth?.user.email}
                            src="https://images.unsplash.com/photo-1654110455429-cf322b40a906?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=64&ixid=MnwxfDB8MXxyYW5kb218MHx8YXZhdGFyfHx8fHx8MTY4NTU5MzkyOA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=64" />
                  </IconButton>
                </Tooltip>
              : <Button role='sign_in_btn' variant="outlined" onClick={() => router.push('/auth')}>
                  Sign In
                </Button>
            }

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
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.id} onClick={() => handleCloseUserMenu(setting)}>
                  <Typography textAlign="center">{setting.txt.substring(0, 30)}</Typography>
                </MenuItem>
              ))}
            </Menu>

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
})
