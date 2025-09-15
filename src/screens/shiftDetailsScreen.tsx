import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ShiftDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text>Детали смены</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShiftDetailsScreen;