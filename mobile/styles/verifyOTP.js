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
  separator: {
    width: '100%',
    marginTop: 40,
    marginBottom: 16,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  codeInputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  codeInput: {
    width: '10%',
    height: '70%',
    fontSize: 18
  },
  inputError: {
    color: '#ff0000',
    fontSize: 12,
  },
  link: {
    textDecorationLine: 'underline',
    textDecorationColor: '#000',
  },
});
