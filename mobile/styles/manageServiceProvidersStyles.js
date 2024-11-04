import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '5%',
  },
  title: {
    flexGrow: 0.5
  },
  titleText: {
    fontSize: 20, 
    fontWeight: '500'
  },
  checkBoxContainer: {
    flexGrow: 0.5,
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
    backgroundColor: 'pink',
    flexGrow: 3,
  },
  listContainer: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    borderRadius: 10,
    padding: '2%',
    lineHeight: 30,
    marginVertical: 4
  },
  listText: {
    fontSize: 16, 
    fontWeight: '500',
  },
  statusText: {
    marginLeft: 'auto',
    marginRight: 0,
    fontSize: 12
  }
});
