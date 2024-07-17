import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  input: {
    width: 300,
    height: 34,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    margin: 6,
  },
  arrowButton: {
    backgroundColor: '#24a0ed',
    width: 40,
    height: 40,
    borderRadius: 10,
    padding: 5,
  },
  arrow: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
});
