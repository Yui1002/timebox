import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '100%'
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
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: '10%',
    padding: 14,
  },
  text: {
    fontSize: 16, 
    fontWeight: '500', 
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#24a0ed',
    borderRadius: 10,
    height: 34
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    lineHeight: 32
  },
});
