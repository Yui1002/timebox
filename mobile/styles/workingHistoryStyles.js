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
  },
  separator: {
    width: '100%',
    marginTop: 40,
    marginBottom: 16,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputError: {
    color: '#ff0000',
    fontSize: 12,
  },
  signInError: {
    width: '100%',
    backgroundColor: '#FFCCCB'
  }
});
