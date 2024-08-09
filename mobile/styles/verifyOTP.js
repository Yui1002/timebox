import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    margin: '5%',
  },
  header: {
    fontSize: 22,
    fontWeight: '500',
  },
  separator: {
    width: '100%',
    marginTop: 40,
    marginBottom: 16,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '10%',
  },
  otpBox: {
    width: '10%',
    height: '100%',
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#A0A0A0',
    textAlign: 'center'
  },
  inputError: {
    color: '#ff0000',
    fontSize: 12,
    marginVertical: 8
  },
  link: {
    textDecorationLine: 'underline',
    textDecorationColor: '#000',
  },
});
