import {StyleSheet} from 'react-native';
import {COLORS, FONT_WEIGHT} from './theme';

export const styles = StyleSheet.create({
  header: {
    marginVertical: 8
  },
  headerText: {
    fontSize: 22,
  },
  subContainer: {
    marginVertical: 8,
  },
  align: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '50%',
  },
  inputText: {
    fontSize: 14,
  },
  subInputText: {
    fontSize: 18,
  },
  open: {
    zIndex: -1,
    marginVertical: 8,
  },
  close: {
    zIndex: 1,
    marginVertical: 8
  },
  mode: {
    width: '45%',
    height: 30,
    borderWidth: 1,
    borderColor: COLORS.text2,
    borderRadius: 8,
  },
  modeText: {
    textAlign: 'center',
    lineHeight: 29,
    fontSize: 18,
  },
  selected: {
    backgroundColor: COLORS.button1,
    color: COLORS.text1,
  },
  notSelected: {
    backgroundColor: COLORS.button2,
    color: COLORS.text2,
  },
  btnContainer: {
    width: '100%',
    marginVertical: 20,
  },
  btn: {
    height: 32,
    width: '45%',
    borderRadius: 10,
  },
  backBtn: {
    backgroundColor: COLORS.button3,
  },
  continueBtn: {
    backgroundColor: COLORS.button1, 
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.text1,
    fontSize: 18,
    lineHeight: 32
  },
});
