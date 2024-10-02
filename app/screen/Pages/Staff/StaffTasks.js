import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
} from "react-native";
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

const TaskCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.title}>{item.activityName}</Text>
      <View style={styles.dateContainer}>
        <Icon name="event" size={20} color="#FFF" style={styles.calendarIcon} />
        <Text style={styles.headerDateText}>
          {moment(item.activityDate).format("MMM DD")}
        </Text>
      </View>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.description}>{item.activityDescription}</Text>
    </View>
    {/* <View style={styles.cardFooter}>
      <Text style={styles.footerDateText}>
        {moment(item.activityDate).format("MMMM DD, YYYY")}
      </Text> */}
    {/* </View> */}
  </View>
);

const StaffTaskContent = ({ navigation }) => {
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
        `http://majidalipl-001-site5.gtempurl.com/Staff/GetStaffActivities?id=${staffId}`,
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
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Failed to fetch activities.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color="#180161" />
        </TouchableOpacity>
        <Text style={styles.heading}>Assigned Activities</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <CustomLoader />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <TaskCard item={item} />}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Icon name="assignment" size={64} color="#CCCCCC" />
              <Text style={styles.noDataText}>No activities assigned yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const StaffTasks = () => (
  <Drawer.Navigator
    drawerContent={(props) => <StaffDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        width: "60%",
      },
    }}
  >
    <Drawer.Screen name="StaffTaskContent" component={StaffTaskContent} />
  </Drawer.Navigator>
);

export default StaffTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuButton: {
    padding: 5,
  },
  heading: {
    flex: 1,
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginLeft: -28,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    paddingVertical: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "#34495e",
    marginTop: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
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
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  calendarIcon: {
    marginRight: 5,
  },
  headerDateText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    color: "#34495e",
    lineHeight: 24,
  },
  footerDateText: {
    fontSize: 14,
    color: "#666",
  },
});
