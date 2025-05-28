import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Navbar from "./Navbar";
import axios from "axios";
import "./Dashboard.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [films, setFilms] = useState([]);

  // Fetch films on mount
  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    const res = await axios.get("http://localhost:5000/api/films");
    setFilms(res.data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPoster(null);
    setPreview(null);
    setTitle("");
    setYear("");
    setDescription("");
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    setPoster(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("year", year);
    formData.append("description", description);
    if (poster) {
      formData.append("poster", poster);
    }
    await axios.post("http://localhost:5000/api/films", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    handleClose();
    fetchFilms();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/films/${id}`);
    fetchFilms();
  };

  // You can implement handleEdit and handleView as needed

  return (
    <Box className="dashboard-root">
      <Navbar onAddFilm={handleOpen} />
      <Modal open={open} onClose={handleClose}>
        <Box className="dashboard-modal">
          <h2>Add Film</h2>
          <form onSubmit={handleSubmit}>
            <Button variant="contained" component="label">
              Upload Poster
              <input type="file" hidden accept="image/*" onChange={handlePosterChange} />
            </Button>
            {preview && (
              <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center" }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: 180,
                    height: 240,
                    objectFit: "cover",
                    borderRadius: 8,
                    boxShadow: 2,
                  }}
                />
              </Box>
            )}
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Year"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Box className="dashboard-modal-actions">
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Film Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
          mt: 4,
        }}
      >
        {films.map((film) => (
          <Box
            key={film._id}
            sx={{
              width: 250,
              bgcolor: "#fff",
              borderRadius: 2,
              boxShadow: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <img
              src={film.img ? `http://localhost:5000${film.img}` : ""}
              alt={film.title}
              style={{
                width: "100%",
                height: 320,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 8,
              }}
            />
            {/* Action Buttons */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 1,
              }}
            >
              <Button size="small" color="primary">
                <VisibilityIcon />
              </Button>
              <Button size="small" color="warning">
                <EditIcon />
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(film._id)}
              >
                <DeleteIcon />
              </Button>
            </Box>
            <Box sx={{ mt: 2, width: "100%" }}>
              <div style={{ fontWeight: "bold", fontSize: 16 }}>{film.title}</div>
              <div style={{ color: "#888", fontSize: 14 }}>{film.year}</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>{film.description}</div>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}