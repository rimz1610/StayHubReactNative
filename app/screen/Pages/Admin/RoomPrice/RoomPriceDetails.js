

import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import DrawerContent from '../../../../components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
// Dummy data for the table
const initialData = Array.from({ length: 25 }, (_, index) => ({
  id: index.toString(),
  name: `Ali ${index + 1}`,
  email: 'ali123@yopmail.com',
 phoneNumber: `03456050369`,
 
}));

const Drawer = createDrawerNavigator();
const RoomPriceAvailabilityDetailsContent = ({ navigation }) => {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

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
      <Text style={styles.tableCell} numberOfLines={1}>{item.id}</Text>
      <Text style={styles.tableCell} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.tableCell} numberOfLines={1}>{item.email}</Text>
      <Text style={styles.tableCell} numberOfLines={1}>{item.phoneNumber}</Text>
      <View style={styles.tableActions}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
          <Text style={styles.editButtonText}>Update</Text>
        </TouchableOpacity>
       
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.roomheading}>Room Price & Availability Details</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => {
    navigation.navigate('RoomsPriceSetting')
      }}>
        <Text style={styles.addButtonText}>Update Bulk Prices</Text>
      </TouchableOpacity>

      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Id</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Email</Text>
          <Text style={styles.tableHeaderText}>Phone No</Text>
          <Text style={styles.tableHeaderText}>Action</Text>
        </View>
        <FlatList
          data={data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
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
              placeholder="Price"
              placeholderTextColor="#888"
              value={currentItem?.name}
              onChangeText={(text) => setCurrentItem({ ...currentItem, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Additional Price Per Person"
              placeholderTextColor="#888"
              value={currentItem?.type}
              onChangeText={(text) => setCurrentItem({ ...currentItem, type: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Set Booking"
              placeholderTextColor="#888"
              value={currentItem?.shortDescription}
              onChangeText={(text) => setCurrentItem({ ...currentItem, shortDescription: text })}
            />
           
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF6347" />
              <Button title="Save" onPress={handleSave} color="#180161" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const RoomPriceAvailabilityDetails= () => {
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
    padding: 10,
  },
  roomheading: {
    color: '#180161',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  addButton: {
    marginTop: 30,
    alignSelf: 'flex-end',
    backgroundColor: '#180161',
    padding: 10,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  tableContainer: {
    width: '100%',
    height: '50%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 70,
    marginTop: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  tableCell: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    paddingVertical: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tableActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
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
  pageIndicator: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});
