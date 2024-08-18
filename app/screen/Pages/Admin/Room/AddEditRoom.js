import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import DrawerContent from '../../../../components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Drawer = createDrawerNavigator();
const addEditSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  type: Yup.string().required("Required"),
  shortDescription: Yup.string().required("Required"),
  maxAdditionalPerson: Yup.number().min(0).required("Required"),
  description: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
  imagesUrl: Yup.array().of(
    Yup.object().shape({
      roomId: Yup.number().notRequired(),
      id: Yup.number().required('Required'),
      imageUrl: Yup.string().required('Required'),
      sortOrder: Yup.number().min(1).required("Required")
      // .test('unique-sortOrder', 'Sort order must be unique', function (value) {
      //   const { path, parent, options } = this;
      //   const images = options.context.values.imagesUrl;
      //   const duplicate = images.filter((img) => img.sortOrder === value).length > 1;
      //   return !duplicate;
      // }),
    })
  )
});
const AddEditRoom = ({ route, navigation }) => {


  console.warn(route);
  const [submitting, setSubmitting] = React.useState(false);

 const {id}=route.params.id;
  const formik = useFormik({
    initialValues: {
      id: 0,
      type: "Single",
      name: "",
      shortDescription: "",
      maxAdditionalPerson: 0,
      description: "",
      status: "",
      price: 0,
      imagesUrl: [
        {
          id: 0,
          roomId: 0,
          imageUrl: "",
          sortOrder: 1
        }
      ],

    },
    validationSchema: addEditSchema,
    // validateOnChange: false,
    // validateOnBlur: false,
    // context: { values: formik.values }, // Pass formik values as context
    onSubmit: values => {
      setSubmitting(true);
      axios.post("http://majidalipl-001-site5.gtempurl.com/Room/SaveRoom", values, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
        }
      })
        .then(function (response) {
          if (response.data.success) {
            setSubmitting(false);
            Alert.alert(
              'Success',
              'Room saved successfully.',
              [{
                text: 'OK',
                onPress: () => {
                  navigation.navigate('RoomList');
                }
              }]
            );
          } else {
            setSubmitting(false);
            Alert.alert(
              'Oops',
              response.data.message,
              [{ text: 'OK' }]
            );
          }
        })
        .catch(function (error) {
          console.warn(error);
          setSubmitting(false);
        });
    },
  });

  React.useEffect(() => {
    console.warn(roue.params);

    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
        if (id > 0) {
      GetAxios().get('/http://majidalipl-001-site5.gtempurl.com/Room/GetRoomById?id=' + id, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }).then(res => {
        if (!res.data.success) {
          Alert.alert(
            'Opps',
            res.data.message,
            [{ text: 'OK', onPress: () => navigation.navigate('RoomList') }]
          );
        } else {
          formik.setValues(res.data.data);
        }
      });
      }
    };

    fetchData();

  }, []);


  const addImageField = () => {

    // setImages([...images, { url: '', sortOrder: images.length + 1 }]);
    const newImage = { id: 0, roomId: 0, imageUrl: "", sortOrder: 1 };
    formik.setFieldValue("imagesUrl", [...formik.values.imagesUrl, newImage]);
  };

  const removeImageField = (index) => {
    const newImages = formik.values.imagesUrl.filter((_, i) => i !== index);
    formik.setFieldValue("imagesUrl", newImages);
    // const updatedImages = images.filter((_, i) => i !== index);
    // setImages(updatedImages.map((img, i) => ({ ...img, sortOrder: i + 1 }))); // Update sort order
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
              onChangeText={(value) => formik.setFieldValue('name', value)}

              value={formik.values.name}
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#555"
            />
            {formik.touched.name && formik.errors.name ? (
              <Text style={styles.errorText}>{formik.errors.name}</Text>
            ) : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Room Type</Text>
            <RNPickerSelect
              onValueChange={(value) => formik.setFieldValue('type', value)}

              value={formik.values.type}
              items={[
                { label: 'Single', value: 'Single' },
                { label: 'Double', value: 'Double' },
                { label: 'Triple', value: 'Triple' },
                { label: 'Twin', value: 'Twin' },
                { label: 'King', value: 'King' },
                { label: 'Queen', value: 'Queen' },
                { label: 'Suite', value: 'Suite' },
                { label: 'Studio', value: 'Studio' },
              ]}
              style={pickerSelectStyles}
            />
            {formik.touched.type && formik.errors.type ? (
              <Text style={styles.errorText}>{formik.errors.type}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Max Additional Person</Text>
            <TextInput
              onChangeText={formik.handleChange('maxAdditionalPerson')}
              value={formik.values.maxAdditionalPerson}
              style={styles.input}
              placeholder="Max Additional Person"
              placeholderTextColor="#555"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Status</Text>
            <RNPickerSelect
              onValueChange={formik.handleChange('status')}
              value={formik.values.status}
              items={[
                { label: 'Active', value: 'A' },
                { label: 'Inactive', value: 'I' },
              ]}
              style={pickerSelectStyles}
            />
            {formik.touched.status && formik.errors.status ? (
              <Text style={styles.errorText}>{formik.errors.status}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.singleRow}>
          <Text style={styles.label}>Short Description</Text>
          <TextInput
            onValueChange={formik.handleChange('shortDescription')}
            value={formik.values.shortDescription}
            style={styles.input}
            placeholder="Short Description"
            placeholderTextColor="#555"
          />
          {formik.touched.shortDescription && formik.errors.shortDescription ? (
            <Text style={styles.errorText}>{formik.errors.shortDescription}</Text>
          ) : null}
        </View>

        <View style={styles.singleRow}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={formik.handleChange('description')}
            onChangeText={formik.values.description}
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            placeholderTextColor="#555"
            multiline
          />
          {formik.touched.description && formik.errors.description ? (
            <Text style={styles.errorText}>{formik.errors.description}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addImageField}>
          <Text style={styles.addButtonText}>+ ADD IMAGES</Text>
        </TouchableOpacity>

        {formik.values.imagesUrl.map((image, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Image URL</Text>
              <TextInput
                value={image.imageUrl}
                onChangeText={(url) => {
                  const newImages = [...formik.values.imagesUrl];
                  newImages[index].imageUrl = url;
                  formik.setFieldValue("imagesUrl", newImages);
                }}
                style={styles.input}
                placeholder="Image URL"
                placeholderTextColor="#555"
              />
              {formik.errors.imagesUrl && formik.errors.imagesUrl[index]?.imageUrl && (
                <Text style={styles.errorText}>{formik.errors.imagesUrl[index].imageUrl}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sort Order</Text>
              <TextInput
                value={image.sortOrder.toString()}
                onChangeText={(sortOrder) => {
                  const newImages = [...formik.values.imagesUrl];
                  newImages[index].sortOrder = parseInt(sortOrder);
                  formik.setFieldValue("imagesUrl", newImages);
                }}
                style={styles.input}
                placeholder="Sort Order"
                placeholderTextColor="#555"
                keyboardType="numeric"
              />
              {formik.errors.imagesUrl && formik.errors.imagesUrl[index]?.sortOrder && (
                <Text style={styles.errorText}>{formik.errors.imagesUrl[index].sortOrder}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => removeImageField(index)} style={styles.deleteButton}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}



        <TouchableOpacity style={styles.saveButton} disabled={submitting}
          onPress={formik.handleSubmit}>
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
      <Drawer.Screen name="AddEditRoomCon" component={AddEditRoom} initialParams={{ id: 0 }} />
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
    alignSelf: 'flex-end',
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
    width: '70%',
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 18,
  },
  errorText: {
    fontSize: 12,
    color: 'red',

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
