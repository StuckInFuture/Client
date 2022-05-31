/* eslint-disable */
import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Text from '../components/Text';
import axios from 'axios';
import AppContext from '../../AppContext';

const stack = require('../anims/stack.json');


function AddAuthorScreen( {navigation}) {
  const { colors, margin, normalize } = useTheme();
  const [ photo, setPhoto ] = useState('');
  const [ name, setName] = useState('');
  const [ description, setDescription] = useState('');
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
    addButton: {
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

  const addAuthor = () => {
    axios.post('https://bsuir-books-server.herokuapp.com/author/add',
      { photoURL:photo, name:name, description:description},
      { headers: {"Authorization" : `Bearer ${myContext.token}`} })
      .then((response)=> {
        console.log(response.data)
        navigation.navigate('BookSearch')
      })
      .catch((response) => {
        console.log(myContext.token)
        console.log(response)
        Alert.alert('Exists!');
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
          onChangeText={(text) => setPhoto(text)}
          placeholder="Photo Link"
        />
        <TextInput
          //value={password}
          autoCorrect={false}
          style={styles.textInput}
          onChangeText={(text) => setName(text)}
          placeholder="Name"
        />
        <TextInput
          //value={password}
          autoCorrect={false}
          style={styles.textInput}
          onChangeText={(text) => setDescription(text)}
          placeholder="Description"
        />
        <TouchableOpacity style={styles.addButton} onPress={addAuthor}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'serif',
          }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default React.memo(AddAuthorScreen);
