import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '94%',
  },
  align: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  align_2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subContainer: {
    height: '15%', 
  },
  text: {
    fontSize: 14,
    color: '#505050',
    lineHeight: 30,
  },
  rateTypeText: {
    color: '#505050'
  },
  input: {
    width: '90%',
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#505050',
  },
  delete: {
    color: '#24a0ed',
    width: '20%',
    textDecorationLine: 'underline',
  },
  addButton: {
    backgroundColor: '#24a0ed',
    borderRadius: 10,
    width: '50%',
    marginVertical: 'auto',
    marginHorizontal: '24%',
  },
  saveButton: {
    backgroundColor: '#F28C28',
    borderRadius: 10,
    width: '70%',
    position: 'absolute',
    top: '80%',
    left: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
