import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    margin: '5%',
    height: '90%'
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd',
    marginVertical: 8,
    padding: 10,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#24a0ed',
    borderRadius: 10,
    width: 70
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    lineHeight: 32
  },
  notification: {
    backgroundColor: '#D0F0C0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    height: '10%',
    padding: 8,
    marginBottom: 20,
    position: 'relative'
  },
  notificationIcon: {
    width: '24%', 
    paddingLeft: 20,
  },
  notificationText: {
    width: '75%', 
    color: '#014421'
  }
});
