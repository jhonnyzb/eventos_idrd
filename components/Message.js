import React from 'react';
import { Text, View } from 'react-native';
const Message = ({text1, color_}) => {
  return (
    <>
      <View
        style={{height: 70, width: '100%', paddingLeft: 7, paddingRight: 7}}>
        <View
          style={{
            height: '100%',
            borderRadius: 5,
            borderLeftWidth: 10,
            justifyContent: 'center',
            paddingLeft: 10,
            backgroundColor: '#ffffff',
            borderLeftColor: '#5400c2b6',
          }}>
          <Text>Evento</Text>
          <Text>
            <Text style={{fontSize: 17, fontWeight: 'bold', color: color_ }}>
              ¡{text1}!
            </Text>{' '}
            de tus favoritos satisfactoriamente 👋
          </Text>
        </View>
      </View>
    </>
  );
};

export default Message;
