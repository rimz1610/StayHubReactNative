import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.roomheading}>Room Price & Availability Details</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('RoomPriceDetails'); // Adjust to your screen name
          }}
        >
          <Text style={styles.addButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Date Pickers and Status Dropdown */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>From Date</Text>
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => setFromDate(selectedDate || fromDate)}
              style={styles.datePicker}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>To Date</Text>
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => setToDate(selectedDate || toDate)}
              style={styles.datePicker}
            />
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

        {/* Room Multi-Select */}
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

        {/* Day of Week Multi-Select */}
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

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              placeholder="Price"
              value={currentItem?.price || ''}
              onChangeText={(text) => setCurrentItem({ ...currentItem, price: text })}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price per Person</Text>
            <TextInput
              placeholder="Price per Person"
              value={currentItem?.addPricePerPerson || ''}
              onChangeText={(text) => setCurrentItem({ ...currentItem, addPricePerPerson: text })}
              style={styles.input}
            />
          </View>
        </View>

        {/* Table Display */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Date</Text>
            <Text style={styles.tableHeaderText}>Day</Text>
            <Text style={styles.tableHeaderText}>Room Name</Text>
            <Text style={styles.tableHeaderText}>Price</Text>
            <Text style={styles.tableHeaderText}>Price per Person</Text>
            <Text style={styles.tableHeaderText}>Booking Available</Text>
          </View>
          <FlatList
            data={data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Pagination */}
        <View style={styles.pagination}>
          <Button
            title="Previous"
            onPress={() => handlePageChange('previous')}
            disabled={currentPage === 0}
          />
          <Text>{`Page ${currentPage + 1} of ${pages}`}</Text>
          <Button
            title="Next"
            onPress={() => handlePageChange('next')}
            disabled={currentPage === pages - 1}
          />
        </View>
      </ScrollView>

      {/* Modal for Adding/Editing Item */}
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
  container: { flex: 1 },
  scrollViewContent: { padding: 10 },
  menuButton: { margin: 10 },
  roomheading: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  addButton: { backgroundColor: '#180161', padding: 10, borderRadius: 5, marginVertical: 10, width:'20%', alignSelf:'flex-end' },
  addButtonText: { color: 'white', textAlign: 'center', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  inputContainer: { flex: 1, marginHorizontal: 5 },
  label: { fontSize: 14, fontWeight: 'bold' },
  datePicker: { width: '100%' },
  multiSelectContainer: { flex: 1, marginHorizontal: 5 },
  multiSelect: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5 },
  searchInputStyle: { color: '#000' },
  selectTextStyle: { color: '#000' },
  chipContainer: { backgroundColor: '#180161' },
  chipText: { color: '#FFF' },
  tableContainer: { borderWidth: 1, borderColor: '#ddd', marginVertical: 10 },
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
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginVertical: 5, padding: 5 },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, color: 'black' },
  inputAndroid: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, color: 'black' },
});


