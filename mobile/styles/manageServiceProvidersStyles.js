import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '94%',
  },
  align: {
    flexDirection: 'row',
    height: '8%'
  },
  subContainer: {
    height: '84%',
  },
  title: {
    marginBottom: 10, 
    height: '5%'
  },
  titleText: {
    fontSize: 20, 
    fontWeight: '500'
  },
  checkBox: {
    borderWidth: 0.3, 
    height: 14,
    width: 14,
    marginLeft: 100
  },
  checkBoxText: {
    marginLeft: 10,
    lineHeight: 14
  },
  listContainer: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    height: 64,
    marginVertical: 8,
    borderRadius: 10,
    padding: '4%'
  },
  listText: {
    fontSize: 16, 
    fontWeight: '500'
  }
});
