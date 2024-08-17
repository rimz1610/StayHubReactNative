import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import DrawerContent from '../../../../components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

const Drawer = createDrawerNavigator();
const AddEditRoom = ({ navigation }) => {
  const [name, setName] = useState('');
  const [maxAdditionalPerson, setMaxAdditionalPerson] = useState('');
  const [status, setStatus] = useState('Active');
  const [roomType,  setRoomType] = useState('Delux');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([{ url: '', sortOrder: 1 }, { url: '', sortOrder: 2 }]);

  const addImageField = () => {
    setImages([...images, { url: '', sortOrder: images.length + 1 }]);
  };

  const removeImageField = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages.map((img, i) => ({ ...img, sortOrder: i + 1 }))); // Update sort order
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.roomheading}>Add / Edit Room</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#555"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Room Type</Text>
            <RNPickerSelect
              onValueChange={(value) => setRoomType(value)}
              value={roomType}
              items={[
                { label: 'Delux', value: 'Delux' },
                { label: 'Regular', value: 'Regular' },
              ]}
              style={pickerSelectStyles}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Max Additional Person</Text>
            <TextInput
              value={maxAdditionalPerson}
              onChangeText={setMaxAdditionalPerson}
              style={styles.input}
              placeholder="Max Additional Person"
              placeholderTextColor="#555"
              keyboardType="numeric"
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

        <View style={styles.singleRow}>
          <Text style={styles.label}>Short Description</Text>
          <TextInput
            value={shortDescription}
            onChangeText={setShortDescription}
            style={styles.input}
            placeholder="Short Description"
            placeholderTextColor="#555"
          />
        </View>

        <View style={styles.singleRow}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            placeholderTextColor="#555"
            multiline
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addImageField}>
          <Text style={styles.addButtonText}>+ ADD IMAGES</Text>
        </TouchableOpacity>

        {images.map((image, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Image URL</Text>
              <TextInput
                value={image.url}
                onChangeText={(url) => {
                  const newImages = [...images];
                  newImages[index].url = url;
                  setImages(newImages);
                }}
                style={styles.input}
                placeholder="Image URL"
                placeholderTextColor="#555"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sort Order</Text>
              <TextInput
                value={image.sortOrder.toString()}
                onChangeText={(sortOrder) => {
                  const newImages = [...images];
                  newImages[index].sortOrder = parseInt(sortOrder);
                  setImages(newImages);
                }}
                style={styles.input}
                placeholder="Sort Order"
                placeholderTextColor="#555"
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity onPress={() => removeImageField(index)} style={styles.deleteButton}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const AddEditRoomContent = () => {
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
            <Drawer.Screen name="AddEditRoom" component={AddEditRoom} />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  roomheading: {
    color: '#180161',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    backgroundColor: '#180161',
    padding: 10,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  formContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  singleRow: {
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#180161',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
  },
  addButton: {
    backgroundColor: '#180161',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    alignSelf:'flex-end',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#180161',
    padding: 15,
    width:'70%',
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom:30,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    justifyContent:'center',
    alignSelf:'center',
    fontSize: 18,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#555',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#555',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#fff',
  },
});

export default AddEditRoomContent;
