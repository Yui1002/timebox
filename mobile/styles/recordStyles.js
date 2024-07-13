import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '5%',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10
  },
  dateText: {
    textAlign: 'center'
  },
  recordContainer: {
    width: '100%',
    height: 150,
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  checkInButton: {
    width: "45%",
    height: '100%',
    backgroundColor: '#17B169',
    padding: 14,
    borderRadius: 10,
  },
  checkOutButton: {
    width: "45%",
    height: '100%',
    backgroundColor: '#F28C28',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  todayRecordContainer: {
    marginHorizontal: 30,
    paddingRight: 30
  },
  todayRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  separator: {
    width: '100%',
    marginVertical: 10,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
