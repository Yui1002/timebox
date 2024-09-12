import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '90%'
  },
  title: {
    fontSize: 16,
    fontWeight: '600'
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  box: {
    height: '32%',
    backgroundColor: '#E8E8E8',
    position: 'relative',
    borderRadius: 10,
    padding: 14
  },
  timeText: {
    fontSize: 12,
    color: '#707070',
    position: 'absolute',
    top: 40, 
    right: 10
  },
  subContainer: {
    height: '100%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    width: '30%',
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
  },
  button_accept: {
    backgroundColor: 'orange',
  },
  button_decline: {
    backgroundColor: 'lightgreen',
  },
  buttonText: {
    textAlign: 'center', 
    fontWeight: '500'
  }
});
