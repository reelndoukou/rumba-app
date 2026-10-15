// src/Placeholder.js
import { View, Text, StyleSheet } from 'react-native';
import { colors } from './theme';

export default function Placeholder({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: colors.text, fontSize: 22, fontWeight: '700' },
});