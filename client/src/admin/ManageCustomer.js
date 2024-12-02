////////////////////////////////////////////
////////////////////////////////////////////
//////////////// IMPORTS ///////////////////
////// Hier importeren we alle benodigde ///
////// modules en componenten            ///
////////////////////////////////////////////
////////////////////////////////////////////

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
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  FilterList,
  GetApp as GetAppIcon,
  Report,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import nlLocale from "date-fns/locale/nl";
import { CSVLink } from "react-csv";
import { useTable, useFilters } from "react-table";

////////////////////////////////////////////
////////////////////////////////////////////
////////////// COMPONENT ///////////////////
/////// Dit is de hoofdcomponent voor //////
/////// het beheren van klanten         ////
////////////////////////////////////////////
////////////////////////////////////////////

function ManageCustomer() {
  ////////////////////////////////////////////
  ////////////////////////////////////////////
  //////// STATE DECLARATIES /////////////////
  //// Hier definiëren we alle useState //////
  //// hooks voor het beheren van de     /////
  //// componentstatus                   /////
  ////////////////////////////////////////////
  ////////////////////////////////////////////

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
  const [filtering, setFiltering] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  // Nieuw toegevoegde states voor het bewerken
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ////////////// DATA FETCHING ///////////////
  //// Hier halen we data op van de API //////
  //// met behulp van useEffect hooks    /////
  ////////////////////////////////////////////
  ////////////////////////////////////////////

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
              subscription: {
                name: "Pro Abonnement",
                expiryDate: "2024-12-31T00:00:00Z",
              },
              createdAt: "2023-01-15T10:00:00Z",
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

  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ///////////// TABEL KOLONNEN ///////////////
  //// Hier definiëren we de kolommen voor ///
  //// de react-table                      ///
  ////////////////////////////////////////////
  ////////////////////////////////////////////

  const columns = useMemo(
    () => [
      {
        Header: "Naam",
        accessor: "name",
        Filter: ({ column: { filterValue, setFilter } }) =>
          filtering ? (
            <TextField
              value={filterValue || ""}
              onChange={(e) => setFilter(e.target.value || undefined)}
              placeholder="Filter op naam"
              fullWidth
              margin="normal"
            />
          ) : null,
      },
      {
        Header: "Email",
        accessor: "email",
        Filter: ({ column: { filterValue, setFilter } }) =>
          filtering ? (
            <TextField
              value={filterValue || ""}
              onChange={(e) => setFilter(e.target.value || undefined)}
              placeholder="Filter op email"
              fullWidth
              margin="normal"
            />
          ) : null,
      },
      {
        Header: "Telefoon",
        accessor: "phone",
        Filter: ({ column: { filterValue, setFilter } }) =>
          filtering ? (
            <TextField
              value={filterValue || ""}
              onChange={(e) => setFilter(e.target.value || undefined)}
              placeholder="Filter op telefoon"
              fullWidth
              margin="normal"
            />
          ) : null,
      },
      {
        Header: "Abonnement",
        accessor: "subscription.name",
        Filter: ({ column: { filterValue, setFilter } }) =>
          filtering ? (
            <TextField
              value={filterValue || ""}
              onChange={(e) => setFilter(e.target.value || undefined)}
              placeholder="Filter op abonnement"
              fullWidth
              margin="normal"
            />
          ) : null,
      },
      {
        Header: "Aangemaakt op",
        accessor: "createdAt",
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString("nl-NL") : "Onbekend",
        Filter: ({ column: { filterValue, setFilter } }) =>
          filtering ? (
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={nlLocale}
            >
              <DatePicker
                label="Filter op datum"
                value={filterValue || null}
                onChange={(date) =>
                  setFilter(date ? date.toISOString() : undefined)
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </LocalizationProvider>
          ) : null,
      },
      {
        Header: "Verloopdatum",
        accessor: "subscription.expiryDate",
        Cell: ({ row }) =>
          row.original.subscription?.expiryDate
            ? new Date(row.original.subscription.expiryDate).toLocaleDateString(
                "nl-NL"
              )
            : "N/B",
        Filter: ({ column: { filterValue, setFilter } }) =>
          filtering ? (
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={nlLocale}
            >
              <DatePicker
                label="Filter op verloopdatum"
                value={filterValue || null}
                onChange={(date) =>
                  setFilter(date ? date.toISOString() : undefined)
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </LocalizationProvider>
          ) : null,
      },
    ],
    [filtering]
  );

  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ////////// TABEL INSTELLINGEN //////////////
  //// Initialiseren van de react-table //////
  //// instance met kolommen en data      ////
  ////////////////////////////////////////////
  ////////////////////////////////////////////

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: customers,
      },
      useFilters
    );

  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ///////////// EVENT HANDLERS ///////////////
  //// Functies voor events zoals selectie, //
  //// weergave en creëren van klanten     ///
  ////////////////////////////////////////////
  ////////////////////////////////////////////

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

  const handleSendReport = async () => {
    try {
      // Implementeer hier je API-aanroep om het rapport te verzenden
      const response = await fetch("http://localhost:5000/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reportMessage }),
      });

      if (!response.ok) {
        throw new Error("Fout bij het versturen van het rapport.");
      }

      setNotification({
        open: true,
        message: "Rapport succesvol verstuurd.",
        severity: "success",
      });
      setReportModalOpen(false);
      setReportMessage("");
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

  // Nieuw toegevoegde functies voor bewerken

  const handleEditCustomer = (customer) => {
    setCustomerToEdit(customer);
    setEditModalOpen(true);
  };

  const handleSaveEditedCustomer = async () => {
    if (
      !customerToEdit.name ||
      !customerToEdit.email ||
      !customerToEdit.phone
    ) {
      setNotification({
        open: true,
        message: "Vul alle verplichte velden in.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${customerToEdit._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerToEdit),
        }
      );

      if (!response.ok) {
        throw new Error("Fout bij het bijwerken van de klant.");
      }

      const updatedCustomer = await response.json();

      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === updatedCustomer._id ? updatedCustomer : customer
        )
      );

      setEditModalOpen(false);
      setNotification({
        open: true,
        message: "Klant succesvol bijgewerkt.",
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

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${customerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Fout bij het verwijderen van de klant.");
      }

      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== customerId)
      );

      setNotification({
        open: true,
        message: "Klant succesvol verwijderd.",
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

  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ///////////////// RENDER ///////////////////
  //// Hier renderen we de component met /////
  //// alle UI-elementen                //////
  ////////////////////////////////////////////
  ////////////////////////////////////////////

  return (
    <Box p={2}>
      {/* Snackbar voor meldingen */}
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

      {/* Header met knoppen */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <h2>Klanten Beheren</h2>
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            color="success" // Groen
            onClick={() => setShowModal(true)}
            style={{ marginRight: 8 }}
          >
            + Nieuw
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterList />}
            onClick={() => setFiltering(!filtering)}
            style={{ marginRight: 8 }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            color="error" // Rood
            startIcon={<Report />}
            onClick={() => setReportModalOpen(true)}
            style={{ marginRight: 8 }}
          >
            Report
          </Button>
          <CSVLink
            data={customers}
            headers={[
              { label: "Naam", key: "name" },
              { label: "Email", key: "email" },
              { label: "Telefoon", key: "phone" },
              { label: "Abonnement", key: "subscription.name" },
              { label: "Aangemaakt op", key: "createdAt" },
              { label: "Verloopdatum", key: "subscription.expiryDate" },
            ]}
            filename="Klantenlijst.csv"
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "#d3d3d3", // Lichtgrijs
                color: "#000",
                marginLeft: 8,
              }}
              startIcon={<GetAppIcon />}
            >
              Exporteren
            </Button>
          </CSVLink>
        </Box>
      </Box>

      {/* Tabel met klanten */}
      <Paper>
        <TableContainer>
          <Table {...getTableProps()}>
            <TableHead style={{ backgroundColor: theme.palette.grey[200] }}>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
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
                  {headerGroup.headers.map((column) => (
                    <TableCell {...column.getHeaderProps()}>
                      {column.render("Header")}
                      {filtering && (
                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="right">Acties</TableCell>
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                const customer = row.original;
                return (
                  <TableRow {...row.getRowProps()} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomers.includes(customer._id)}
                        onChange={() => handleSelect(customer._id)}
                      />
                    </TableCell>
                    {row.cells.map((cell) => (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCustomer(customer._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Report Modal */}
      <Dialog
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Probleem Melden</DialogTitle>
        <DialogContent>
          <TextField
            label="Uw Bericht"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={reportMessage}
            onChange={(e) => setReportMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportModalOpen(false)} color="secondary">
            Annuleren
          </Button>
          <Button
            onClick={handleSendReport}
            color="primary"
            variant="contained"
          >
            Versturen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modaal voor het bekijken van klantgegevens */}
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
              <p>
                <strong>Aangemaakt op:</strong>{" "}
                {selectedCustomer.createdAt
                  ? new Date(selectedCustomer.createdAt).toLocaleDateString(
                      "nl-NL"
                    )
                  : "Onbekend"}
              </p>
              <p>
                <strong>Verloopdatum:</strong>{" "}
                {selectedCustomer.subscription?.expiryDate
                  ? new Date(
                      selectedCustomer.subscription.expiryDate
                    ).toLocaleDateString("nl-NL")
                  : "N/B"}
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
          {/* Formulier velden voor nieuwe klant */}
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

      {/* Modaal voor het bewerken van klantgegevens */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Klantgegevens Bewerken</DialogTitle>
        <DialogContent>
          {customerToEdit && (
            <>
              <TextField
                label="Naam"
                fullWidth
                margin="normal"
                value={customerToEdit.name}
                onChange={(e) =>
                  setCustomerToEdit({ ...customerToEdit, name: e.target.value })
                }
                required
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={customerToEdit.email}
                onChange={(e) =>
                  setCustomerToEdit({
                    ...customerToEdit,
                    email: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="Telefoon"
                fullWidth
                margin="normal"
                value={customerToEdit.phone}
                onChange={(e) =>
                  setCustomerToEdit({
                    ...customerToEdit,
                    phone: e.target.value,
                  })
                }
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Abonnement</InputLabel>
                <Select
                  value={
                    customerToEdit.subscription?._id ||
                    customerToEdit.subscription ||
                    ""
                  }
                  onChange={(e) =>
                    setCustomerToEdit({
                      ...customerToEdit,
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
                  value={
                    customerToEdit.birthDate
                      ? new Date(customerToEdit.birthDate)
                      : null
                  }
                  onChange={(date) =>
                    setCustomerToEdit({ ...customerToEdit, birthDate: date })
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" />
                  )}
                />
              </LocalizationProvider>

              {/* Adres velden */}
              <TextField
                label="Land"
                fullWidth
                margin="normal"
                value={customerToEdit.address?.country || ""}
                onChange={(e) =>
                  setCustomerToEdit({
                    ...customerToEdit,
                    address: {
                      ...customerToEdit.address,
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
                value={customerToEdit.address?.postalCode || ""}
                onChange={(e) =>
                  setCustomerToEdit({
                    ...customerToEdit,
                    address: {
                      ...customerToEdit.address,
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
                value={customerToEdit.address?.city || ""}
                onChange={(e) =>
                  setCustomerToEdit({
                    ...customerToEdit,
                    address: {
                      ...customerToEdit.address,
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
                value={customerToEdit.address?.street || ""}
                onChange={(e) =>
                  setCustomerToEdit({
                    ...customerToEdit,
                    address: {
                      ...customerToEdit.address,
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
                value={customerToEdit.address?.houseNumber || ""}
                onChange={(e) =>
                  setCustomerToEdit({
                    ...customerToEdit,
                    address: {
                      ...customerToEdit.address,
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
                value={customerToEdit.address?.busNumber || ""}
                onChange={(e) =>
                  setCustomerToEdit({
                    ...customerToEdit,
                    address: {
                      ...customerToEdit.address,
                      busNumber: e.target.value,
                    },
                  })
                }
              />

              {/* Aangemaakt op */}
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={nlLocale}
              >
                <DatePicker
                  label="Aangemaakt op"
                  value={
                    customerToEdit.createdAt
                      ? new Date(customerToEdit.createdAt)
                      : null
                  }
                  onChange={(date) =>
                    setCustomerToEdit({ ...customerToEdit, createdAt: date })
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" />
                  )}
                />
              </LocalizationProvider>

              {/* Verloopdatum */}
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={nlLocale}
              >
                <DatePicker
                  label="Verloopdatum"
                  value={
                    customerToEdit.subscription?.expiryDate
                      ? new Date(customerToEdit.subscription.expiryDate)
                      : null
                  }
                  onChange={(date) =>
                    setCustomerToEdit({
                      ...customerToEdit,
                      subscription: {
                        ...customerToEdit.subscription,
                        expiryDate: date,
                      },
                    })
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" />
                  )}
                />
              </LocalizationProvider>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="secondary">
            Annuleren
          </Button>
          <Button
            onClick={handleSaveEditedCustomer}
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

////////////////////////////////////////////
////////////////////////////////////////////
/////////// EXPORT STATEMENT //////////////
////// Hier exporteren we de component /////
////////////////////////////////////////////
////////////////////////////////////////////

export default ManageCustomer;
