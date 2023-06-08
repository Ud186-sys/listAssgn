import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCachedUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const loadCachedUsers = async () => {
    try {
      const cachedUsers = await AsyncStorage.getItem('users');
      if (cachedUsers) {
        setUsers(JSON.parse(cachedUsers));
      }
    } catch (error) {
      console.error('Error loading cached users:', error);
    }
  };

  const cacheUsers = async users => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error caching users:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://randomuser.me/api?page=${page}&results=8`,
      );
      const data = await response.json();
      const updatedUsers = [...users, ...data.results];
      setUsers(updatedUsers);
      cacheUsers(updatedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = date => {
    const formatdate = new Date(date);
    const formattedDate = formatdate.toLocaleDateString('en-GB');

    return formattedDate;
  };

  const renderUserCard = ({item}) => (
    <View style={styles.card}>
      <View style={styles.avatarImg}>
        <Image source={{uri: item.picture.medium}} style={styles.avatar} />
      </View>
      <View style={styles.userDetails}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            color: '#000',
          }}>{`${item.name.first} ${item.name.last}`}</Text>
        <Text
          style={{
            fontSize: 16,
            color: '#333',
          }}>
          {item.email}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#333',
          }}>{`${formatDate(item.dob.date)}`}</Text>
        <Text
          style={{
            fontSize: 16,
            color: '#333',
          }}>{`${item.phone}`}</Text>
        <Text
          style={{
            fontSize: 16,
            color: '#333',
          }}>{`${item.login.username}`}</Text>
      </View>
    </View>
  );

  const loadMoreUsers = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <SafeAreaView style={{marginBottom: 50}}>
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={renderUserCard}
          keyExtractor={item => item.login.uuid}
          onEndReached={loadMoreUsers}
          onEndReachedThreshold={0.5}
        />
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  card: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: '95%',
    flexDirection: 'row',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  userDetails: {
    flex: 0.8,
  },
  avatarImg: {},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default App;
