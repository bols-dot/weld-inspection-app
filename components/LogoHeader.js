import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LogoHeader = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 40,
    width: 200,
  },
});

export default LogoHeader;