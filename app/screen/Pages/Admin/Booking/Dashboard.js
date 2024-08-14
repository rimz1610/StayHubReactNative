import { StyleSheet, Text, View, FlatList,Pressable , TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select'; 
import DrawerContent from '../../../../components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';


const Drawer = createDrawerNavigator();
const DashboardContent = ({ navigation }) => {
  const [selectedGuest, setSelectedGuest] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const guestOptions = [
    { label: 'Guest 1', value: 'guest1' },
    { label: 'Guest 2', value: 'guest2' },
    { label: 'Guest 3', value: 'guest3' },
  ];

  const paymentOptions = [
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
  ];

  const tableData = [
    { id: '1', bookingNo: 'B1', name: 'Mohtashim', date: '2024-08-01', totalAmount: '$100', paidAmount: '$50', status: 'Pending' },
    { id: '2', bookingNo: 'B2', name: 'Fazal', date: '2024-08-02', totalAmount: '$150', paidAmount: '$150', status: 'Completed' },
    { id: '3', bookingNo: 'B3', name: 'Moiz', date: '2024-08-03', totalAmount: '$200', paidAmount: '$0', status: 'Pending' },
    // Add more data to test pagination
    { id: '4', bookingNo: 'B4', name: 'John', date: '2024-08-04', totalAmount: '$250', paidAmount: '$200', status: 'Pending' },
    { id: '5', bookingNo: 'B5', name: 'Jane', date: '2024-08-05', totalAmount: '$300', paidAmount: '$150', status: 'Completed' },
    { id: '6', bookingNo: 'B6', name: 'Doe', date: '2024-08-06', totalAmount: '$350', paidAmount: '$100', status: 'Pending' },
    { id: '7', bookingNo: 'B4', name: 'John', date: '2024-08-04', totalAmount: '$250', paidAmount: '$200', status: 'Pending' },
    { id: '8', bookingNo: 'B5', name: 'Jane', date: '2024-08-05', totalAmount: '$300', paidAmount: '$150', status: 'Completed' },
    { id: '9', bookingNo: 'B6', name: 'Doe', date: '2024-08-06', totalAmount: '$350', paidAmount: '$100', status: 'Pending' },
    { id: '10', bookingNo: 'B4', name: 'John', date: '2024-08-04', totalAmount: '$250', paidAmount: '$200', status: 'Pending' },
    { id: '11', bookingNo: 'B5', name: 'Jane', date: '2024-08-05', totalAmount: '$300', paidAmount: '$150', status: 'Completed' },
    { id: '12', bookingNo: 'B6', name: 'Doe', date: '2024-08-06', totalAmount: '$350', paidAmount: '$100', status: 'Pending' },
  ];

  // Calculate the data slice for the current page
  const paginatedData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < tableData.length) {
      setCurrentPage(currentPage + 1);
    }
  };


 
  const renderTableItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.bookingNo}</Text>
      <Text style={styles.tableCell}>{item.name}</Text>
      <Text style={styles.tableCell}>{item.date}</Text>
      <Text style={styles.tableCell}>{item.totalAmount}</Text>
      <Text style={styles.tableCell}>{item.paidAmount}</Text>
      <Text style={styles.tableCell}>{item.status}</Text>
      <View style={styles.tableActions}>
        <TouchableOpacity  onPress={() => navigation.navigate('BookingDetails')}
        style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Detail</Text>
        </TouchableOpacity>
      </View>
     
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.bookingtxt}>Booking</Text>
      {/* <TouchableOpacity style={styles.nextbtn} onPress={() => navigation.navigate('Postpages')}>
        <Text style={styles.skipText}>Next page</Text>
    </TouchableOpacity> */}
      <View style={styles.options}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Guest</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select a guest...', value: '' }}
            onValueChange={(value) => setSelectedGuest(value)}
            items={guestOptions}
            style={pickerSelectStyles}
            value={selectedGuest}
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Payment Type</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select a payment type...', value: '' }}
            onValueChange={(value) => setSelectedPaymentType(value)}
            items={paymentOptions}
            style={pickerSelectStyles}
            value={selectedPaymentType}
          />
        </View>
      </View>
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Booking No</Text>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Total Amount</Text>
          <Text style={styles.headerCell}>Paid Amount</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Action</Text>
        </View>
        <FlatList
          data={paginatedData}
          renderItem={renderTableItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationTextbtn}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>Page {currentPage}</Text>
        <TouchableOpacity
          style={[styles.paginationButton, (currentPage * itemsPerPage >= tableData.length) && styles.disabledButton]}
          onPress={handleNextPage}
          disabled={currentPage * itemsPerPage >= tableData.length}
        >
          <Text style={styles.paginationTextbtn}>Next</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#180161',
    borderRadius: 4,
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
});


