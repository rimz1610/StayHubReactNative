import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import MultiSelect from 'react-native-multiple-select';
import DrawerContent from '../../../../components/DrawerContent'; // Adjust the path as necessary

const initialData = Array.from({ length: 25 }, (_, index) => ({
  id: index.toString(),
  date: `2024-08-${index + 1}`, // Dummy date
  day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index % 7],
  roomName: `Room ${index % 3 + 1}`, // Dummy room names
  price: `$${(index + 1) * 10}`,
  addPricePerPerson: `$${(index + 1) * 2}`,
  bookingAvailable: index % 2 === 0 ? 'Yes' : 'No',
}));

const Drawer = createDrawerNavigator();

const RoomPriceSettingContent = ({ navigation }) => {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [status, setStatus] = useState('Active');
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);


  const itemsPerPage = 10;
  const pages = Math.ceil(data.length / itemsPerPage);

  const handleEdit = (item) => {
    setCurrentItem(item);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (editMode) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentItem.id ? { ...currentItem } : item
        )
      );
    } else {
      setData((prevData) => [...prevData, { ...currentItem, id: Date.now().toString() }]);
    }
    setModalVisible(false);
    setCurrentItem(null);
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
      <Text style={styles.tableCell}>{item.date}</Text>
      <Text style={styles.tableCell}>{item.day}</Text>
      <Text style={styles.tableCell}>{item.roomName}</Text>
      <Text style={styles.tableCell}>{item.price}</Text>
      <Text style={styles.tableCell}>{item.addPricePerPerson}</Text>
      <Text style={styles.tableCell}>{item.bookingAvailable}</Text>
    </View>
  );

  const rooms = [
    { id: '1', name: 'Room 1' },
    { id: '2', name: 'Room 2' },
    { id: '3', name: 'Room 3' },
  ];

  const daysOfWeek = [
    { id: 'mon', name: 'Monday' },
    { id: 'tue', name: 'Tuesday' },
    { id: 'wed', name: 'Wednesday' },
    { id: 'thu', name: 'Thursday' },
    { id: 'fri', name: 'Friday' },
    { id: 'sat', name: 'Saturday' },
    { id: 'sun', name: 'Sunday' },
  ];

  const renderHeader = () => (
    <>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.roomheading}>Room Price & Availability Details</Text>
      
      <TouchableOpacity onPress={() => navigation.navigate('RoomsPriceDetails')} style={styles.backbtn}>
  <Text style={styles.backbtnText}>Back</Text>
</TouchableOpacity>


      <View style={styles.row}>
        <View style={styles.inputContainer}>
        <Text style={styles.labeldate}>From Date</Text>
  {Platform.OS === 'android' && (
    <>
      <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.datePicker}>
        <Text>{fromDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showFromDatePicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowFromDatePicker(false);
            if (selectedDate) setFromDate(selectedDate);
          }}
        />
      )}
    </>
  )}
  {Platform.OS === 'ios' && (
    <DateTimePicker
      value={fromDate}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => setFromDate(selectedDate || fromDate)}
      style={styles.datePicker}
    />
  )}
        </View>
        <View style={styles.inputContainer}>
        <Text style={styles.labeldate}>To Date</Text>
  {Platform.OS === 'android' && (
    <>
      <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.datePicker}>
        <Text>{toDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showToDatePicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowToDatePicker(false);
            if (selectedDate) setToDate(selectedDate);
          }}
        />
      )}
    </>
  )}
  {Platform.OS === 'ios' && (
    <DateTimePicker
      value={toDate}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => setToDate(selectedDate || toDate)}
      style={styles.datePicker}
    />
  )}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.multiSelectContainer}>
          <Text style={styles.label}>Rooms</Text>
          <MultiSelect
            items={rooms}
            uniqueKey="id"
            onSelectedItemsChange={setSelectedRooms}
            selectedItems={selectedRooms}
            selectText="Pick Rooms"
            searchInputPlaceholderText="Search Rooms..."
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#000"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={styles.searchInputStyle}
            styleInputGroup={styles.multiSelect}
            styleDropdownMenuSubsection={styles.multiSelect}
            styleTextDropdown={styles.selectTextStyle}
            styleTextDropdownSelected={styles.selectTextStyle}
            styleSelectorContainer={styles.multiSelect}
            styleChipContainer={styles.chipContainer}
            styleChipText={styles.chipText}
            submitButtonColor="#180161"
            submitButtonText="Select"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.multiSelectContainer}>
          <Text style={styles.label}>Day of Week</Text>
          <MultiSelect
            items={daysOfWeek}
            uniqueKey="id"
            onSelectedItemsChange={setSelectedDays}
            selectedItems={selectedDays}
            selectText="Pick Days"
            searchInputPlaceholderText="Search Days..."
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#000"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            styleInputGroup={styles.multiSelect}
            styleDropdownMenuSubsection={styles.multiSelect}
            styleTextDropdown={styles.selectTextStyle}
            styleTextDropdownSelected={styles.selectTextStyle}
            styleSelectorContainer={styles.multiSelect}
            styleChipContainer={styles.chipContainer}
            styleChipText={styles.chipText}
            submitButtonColor="#180161"
            submitButtonText="Select"
          />
        </View>
      </View>

      <View style={styles.priceContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            placeholder="Price"
            placeholderTextColor={'#888'}
            value={currentItem?.price || ''}
            onChangeText={(text) => setCurrentItem({ ...currentItem, price: text })}
            style={styles.priceInput}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price per Person</Text>
          <TextInput
            placeholder="Price per Person"
            placeholderTextColor={'#888'}
            value={currentItem?.addPricePerPerson || ''}
            onChangeText={(text) => setCurrentItem({ ...currentItem, addPricePerPerson: text })}
            style={styles.priceInput}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {/* Add update logic */}}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {/* Add view logic */}}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText} numberOfLines={1}>Date</Text>
          <Text style={styles.tableHeaderText} numberOfLines={1}>Day</Text>
          <Text style={styles.tableHeaderText} numberOfLines={2}>Room Name</Text>
          <Text style={styles.tableHeaderText}>Price</Text>
          <Text style={styles.tableHeaderText} numberOfLines={2}>Price per Person</Text>
          <Text style={styles.tableHeaderText} numberOfLines={2}>Booking Available</Text>
        </View>
      </View>
    </>
  );

  const renderFooter = () => (
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
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <FlatList
        data={data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.scrollViewContent}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editMode ? 'Edit Item' : 'Add New Item'}</Text>
            <TextInput
              placeholder="Date"
              value={currentItem?.date || ''}
              onChangeText={(text) => setCurrentItem({ ...currentItem, date: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Day"
              value={currentItem?.day || ''}
              onChangeText={(text) => setCurrentItem({ ...currentItem, day: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Room Name"
              value={currentItem?.roomName || ''}
              onChangeText={(text) => setCurrentItem({ ...currentItem, roomName: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Price"
              value={currentItem?.price || ''}
              onChangeText={(text) => setCurrentItem({ ...currentItem, price: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Price per Person"
              value={currentItem?.addPricePerPerson || ''}
              onChangeText={(text) => setCurrentItem({ ...currentItem, addPricePerPerson: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Booking Available"
              value={currentItem?.bookingAvailable || ''}
              onChangeText={(text) => setCurrentItem({ ...currentItem, bookingAvailable: text })}
              style={styles.input}
            />
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const RoomPriceSetting = () => {
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
      <Drawer.Screen name="RoomPriceAvailabilityDetailsContent" component={RoomPriceSettingContent} />
    </Drawer.Navigator>
  );
};
export default RoomPriceSetting;
const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: { 
    padding: 20,
  },
  menuButton: { 
    marginBottom: 20,
  },
  roomheading: { 
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#180161',
  },
  backbtn: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#180161',
    borderRadius: 4,
    alignSelf:'flex-end'
  },
  backbtnText: {
    color: 'white',
    fontSize: 16,
  },
  row: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
    inputContainer: { 
      flex: 1,
      marginHorizontal: 5,
    },
    labeldate: { 
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333',
      marginLeft:30
    },
    datePickerTouchable: {
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: 'white',
    },
    dateText: {
      fontSize: 16,
      color: '#333',
    },
    datePicker: { 
      width: '100%',
      justifyContent: 'space-between',
      backgroundColor: 'transparent',
    },
  multiSelectContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  multiSelect: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  selectTextStyle: {
    fontSize: 16,
    color: '#888', 
    textAlign: 'left',
    paddingLeft:10,
  },
  searchInputStyle: {
    color: '#333',
    fontSize: 16,
  },
  chipContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 5,
    marginBottom: 5,
  },
  chipText: {
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
    fontSize: 16,
  
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#180161',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableContainer: { 
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    // backgroundColor: '#180161',
    color:'black',
    padding: 12,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    // color: 'white',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  tableCell: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    color: '#444',
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
  modalOverlay: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: { 
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: { 
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#180161',
  },
  input: { 
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
    padding: 8,
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { 
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'white',
  },
  inputAndroid: { 
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'white',
  },
});


