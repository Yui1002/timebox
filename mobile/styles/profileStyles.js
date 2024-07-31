import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
  },
  logoContainer: {
    height: '16%',
    paddingLeft: 8,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '10%',
    padding: 14,
  },
  text: {
    fontSize: 16, 
    fontWeight: 500, 
    marginBottom: 4
  },
  btn: {
    backgroundColor: '#24a0ed', 
    borderRadius: 10
  }
});
