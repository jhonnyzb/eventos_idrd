import React, {PureComponent} from 'react';
import {View, Image, Text, TouchableOpacity, Linking} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {view} from '../styles/';

const styles = EStyleSheet.create({
  main: {
    height: 450,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    height: 400,
    width: 400,
    resizeMode: 'contain',
  },
  subtitle: {
    color: '#aaaaaa',
    fontWeight: 'bold',
  },
});

const Nothing = ({label}) => {
  return (
    <TouchableOpacity
      style={styles.main}
      onPress={() => Linking.openURL('https://idrd.gov.co')}>
      <Image style={styles.image} source={require('../assets/sin.png')} />
      <Text style={[styles.subtitle, {textAlign: 'center'}]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Nothing;
