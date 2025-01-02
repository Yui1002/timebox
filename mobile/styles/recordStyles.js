import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: '94%',
    margin: '5%',
  },
  header: {
    height: '14%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
  },
  headerSubText: {
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  subDateContainer: {
    width: '50%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '5%',
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#24a0ed',
    borderRadius: 10,
    width: '46%'
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 32
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#909090',
    borderRadius: 10,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
  },
  button_disabled: {
    backgroundColor: '#D8D8D8',
    padding: 14,
    borderRadius: 10,
    width: '45%',
    height: '80%',
  },
  dateText: {
    lineHeight: 46,
    paddingLeft: 10,
  },
  todayRecordContainer: {
    marginHorizontal: 30,
    marginVertical: 30,
    paddingRight: 30,
  },
  todayRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    width: '100%',
    marginVertical: 10,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  error: {
    color: 'red',
  },
  icon: {
    marginTop: 5
  }
});
