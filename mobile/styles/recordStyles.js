import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    height: '94%',
    margin: '5%',
  },
  header: {
    height: '20%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    marginVertical: '12%'
  },
  recordContainer: {
    height: '50%',
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  button_disabled: {
    backgroundColor: '#D8D8D8',
    padding: 14,
    borderRadius: 10,
    width: "45%",
    height: '90%',
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10
  },
  dateText: {
    textAlign: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  todayRecordContainer: {
    marginHorizontal: 30,
    paddingRight: 30,
    height: '20%'
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
