import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '90%'
  },
  title: {
    fontSize: 16,
    fontWeight: '500'
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  box: {
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    padding: 14,
    height: 'auto'
  },
  timeText: {
    fontSize: 12,
    color: '#707070',
    marginLeft: 'auto',
    marginRight: 0
  },
  subText: {
    marginVertical: 1
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
    width: '40%',
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
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
