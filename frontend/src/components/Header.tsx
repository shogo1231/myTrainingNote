import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from "@mui/material/Typography";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import '../css/Header.css'

const list = () => (
  <Box
    sx={{ width: 250 }}
    role="presentation"
    // onClick={toggleDrawer(anchor, false)}
    // onKeyDown={toggleDrawer(anchor, false)}
  >
    <List>
      {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    <Divider />
    <List>
      {['All mail', 'Trash', 'Spam'].map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default function Header() {
  const [state, setState] = React.useState(false);
  const toggleDrawer = () => { setState(!state); };

  const navigate = useNavigate();
  let setStateVal = {};

  const location = useLocation();
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer}
            >
              <MenuIcon/>
            </IconButton>
            <h2
              className="HeaderBarTitle"
              onClick={() => navigate('/training/top')}
            > トレーニング記録
            </h2>
            { location.pathname.match(/selectEvent/) &&
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              text-arign= "light"
              sx={{ mr: 2 }}
              style={{ margin: 0 }}
              onClick={() => navigate('/training/addEvent', {state: setStateVal})}
            >
              <PlaylistAddIcon/>
            </IconButton>
            }
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              text-arign= "light"
              sx={{ mr: 2 }}
              style={{ margin: 0 }}
              onClick={() => navigate('/training/selectEvent', {state: setStateVal})}
            >
              <AddIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        anchor='left'
        open={state}
        onClose={toggleDrawer}
      >
        {list()}
      </Drawer>
    </>
  );
}