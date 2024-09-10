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
    width: 200,
    height: 34,
    borderWidth: 0.5,
    borderRadius: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
    fontSize: 16,
    letterSpacing: 10,
    textAlign: 'center'
  },
  inputError: {
    width: 200,
    marginRight: 'auto',
    marginLeft: 'auto',
    color: '#ff0000',
    fontSize: 12,
  },
  link: {
    textDecorationLine: 'underline',
    textDecorationColor: '#000',
  },
  button: {
    width: 300,
    backgroundColor: '#24a0ed', 
    borderRadius: 10, 
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 30
  },
  resend: {
    height: '5%',
    borderWidth: 1,
    backgroundColor: 'rgb(221, 255, 221)',
    borderColor: 'rgb(204, 204, 204)',
    marginBottom: 10
  },
  resendText: {
    lineHeight: 30,
    textAlign: 'center',
  }
});
