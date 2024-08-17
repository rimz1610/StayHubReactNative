import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import DrawerContent from '../../../../components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import MultiSelect from 'react-native-multiple-select';

const initialData = Array.from({ length: 25 }, (_, index) => ({
  id: index.toString(),
  date: `2024-08-${index + 1}`,
  day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index % 7],
  roomName: `Room ${index % 3 + 1}`,
  price: `$${(index + 1) * 10}`,
  addPricePerPerson: `$${(index + 1) * 2}`,
  bookingAvailable: index % 2 === 0 ? 'Yes' : 'No',
}));

const Drawer = createDrawerNavigator();

const RoomPriceAvailabilityDetailsContent = ({ navigation }) => {
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
      <View style={styles.tableActions}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
          <Ionicons name="pencil" size={14} color="white" />
        </TouchableOpacity>
      </View>
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate('RoomsPriceSetting');
        }}
      >
        <Text style={styles.addButtonText}>Update Bulk Prices</Text>
      </TouchableOpacity>

      <View style={styles.row}>
      <View style={styles.inputContainer}>
  <Text style={styles.label}>From Date</Text>
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
        <Text style={styles.label}>To Date</Text>
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Status</Text>
          <RNPickerSelect
            onValueChange={(value) => setStatus(value)}
            value={status}
            items={[
              { label: 'Active', value: 'Active' },
              { label: 'Pending', value: 'Pending' },
            ]}
            style={pickerSelectStyles}
          />
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

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText} numberOfLines={1}>Date</Text>
        <Text style={styles.tableHeaderText} numberOfLines={1} ellipsizeMode="tail">Day</Text>
        <Text style={styles.tableHeaderText} numberOfLines={2} ellipsizeMode="tail">Room Name</Text>
        <Text style={styles.tableHeaderText} numberOfLines={1} ellipsizeMode="tail">Price</Text>
        <Text style={styles.tableHeaderText} numberOfLines={2} ellipsizeMode="tail">Add Price per Person</Text>
        <Text style={styles.tableHeaderText} numberOfLines={2} >Booking Available</Text>
        <Text style={styles.tableHeaderText} numberOfLines={1} ellipsizeMode="tail"><Ionicons name="construct" size={12} color="black" /></Text>
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
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Room Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Room Name"
              placeholderTextColor="#888"
              value={currentItem?.roomName}
              onChangeText={(text) => setCurrentItem({ ...currentItem, roomName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              placeholderTextColor="#888"
              value={currentItem?.price}
              onChangeText={(text) => setCurrentItem({ ...currentItem, price: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Additional Price Per Person"
              placeholderTextColor="#888"
              value={currentItem?.addPricePerPerson}
              onChangeText={(text) => setCurrentItem({ ...currentItem, addPricePerPerson: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Booking Available"
              placeholderTextColor="#888"
              value={currentItem?.bookingAvailable}
              onChangeText={(text) => setCurrentItem({ ...currentItem, bookingAvailable: text })}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF6347" />
              <Button title="Save" onPress={handleSave} color="#180161" />
            </View>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
    
  );
};

const RoomPriceAvailabilityDetails = () => {
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
      <Drawer.Screen name="RoomPriceAvailabilityDetailsContent" component={RoomPriceAvailabilityDetailsContent} />
    </Drawer.Navigator>
  );
};

export default RoomPriceAvailabilityDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    zIndex: 1,
},
  roomheading: {
    color: '#180161',
    width:'80%',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    left:40,
    marginVertical: 20,
  },
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#180161',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    marginTop:10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  datePicker: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 0,
    height: 40,
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
  tableContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 10, // Reduced font size
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
    color: '#444',
  },
  tableActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007BFF',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    width:40,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#180161',
  },
  paginationButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  pageIndicator: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#180161',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
});
