import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    margin: '5%',
  },
  header: {
    height: '10%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
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
    height: '30%',
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  checkInButton: {
    width: "45%",
    height: '90%',
    backgroundColor: '#26b226',
    padding: 14,
    borderRadius: 10,
  },
  checkOutButton: {
    width: "45%",
    height: '90%',
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
