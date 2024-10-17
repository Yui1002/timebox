import {StyleSheet} from 'react-native';
// import { width, height } from './metric';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '5%',
  },
  title: {
    flex: 0.5,
  },
  titleText: {
    fontSize: 20, 
    fontWeight: '500'
  },
  checkBoxContainer: {
    flex: 0.5,
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  checkBox: {
    width: 20,
    height: 20
  },
  checkBoxText: {
    marginLeft: '8%',
  },
  subContainer: {
    flexGrow: 3,
  },
  listContainer: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    borderRadius: 10,
    padding: '2%',
    lineHeight: 30
  },
  listText: {
    fontSize: 16, 
    fontWeight: '500',
  }
});
