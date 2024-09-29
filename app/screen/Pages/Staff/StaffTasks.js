import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState ,useEffect} from "react";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StaffDrawer from "../../../components/StaffDrawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import CustomLoader from "../../../components/CustomLoader";
const Drawer = createDrawerNavigator();

const TaskCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.activityName}</Text>
       
      </View>
      <View style={styles.cardContent}>
      <TouchableOpacity style={styles.dateButton}>
          <Icon
            name="event"
            size={20}
            color="#180161"
            style={styles.dateIcon}
          />
          <Text style={styles.dateText}>
            {moment(item.activityDate).format("MMM DD YYYY")}
          </Text>
        </TouchableOpacity>
        <Text style={styles.description}>{item.activityDescription}</Text>
      </View>
    </View>
  );
};

const StaffTaskcontent = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);


  const fetchData = async () => {

    const token = await AsyncStorage.getItem("token");
    const staffId = await AsyncStorage.getItem("loginId");
    setLoading(true);
    try {
      const response = await axios.get(
        "http://majidalipl-001-site5.gtempurl.com/Staff/GetStaffActivities?id=" +
        staffId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data.list);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Redirect to login page
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Failed to fetch activities.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.heading}>Assigned Activities</Text>

      <View style={styles.formContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <CustomLoader />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <TaskCard key={index} item={item} />
          ))
        ) : (
          <Text style={styles.noDataText}>No activity assigned yet.</Text>
        )}</View>
    </View>
  );
};
const StaffTasks = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <StaffDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "60%",
        },
      }}
    >
      <Drawer.Screen name="StaffTaskcontent" component={StaffTaskcontent} />
    </Drawer.Navigator>
  );
};

export default StaffTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  heading: {
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200, // Adjust as needed
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  formContainer: {
    width: "100%",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#34495e",
    marginTop: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#180161",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 15,
    lineHeight: 24,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    color: "#34495e",
    fontSize: 16,
  },
});
