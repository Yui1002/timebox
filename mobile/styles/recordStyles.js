import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: '94%',
    margin: '5%',
  },
  header: {
    height: '10%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
  },
  recordContainer: {
    height: '50%',
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#909090',
    borderRadius: 10,
    width: '44%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50
  },
  button_disabled: {
    backgroundColor: '#D8D8D8',
    padding: 14,
    borderRadius: 10,
    width: "45%",
    height: '80%',
  },
  checkInButton: {
    width: "45%",
    height: '80%',
    backgroundColor: '#26b226',
    padding: 14,
    borderRadius: 10,
  },
  checkOutButton: {
    width: "45%",
    height: '80%',
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
    padding: 6
  },
  subText: {
    color: '#707070'
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
