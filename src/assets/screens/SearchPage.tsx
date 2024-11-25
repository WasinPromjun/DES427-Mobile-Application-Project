import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { getDatabase, ref, get, update, remove } from 'firebase/database';
import { auth } from '../config/firebaseConfig';
import styles from '../styles/styles';

const SearchFollowScreen: React.FC = () => {
  const [searchHandle, setSearchHandle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Array<{ uid: string; handle: string }>>([]);
  const [followingMap, setFollowingMap] = useState<{ [key: string]: boolean }>({});
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setCurrentUserUid(currentUser.uid);
        const followsRef = ref(getDatabase(), `database/${currentUser.uid}/follows`);
        const snapshot = await get(followsRef);
        if (snapshot.exists()) {
          setFollowingMap(snapshot.val());
        }
      }
    };
    loadUserData();
  }, []);

  const searchUser = async () => {
    setIsLoading(true);
    const database = getDatabase();
    const usersRef = ref(database, `database`);

    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const results = Object.keys(users)
        .filter((uid) => {
          const handle = users[uid].handle;
          return (
            uid !== currentUserUid &&
            handle.toLowerCase().includes(searchHandle.toLowerCase())
          );
        })
        .map((uid) => ({ uid, handle: users[uid].handle }));
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }

    setIsLoading(false);
  };

  const toggleFollow = async (uid: string, handle: string) => {
    const database = getDatabase();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const followsRef = ref(database, `database/${currentUser.uid}/follows`);

      if (followingMap[uid]) {
        const followPath = `database/${currentUser.uid}/follows/${uid}`;
        const followRef = ref(database, followPath);
        await remove(followRef);
        alert(`You have unfollowed ${handle}`);
      } else {
        await update(followsRef, { [uid]: true });
        alert(`You are now following ${handle}`);
      }

      setFollowingMap((prev) => ({ ...prev, [uid]: !followingMap[uid] }));
    }
  };

  const renderItem = ({ item }: { item: { uid: string; handle: string } }) => {
    return (
      <View style={styles.listItem}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.handle}</Text>
          <TouchableOpacity
            style={[styles.followButton, followingMap[item.uid] ? styles.following : styles.notFollowing]}
            onPress={() => toggleFollow(item.uid, item.handle)}
          >
            <Text style={styles.followButtonText}>
              {followingMap[item.uid] ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.searchcontainer}>
      <TextInput
        style={styles.input}
        value={searchHandle}
        onChangeText={setSearchHandle}
        placeholder="Search by handle"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.searchButton} onPress={searchUser}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.uid}
              renderItem={renderItem}
            />
          ) : (
            <Text style={styles.noResultsText}>No users found</Text>
          )}
        </>
      )}
    </View>
  );
};

export default SearchFollowScreen;
