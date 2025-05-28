import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import "./Navbar.css";

export default function Navbar({ onAddFilm }) {
  return (
    <AppBar position="static" className="navbar-appbar">
      <Toolbar className="navbar-toolbar">
        <Typography variant="h6" className="navbar-title">
          <MovieCreationIcon /> Film Library
        </Typography>
        <Box className="navbar-search-container">
          <SearchIcon className="navbar-search-icon" />
          <InputBase
            placeholder="Search…"
            className="navbar-search"
            inputProps={{ "aria-label": "search" }}
          />
        </Box>
        <Button
          variant="contained"
          className="navbar-add-btn"
          startIcon={<AddIcon />}
          onClick={onAddFilm}
        >
          ADD FILM
        </Button>
      </Toolbar>
    </AppBar>
  );
}