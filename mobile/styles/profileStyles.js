import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '94%'
  },
  logoContainer: {
    height: '16%',
    paddingLeft: 8,
    alignItems: 'center',
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
  buttonContainer: {
    position: 'relative',
    backgroundColor: '#ddd'
  },
  button: {
    width: '100%',
    position: 'absolute',
    top: 120,
    left: 0,
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
  shiftText: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginVertical: 2
  }
});
