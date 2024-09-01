// app/inventory/InventoryForm.js

'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Paper } from '@mui/material';
const containerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  padding: 2,
};
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};
export default function InventoryForm({ initialInventory }) {
  const [inventory, setInventory] = useState(initialInventory);
  const [filteredInventory, setFilteredInventory] = useState(initialInventory);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [originalItemName, setOriginalItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openAIResponse, setOpenAIResponse] = useState('');

  useEffect(() => {
    const filteredItems = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInventory(filteredItems);
  }, [searchQuery, inventory]);

  const addItem = async (item, quantity) => {
    // Add item implementation
  };

  const updateItem = async (originalItemName, newItemName, quantity) => {
    // Update item implementation
  };

  const removeItem = async (item) => {
    // Remove item implementation
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditMode(true);
      setOriginalItemName(item.name);
      setItemName(item.name);
      setItemQuantity(item.quantity);
    } else {
      setEditMode(false);
      setOriginalItemName('');
      setItemName('');
      setItemQuantity(1);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setOriginalItemName('');
    setItemName('');
    setItemQuantity(1);
  };

  const fetchOpenAIResponse = async (query) => {
    // Fetch OpenAI response implementation
  };

  const handleAskOpenAI = () => {
    const ingredients = inventory.map(item => item.name).join(', ');
    const query = `Using these ingredients: ${ingredients}, suggest a few recipes names, not the complete recipe. If an ingredient isn't edible, exclude it from consideration`;
    fetchOpenAIResponse(query);
  };

  return (
    <Box sx={containerStyle}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" fontSize="1.25rem">
            {editMode ? 'Edit Item' : 'Add Item'}
          </Typography>
          <Stack width="100%" direction={'column'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{ fontSize: '0.875rem' }}
            />
            <TextField
              id="outlined-quantity"
              label="Quantity"
              variant="outlined"
              type="number"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value))}
              sx={{ fontSize: '0.875rem' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (editMode) {
                  updateItem(originalItemName, itemName, parseInt(itemQuantity));
                } else {
                  addItem(itemName, parseInt(itemQuantity));
                }
                handleClose();
              }}
              sx={{ fontSize: '0.875rem', borderRadius: 1 }}
            >
              {editMode ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack spacing={2} mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ fontSize: '0.875rem' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAskOpenAI}
          sx={{ fontSize: '0.875rem', borderRadius: 1 }}
        >
          Get Recipe Suggestions
        </Button>
        {openAIResponse && (
          <Paper sx={{ p: 2, width: '600px', borderRadius: 1 }}>
            <Typography variant="h6" component="h2" fontSize="1rem" sx={{ mb: 1 }}>
              OpenAI Response
            </Typography>
            <Typography variant="body1" fontSize="0.875rem">
              {openAIResponse}
            </Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
