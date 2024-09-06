import { StyleSheet, Text, View, FlatList, Pressable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import DrawerContent from '../../../../components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import moment from "moment";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Drawer = createDrawerNavigator();
const DashboardContent = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const isFocused = useIsFocused();
  const guestOptions = [
    { label: 'Guest 1', value: 1 },
    { label: 'Guest 2', value: 2 },
    { label: 'Guest 3', value: 3 },
  ];

  const statusOptions = [
    { label: 'Paid', value: 'Paid' },
    { label: 'UnPaid', value: 'UnPaid' },
    //{ label: 'Cancelled', value: 'Cancelled' },
  ];

  // const tableData = [
  //   { id: '1', bookingNo: 'B1', name: 'Mohtashim', date: '2024-08-01', totalAmount: '$100', paidAmount: '$50', status: 'Pending' },
  //   { id: '2', bookingNo: 'B2', name: 'Fazal', date: '2024-08-02', totalAmount: '$150', paidAmount: '$150', status: 'Completed' },
  //   { id: '3', bookingNo: 'B3', name: 'Moiz', date: '2024-08-03', totalAmount: '$200', paidAmount: '$0', status: 'Pending' },
  //   // Add more data to test pagination
  //   { id: '4', bookingNo: 'B4', name: 'John', date: '2024-08-04', totalAmount: '$250', paidAmount: '$200', status: 'Pending' },
  //   { id: '5', bookingNo: 'B5', name: 'Jane', date: '2024-08-05', totalAmount: '$300', paidAmount: '$150', status: 'Completed' },
  //   { id: '6', bookingNo: 'B6', name: 'Doe', date: '2024-08-06', totalAmount: '$350', paidAmount: '$100', status: 'Pending' },
  //   { id: '7', bookingNo: 'B4', name: 'John', date: '2024-08-04', totalAmount: '$250', paidAmount: '$200', status: 'Pending' },
  //   { id: '8', bookingNo: 'B5', name: 'Jane', date: '2024-08-05', totalAmount: '$300', paidAmount: '$150', status: 'Completed' },
  //   { id: '9', bookingNo: 'B6', name: 'Doe', date: '2024-08-06', totalAmount: '$350', paidAmount: '$100', status: 'Pending' },
  //   { id: '10', bookingNo: 'B4', name: 'John', date: '2024-08-04', totalAmount: '$250', paidAmount: '$200', status: 'Pending' },
  //   { id: '11', bookingNo: 'B5', name: 'Jane', date: '2024-08-05', totalAmount: '$300', paidAmount: '$150', status: 'Completed' },
  //   { id: '12', bookingNo: 'B6', name: 'Doe', date: '2024-08-06', totalAmount: '$350', paidAmount: '$100', status: 'Pending' },
  // ];

  // Calculate the data slice for the current page
  //const paginatedData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);
  const handleStatusChange = (status) => {
  
    setSelectedStatus(status);
    fetchData();
  }
  const handleGuestChange = (gId) => {
  
    setSelectedGuest(gId);
    fetchData();
  }

  // Function to refetch the updated room list
  const fetchData = async () => {
    const token = await AsyncStorage.getItem('token');

    setLoading(true);
    try {
      const response = await axios.get("http://majidalipl-001-site5.gtempurl.com/Booking/GetBookings?status" +
        selectedStatus + "&guestId=" + selectedGuest, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        setData(response.data.list);
        setPages(Math.ceil(response.data.list.length / itemsPerPage));
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.warn(error);
      Alert.alert('Error', 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };


  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < pages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'previous' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell} numberOfLines={1}>{item.referenceNumber}</Text>
      <Text style={styles.tableCell} numberOfLines={1}>{item.firstName}</Text>
      <Text style={styles.tableCell} numberOfLines={1}>{item.bookingDate}</Text>
      <Text style={styles.tableCell} numberOfLines={1}>{item.bookingDate}</Text>
      <Text style={styles.tableCell} numberOfLines={1}>{item.bookingDate}</Text>
      <View style={styles.tableActions}>
        <TouchableOpacity onPress={() => navigation.navigate('BookingDetails', { id: item.id })} style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Details</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
  const renderEmptyTable = () => (
    <View style={styles.emptyTableContainer}>
      <Text style={styles.emptyTableText}>No rows are added</Text>
    </View>
  );





  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.bookingtxt}>Bookings</Text>
      <View style={styles.options}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Guest</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select a guest...', value: '' }}
            onValueChange={(value) => handleGuestChange(value)}
            items={guestOptions}
            style={pickerSelectStyles}
            value={selectedGuest}
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Status</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select status...', value: '' }}
            onValueChange={(value) => handleStatusChange(value)}
            items={statusOptions}
            style={pickerSelectStyles}
            value={selectedStatus}
          />
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>RefNo</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Date</Text>
          <Text style={styles.tableHeaderText}>Total</Text>
          <Text style={styles.tableHeaderText}>Paid</Text>
          <Text style={styles.tableHeaderText}>Status</Text>
          <Text style={styles.tableHeaderText}>Action</Text>
        </View>
        {data.length > 0 ? (
          <FlatList
            data={data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          renderEmptyTable()
        )}
      </View>

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={() => handlePageChange('previous')}
          style={[styles.paginationButton, currentPage === 0 && styles.disabledButton]}
          disabled={currentPage === 0}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          Page {currentPage + 1} of {pages}
        </Text>
        <TouchableOpacity
          onPress={() => handlePageChange('next')}
          style={[styles.paginationButton, currentPage === pages - 1 && styles.disabledButton]}
          disabled={currentPage === pages - 1}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for adding/editing */}

    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    backgroundColor: 'white',
  },
});

const Dashboard = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '60%',
        },
      }}
    >
      <Drawer.Screen name="BookingList" component={DashboardContent} />
    </Drawer.Navigator>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  bookingtxt: {
    color: '#180161',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  options: {
    marginTop: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tableContainer: {
    marginTop: 30,
    height: '50%',
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
    color: '#333',
    numberOfLines: 1, // Ensure text is limited to a single line
    overflow: 'hidden', // Hide any overflow text
    textOverflow: 'ellipsis', // Add ellipsis if text overflows
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: '#180161',
  },
  paginationButtonText: {
    fontSize: 14,
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    color: '#180161',
    fontSize: 16,
  },
  paginationTextbtn: {
    color: 'white',
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 14,
  },
  nextbtn: {
    position: 'absolute',
    top: 25,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
  },
  skipText: {
    color: 'blue',
    fontSize: 12,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  tableActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  detailButton: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  detailButtonText: {
    color: 'white',
    fontSize: 12,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  emptyTableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyTableText: {
    fontSize: 16,
    color: '#666',
  },
});


