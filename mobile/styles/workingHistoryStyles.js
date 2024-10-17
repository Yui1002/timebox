import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    flex: 1,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 6
  },
  dropdownOpen: {
    zIndex: -1,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  dropdownText: {
    lineHeight: 36, 
    paddingLeft: 10
  },
  arrow: {
    marginRight: 16,
    marginTop: 12,
    width: 10,
    height: 10,
    borderColor: '#484848',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    padding: 3,
    transform: 'rotate(45deg)',
  },
  periodContainer: {
    width: '100%',
  },
  periodDropdown: {
    backgroundColor: '#ddd',
    width: '40%',
  },
  button: {
    backgroundColor: '#24a0ed',
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    lineHeight: 32
  },
  separator: {
    width: '100%',
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  error: {
    fontSize: 12, 
    color: '#FF0000'
  },
  noMatch: {
    textAlign: 'center',
    marginVertical: 10
  }
});
