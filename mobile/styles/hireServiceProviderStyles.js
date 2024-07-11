import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: '5%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 34,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    margin: 6,
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
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    textDecorationLine: 'underline',
    textDecorationColor: '#000',
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
