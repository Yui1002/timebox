import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '100%'
  },
  subContainer: {
    height: '50%', 
    marginHorizontal: 14
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '20%',
  },
  text: {
    fontSize: 14,
    color: '#808080',
    lineHeight: 30,
    width: '30%',
  },
  input: {
    width: '70%',
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#C8C8C8',
  }
});
