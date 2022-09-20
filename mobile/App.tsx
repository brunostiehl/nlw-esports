import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Hello World</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#281E5D',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helloText: {
    color: '#fff',
    fontSize: 24,
  },
});
