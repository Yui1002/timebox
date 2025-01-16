import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subContainer: {
    width: '33%',
  },
  title: {
    textAlign: 'center',
    fontWeight: '500'
  },
  bar: {
    height: '12%',
    backgroundColor: '#ddd',
  },
  bar_focused: {
    backgroundColor: '#24a0ed'
  }
});
