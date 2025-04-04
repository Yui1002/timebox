import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '100%'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '500'
  },
  modalText: {
    color: '#606060',
    fontSize: 13,
    // marginBottom: 6
  },
  separator: {
    borderBottomColor: '#B0B0B0',
    borderBottomWidth: 1,
    marginVertical: 6
  }
});
