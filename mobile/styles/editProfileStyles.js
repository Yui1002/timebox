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
    marginVertical: 20,
    position: 'absolute',
    top: '30%',
    left: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
