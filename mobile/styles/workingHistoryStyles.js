import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '5%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 4
  },
  dropdownContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dropwdown: {
    height: null,
    marginVertical: 4,
  },
  dropdown_2: {
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  }
});
