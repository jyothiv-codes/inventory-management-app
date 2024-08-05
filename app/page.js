'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Grid } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1) // State for item quantity
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data()
      await setDoc(docRef, { quantity: existingQuantity + quantity })
    } else {
      await setDoc(docRef, { quantity })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await deleteDoc(docRef)
    await updateInventory()
  }

  const updateQuantity = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data()
      await setDoc(docRef, { quantity: existingQuantity + quantity })
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{ backgroundColor: '#FFFFFF' }} // Set background color to white
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="item-name"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="item-quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value, 10))}
              InputProps={{ inputProps: { min: 1 } }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, itemQuantity)
                setItemName('')
                setItemQuantity(1) // Reset quantity
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <TextField
        id="search-field"
        label="Search"
        variant="outlined"
        fullWidth
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
        sx={{ mb: 2, width: '800px' }}
      />
      <Box border={'1px solid #333'} width="800px" overflow="auto">
        <Box
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Box>
          {/* Header Row */}
          <Grid container spacing={2} bgcolor={'#ADD8E6'} paddingY={1} paddingX={2}>
            <Grid item xs={6}>
              <Typography variant="h6" color={'#333'} textAlign="left">
                Item
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" color={'#333'} textAlign="center">
                Quantity
              </Typography>
            </Grid>
            <Grid item xs={3}>
              {/* Empty space for alignment */}
            </Grid>
          </Grid>
          {/* List of Inventory Items */}
          <Box>
            {filteredInventory.length > 0 ? (
              filteredInventory.map(({ name, quantity }) => (
                <Grid container spacing={2} key={name} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant={'body1'} color={'#333'}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                  </Grid>
                  <Grid item xs={3} display="flex" justifyContent="center">
                    <Typography variant={'body1'} color={'#333'}>
                      {quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={3} display="flex" justifyContent="flex-end" spacing={1}>
                    <Button
                      variant="contained"
                      onClick={() => removeItem(name)}
                      sx={{ maxWidth: '120px', whiteSpace: 'nowrap' }}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => updateQuantity(name, 1)}
                      sx={{ maxWidth: '120px', whiteSpace: 'nowrap' }}
                    >
                      Increase Quantity
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => updateQuantity(name, -1)}
                      sx={{ maxWidth: '120px', whiteSpace: 'nowrap' }}
                    >
                      Decrease Quantity
                    </Button>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" textAlign="center">
                No items found
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
