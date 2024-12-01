import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Alert,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import nlLocale from "date-fns/locale/nl";
import { CSVLink } from "react-csv";
import { useTable, useFilters } from "react-table";
import GetAppIcon from "@mui/icons-material/GetApp";

function ManageCustomer() {
  const theme = useTheme();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    subscription: "",
    birthDate: null,
    address: {
      country: "",
      postalCode: "",
      street: "",
      houseNumber: "",
      busNumber: "",
      city: "",
    },
  });
  const [subscriptions, setSubscriptions] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/customers");
        const data = await response.json();
        if (data.length === 0) {
          setCustomers([
            {
              _id: "exampleId1",
              name: "Voorbeeld Klant",
              email: "voorbeeld@email.com",
              phone: "+32 123 456 789",
              subscription: { name: "Pro Abonnement" },
            },
          ]);
        } else {
          setCustomers(data);
        }
      } catch (error) {
        console.error("Fout bij het ophalen van klanten:", error);
        setCustomers([
          {
            _id: "exampleId1",
            name: "Voorbeeld Klant",
            email: "voorbeeld@email.com",
            phone: "+32 123 456 789",
            subscription: { name: "Pro Abonnement" },
          },
        ]);
      }
    };

    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/subscriptions");
        const data = await response.json();
        setSubscriptions(data);
      } catch (error) {
        console.error("Fout bij het ophalen van abonnementen:", error);
      }
    };

    fetchCustomers();
    fetchSubscriptions();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Naam",
        accessor: "name",
        Filter: ({ column: { filterValue, setFilter } }) => (
          <TextField
            value={filterValue || ""}
            onChange={(e) => setFilter(e.target.value || undefined)}
            placeholder="Filter op naam"
            fullWidth
            margin="normal"
          />
        ),
      },
      {
        Header: "Email",
        accessor: "email",
        Filter: ({ column: { filterValue, setFilter } }) => (
          <TextField
            value={filterValue || ""}
            onChange={(e) => setFilter(e.target.value || undefined)}
            placeholder="Filter op email"
            fullWidth
            margin="normal"
          />
        ),
      },
      // Voeg meer kolommen toe indien nodig
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: customers,
      },
      useFilters
    );

  const handleSelect = (customerId) => {
    setSelectedCustomers((prevSelected) =>
      prevSelected.includes(customerId)
        ? prevSelected.filter((id) => id !== customerId)
        : [...prevSelected, customerId]
    );
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      setNotification({
        open: true,
        message: "Vul alle verplichte velden in.",
        severity: "error",
      });
      return;
    }

    const customerData = {
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      subscription: newCustomer.subscription,
      birthDate: newCustomer.birthDate,
      address: {
        country: newCustomer.address.country,
        postalCode: newCustomer.address.postalCode,
        street: newCustomer.address.street,
        houseNumber: newCustomer.address.houseNumber,
        busNumber: newCustomer.address.busNumber,
        city: newCustomer.address.city,
      },
    };

    try {
      const response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error("Fout bij het aanmaken van een klant.");
      }

      const savedCustomer = await response.json();
      setCustomers((prev) => [...prev, savedCustomer]);
      setShowModal(false);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        subscription: "",
        birthDate: null,
        address: {
          country: "",
          postalCode: "",
          street: "",
          houseNumber: "",
          busNumber: "",
          city: "",
        },
      });
      setNotification({
        open: true,
        message: "Klant succesvol aangemaakt.",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box p={2}>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <h2>Klanten Beheren</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
        >
          + Nieuw
        </Button>
        <CSVLink
          data={customers}
          headers={[
            { label: "Naam", key: "name" },
            { label: "Email", key: "email" },
            { label: "Telefoon", key: "phone" },
            // Voeg hier meer velden toe indien nodig
          ]}
          filename="Klantenlijst.csv"
          style={{ textDecoration: "none" }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<GetAppIcon />}
          >
            Exporteren
          </Button>
        </CSVLink>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead style={{ backgroundColor: theme.palette.grey[200] }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedCustomers.length > 0 &&
                      selectedCustomers.length < customers.length
                    }
                    checked={
                      customers.length > 0 &&
                      selectedCustomers.length === customers.length
                    }
                    onChange={(e) =>
                      setSelectedCustomers(
                        e.target.checked ? customers.map((c) => c._id) : []
                      )
                    }
                  />
                </TableCell>
                <TableCell>Naam</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefoon</TableCell>
                <TableCell>Abonnement</TableCell>
                <TableCell align="right">Acties</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomers.includes(customer._id)}
                      onChange={() => handleSelect(customer._id)}
                    />
                  </TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {customer.subscription?.name || "Geen abonnement"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton color="secondary">
                      <Edit />
                    </IconButton>
                    <IconButton color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell {...column.getHeaderProps()}>
                      {column.render("Header")}
                      <div>
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Klantgegevens</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box>
              <p>
                <strong>Naam:</strong> {selectedCustomer.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.email}
              </p>
              <p>
                <strong>Telefoon:</strong> {selectedCustomer.phone}
              </p>
              <p>
                <strong>Abonnement:</strong>{" "}
                {selectedCustomer.subscription?.name || "Geen abonnement"}
              </p>
              <p>
                <strong>Geboortedatum:</strong>{" "}
                {selectedCustomer.birthDate
                  ? new Date(selectedCustomer.birthDate).toLocaleDateString(
                      "nl-NL"
                    )
                  : "Onbekend"}
              </p>
              <p>
                <strong>Adres:</strong>{" "}
                {selectedCustomer.address
                  ? `${selectedCustomer.address.street || ""} ${
                      selectedCustomer.address.houseNumber || ""
                    }${
                      selectedCustomer.address.busNumber
                        ? " bus " + selectedCustomer.address.busNumber
                        : ""
                    }, ${selectedCustomer.address.postalCode || ""} ${
                      selectedCustomer.address.city || ""
                    }, ${selectedCustomer.address.country || ""}`
                  : "Onbekend"}
              </p>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)} color="primary">
            Sluiten
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modaal voor het toevoegen van een nieuwe klant */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Nieuwe Klant Aanmaken</DialogTitle>
        <DialogContent>
          <TextField
            label="Naam"
            fullWidth
            margin="normal"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
            required
          />
          <TextField
            label="Telefoon"
            fullWidth
            margin="normal"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Abonnement</InputLabel>
            <Select
              value={newCustomer.subscription}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  subscription: e.target.value,
                })
              }
            >
              <MenuItem value="">
                <em>Geen</em>
              </MenuItem>
              {subscriptions.map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={nlLocale}
          >
            <DatePicker
              label="Geboortedatum"
              value={newCustomer.birthDate}
              onChange={(date) =>
                setNewCustomer({ ...newCustomer, birthDate: date })
              }
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </LocalizationProvider>
          <TextField
            label="Land"
            fullWidth
            margin="normal"
            value={newCustomer.address.country}
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                address: {
                  ...newCustomer.address,
                  country: e.target.value,
                },
              })
            }
            required
          />
          <TextField
            label="Postcode"
            fullWidth
            margin="normal"
            value={newCustomer.address.postalCode}
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                address: {
                  ...newCustomer.address,
                  postalCode: e.target.value,
                },
              })
            }
            required
          />
          <TextField
            label="Stad/Gemeente"
            fullWidth
            margin="normal"
            value={newCustomer.address.city}
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                address: {
                  ...newCustomer.address,
                  city: e.target.value,
                },
              })
            }
            required
          />
          <TextField
            label="Straat"
            fullWidth
            margin="normal"
            value={newCustomer.address.street}
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                address: {
                  ...newCustomer.address,
                  street: e.target.value,
                },
              })
            }
            required
          />
          <TextField
            label="Huisnummer"
            fullWidth
            margin="normal"
            value={newCustomer.address.houseNumber}
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                address: {
                  ...newCustomer.address,
                  houseNumber: e.target.value,
                },
              })
            }
            required
          />
          <TextField
            label="Busnummer"
            fullWidth
            margin="normal"
            value={newCustomer.address.busNumber}
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                address: {
                  ...newCustomer.address,
                  busNumber: e.target.value,
                },
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="secondary">
            Annuleren
          </Button>
          <Button
            onClick={handleCreateCustomer}
            color="primary"
            variant="contained"
          >
            Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageCustomer;