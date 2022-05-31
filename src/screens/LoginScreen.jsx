/* eslint-disable */
import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Text from '../components/Text';
import axios from 'axios';
import AppContext from '../../AppContext';

const stack = require('../anims/stack.json');

function LoginScreen( {navigation}) {
  const { colors, margin, normalize } = useTheme();
  const [ email, setEmail ] = useState('');
  const [ password, setPassword] = useState('');
  const myContext = useContext(AppContext);

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

  const handleClick = async () => {
    axios.post('https://bsuir-books-server.herokuapp.com/auth/login', { email:email, password:password})
      .then((response)=> {
        //console.log(response.data.refreshToken)
        myContext.setRefreshToken(response.data.refreshToken)
        myContext.setToken(response.data.token)
        navigation.navigate('Books')
      })
      .catch(() => {
        Alert.alert('Not exists!');
      })
    axios.post('https://bsuir-books-server.herokuapp.com/auth/refresh', { refreshToken:refreshToken})
      .then((resp)=> {
        console.log(resp.data)
      })
      .catch((resp) => {
        console.log(resp.data)
        Alert.alert('What!');
      })
  };

  // render search page
  return (
    <ScrollView contentContainerStyle={styles.screen}>

        <View style={styles.input}>
          <TextInput
            //value={login}
            autoCorrect={false}
            style={styles.textInput}
            onChangeText={(text) => setEmail(text)}
            placeholder="Login"
          />
          <TextInput
            //value={password}
            autoCorrect={false}
            style={styles.textInput}
            onChangeText={(text) => setPassword(text)}
            placeholder="Pass"
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleClick}>
            <Text style={{
              alignSelf: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              fontFamily: 'serif',
            }}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '80%' }} onPress={()=> {
            navigation.push('Signup')
          }
          }>
            <Text style={{ color: 'blue' }}>
              {`
    Don't have an account?
    Go back to sign up.  
              `}
            </Text>
          </TouchableOpacity>
        </View>

    </ScrollView>
  );
}

export default React.memo(LoginScreen);
