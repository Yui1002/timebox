import {StyleSheet} from 'react-native';
import { COLORS } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: '5%',
  },
  text: {
    marginVertical: 4
  },
  otpContainer: {
    marginVertical: 8
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
  button: {
    backgroundColor: COLORS.button1,
    borderRadius: 10,
    height: 34,
    marginVertical: 20,
    width: 300
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.text1,
    fontSize: 18,
    lineHeight: 34
  },
  separator: {
    width: '100%',
    marginVertical: 8,
    borderBottomColor: COLORS.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.text2,
  },
});
