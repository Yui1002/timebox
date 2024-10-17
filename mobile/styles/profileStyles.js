import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '3%',
    flex: 1,
  },
  logoContainer: {
    height: '24%',
    paddingLeft: 8,
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: '18%',
    padding: 14,
  },
  title: {
    height: '14%',
    marginVertical: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  buttonContainer: {
    backgroundColor: '#ddd',
  },
  button: {
    width: '100%',
    backgroundColor: '#24a0ed',
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    lineHeight: 32,
  },
  shiftText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  day: {
    width: '40%',
  },
  time: {
    width: '60%',
  },
});
