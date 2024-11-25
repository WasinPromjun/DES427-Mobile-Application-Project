import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, set } from 'firebase/database';
import styles from '../styles/styles';

const SignupLogin: React.FC<{ loginCB: () => void }> = ({ loginCB }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const navigation = useNavigation();

  const toggleShowLogin = () => setShowLogin(true);
  const toggleShowSignup = () => setShowLogin(false);

  const doLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        console.log('Login successful');
        const email = userCredential.user.email;
        const extractedUsername = email?.split('@')[0] || '';
        console.log(`Username extracted: ${extractedUsername}`);
        
        loginCB(); // Call the callback for successful login
        navigation.navigate('OutPlanetKilo', { username: extractedUsername }); // Pass username to Application
      })
      .catch((error) => {
        console.log(error.code, error.message);
        alert(error.message);
      });
  };

  const doSignup = () => {
    if (password === confirmPassword) {
      const auth = getAuth();
      const db = getDatabase();
  
      createUserWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          console.log('Created new user successfully', userCredential);
          const email = userCredential.user.email;
          const extractedUsername = email?.split('@')[0] || ''; // Extract username before '@' to use as handle
          console.log(`Extracted username: ${extractedUsername}`);
  
          const userRef = ref(db, `database/${userCredential.user.uid}`);// Reference to the user in the database
  
          // create initial data for new user
          set(userRef, {
            handle: extractedUsername, // Initialize with an extracted Username
            follows: [], // Initialize with an empty follows list
            images: [] // Initialize with an empty images list
          })
            .then(() => {
              console.log(`User ${extractedUsername} added to the database`);
              setShowLogin(true); // Switch to login screen
              navigation.navigate('OutPlanetKilo', { username: extractedUsername }); // Navigate to Stack screen
            })
            .catch((dbError: unknown) => {
              console.error('Error writing user to the database:', dbError);
              alert('Could not save user to the database.');
            });
        })
        .catch((error) => {
          console.error('Signup error:', error);
          if (error.code === 'auth/email-already-in-use') {
            alert('This email is already registered. Please login or use a different email.');
          } else {
            console.error(error.code, error.message);
            alert(error.message);
          }
        });
    } else {
      alert('Passwords do not match!');
    }
  };

  const renderSignup = () => (
    <View>
      <View style={styles.group}>
        <Text style={styles.title}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.group}>
        <Text style={styles.title}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
        />
      </View>
      <View style={styles.group}>
        <Text style={styles.title}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
        />
      </View>
      <View style={styles.center}>
        <View style={styles.group}>
          <TouchableOpacity onPress={toggleShowLogin}>
            <Text style={styles.signupText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.group}>
          <TouchableOpacity style={styles.button} onPress={doSignup}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderLogin = () => (
    <View>
      <View style={styles.group}>
        <Text style={styles.title}>Email</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.group}>
        <Text style={styles.title}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
        />
      </View>
      <View style={styles.center}>
        <View style={styles.group}>
          <TouchableOpacity onPress={toggleShowSignup}>
            <Text style={styles.signupText}>Signup</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.group}>
          <TouchableOpacity style={styles.button} onPress={doLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return <View style={styles.containerLogin}>{showLogin ? renderLogin() : renderSignup()}</View>;
};

const ParentComponent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const loginSuccess = () => {
    console.log("Login successful, navigating to FeedPage");
    navigation.navigate("FeedPage"); // Navigate to FeedPage after successful login/signup
  };

  return (
    <View style={{ flex: 1 }}>
      <SignupLogin loginCB={loginSuccess} />
    </View>
  );
};

export default ParentComponent;
