/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Text from '../components/Text';
import * as Haptics from 'expo-haptics';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import axios from 'axios';
import { parse } from 'fast-xml-parser';

const stack = require('../anims/stack.json');

function SignupScreen({navigation}) {
  const { colors } = useTheme();
  const [ email, setEmail ] = useState('');
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ phone, setPhone ] = useState('');
  const [ password, setPassword] = useState('');

  // Other styles
  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.notification,
      justifyContent: 'center',
    },
    textInput: {
      backgroundColor: colors.card,
      borderRadius: 20,
      fontSize: 16,
      width: '80%',
      margin: 10,
      height: 38,
      padding: 7,
    },
    loginButton: {
      backgroundColor: 'aquamarine',
      borderRadius: 20,
      fontSize: 16,
      width: '80%',
      margin: 10,
      height: 38,
      padding: 7,
    },
    input: {
      width: '80%',
      height: '25%',
      margin: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const register = async () => {
    axios.post('https://bsuir-books-server.herokuapp.com/auth/register', { email:email, password:password, phone:phone, firstName:firstName, lastName: lastName })
      .then(response => console.log(response.data))
      .catch(() => {
          Alert.alert('User exists!');
        });
  };

  // render search page
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.input}>
        <TextInput
          autoCorrect={false}
          style={styles.textInput}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
        />
        <TextInput
          autoCorrect={false}
          style={styles.textInput}
          onChangeText={(text) => setFirstName(text)}
          placeholder="First Name"
        />
        <TextInput
          autoCorrect={false}
          style={styles.textInput}
          onChangeText={(text) => setLastName(text)}
          placeholder="Last Name"
        />
        <TextInput
          autoCorrect={false}
          style={styles.textInput}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
        />
        <TextInput
          autoCorrect={false}
          style={styles.textInput}
          onChangeText={(text) => setPhone(text)}
          placeholder="Phone"
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={register}
        >
          <Text style={{
            alignSelf: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'serif',
          }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '80%' }} onPress={()=> {
          navigation.push('Login')
        }}>
          <Text style={{ color: 'blue' }}>
            {`
  Already have an account?
  Sign in instead.  
            `}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default React.memo(SignupScreen);
