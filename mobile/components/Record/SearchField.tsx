import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ResultModel, DateInput} from '../../types';
import {Title, Button, Result} from '../index';
import {DefaultApiFactory, Employer, RateType, Record} from '../../swagger';
import {StatusModel} from '../../enums';
let api = DefaultApiFactory();
import {DateDropdown} from '../Common/CustomDropdown';
import Validator from '../../validator/validator';
import {getAuthHeader} from '../../tokenUtils';
import {getDiff, getPrevDay} from '../../helper/momentHelper';
import { convertEpochToDate } from '../../helper/DateUtils';

interface SearchFieldProps {
  employer: Employer;
  serviceProviderEmail: string;
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
  setTotalHours: React.Dispatch<React.SetStateAction<number>>;
  setTotalSalary: React.Dispatch<React.SetStateAction<number>>;
}

const SearchField = ({
  employer,
  serviceProviderEmail,
  setRecords,
  setTotalHours,
  setTotalSalary
}: SearchFieldProps) => {
  const [fromOpen, setFromOpen] = useState<boolean>(false);
  const [toOpen, setToOpen] = useState(false);
  const [searchPeriod, setSearchPeriod] = useState<DateInput>({
    from: getPrevDay(15).toDate(),
    to: getPrevDay(0).toDate(),
  });
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

  useEffect(() => {
    searchRecord();
  }, [])

  const validateInput = () => {
    const validateErr = Validator.validateWorkingRecordSelect(
      searchPeriod.from,
      searchPeriod.to,
    );

    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }
    return validateErr == null;
  };

  const searchRecord = async () => {
    if (!validateInput()) return;

    const start = new Date(searchPeriod.from!);
    start.setHours(0, 0.0, 0);
    const startEpoch = Math.floor(start.getTime() / 1000);

    const end = new Date(searchPeriod.to!);
    end.setHours(23, 59, 59, 999);
    const endEpoch = Math.floor(end.getTime() / 1000);

    try {
      const header = await getAuthHeader();
      if (!header) return null;

      const {data} = await api.getRecordByPeriod(
        employer.email,
        serviceProviderEmail,
        startEpoch,
        endEpoch,
        header,
      );
      setRecords(sortRecordsInDecendingOrder(data.records!));
      setTotalHours(getTotalHours(data.records!))
      setTotalSalary(getTotalSalary(data.records!))
      setResult({
        status: StatusModel.NULL,
        message: '',
      });
    } catch (e) {
      setResult({
        status: StatusModel.ERROR,
        message: e.response.data.message,
      });
      setRecords([]);
    }
  };

  const sortRecordsInDecendingOrder = (data: Record[]): Record[] => {
    return data.sort(
      (a: Record, b: Record) =>
        Number(b.epoch_start_time) - Number(a.epoch_start_time),
    );
  };

  const getTotalHours = (records: Record[]): number => {
    return records.reduce((total, record) => {
      if (record.epoch_start_time && record.epoch_end_time) {
        const startTime = convertEpochToDate(Number(record.epoch_start_time))
        const endTime = convertEpochToDate(Number(record.epoch_end_time))
        const hours = getDiff(startTime, endTime) || 0;
        return total + hours;
      }
      return total;
    }, 0)
  }

  const getTotalSalary = (records: Record[]): number => {
    return records.reduce((total, record) => {
      if (record.epoch_start_time && record.epoch_end_time && record.rate && record.rate_type) {
        const startTime = convertEpochToDate(Number(record.epoch_start_time))
        const endTime = convertEpochToDate(Number(record.epoch_end_time))
        const hours = getDiff(startTime, endTime) || 0;
        const salary = (record.rate_type === RateType.Hourly) ? Number(record.rate) * hours : record.rate
        return total + Number(salary);
      }
      return total;
    }, 0)
  }

  return (
    <View style={{height: '30%'}}>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Title title="Select period" />
      <View style={styles.rowContainer}>
        <DateDropdown
          placeholder={
            searchPeriod.from
              ? `${searchPeriod.from.momentFormat('MM-DD-YYYY')}`
              : `${getPrevDay(15).format('MM-DD-YYYY')}`
          }
          boxWidth={'47%'}
          boxHeight={'50%'}
          onPressDropdown={() => setFromOpen(!fromOpen)}
          isDisabled={false}
          mode="date"
          isOpen={fromOpen}
          minimumDate={new Date('2021-01-01')}
          maximumDate={new Date()}
          date={searchPeriod.from || new Date()}
          onConfirm={(date: Date) => {
            setSearchPeriod({
              from: date,
              to: searchPeriod.to,
            });
            setFromOpen(false);
          }}
          onCancel={() => setFromOpen(false)}
          isArrowIconShown={true}
        />
        <DateDropdown
          placeholder={
            searchPeriod.to
              ? `${searchPeriod.to.momentFormat('MM-DD-YYYY')}`
              : `${getPrevDay(0).format('MM-DD-YYYY')}`
          }
          boxWidth={'47%'}
          boxHeight={'50%'}
          onPressDropdown={() => setToOpen(!toOpen)}
          isDisabled={false}
          mode="date"
          isOpen={toOpen}
          minimumDate={new Date('2021-01-01')}
          maximumDate={new Date()}
          date={searchPeriod.to || new Date()}
          onConfirm={(date: Date) => {
            setSearchPeriod({
              from: searchPeriod.from,
              to: date,
            });
            setToOpen(false);
          }}
          onCancel={() => setToOpen(false)}
          isArrowIconShown={true}
        />
      </View>
      <Button
        title="Search"
        onPress={searchRecord}
        buttonWidth={'80%'}
        buttonHeight={'16%'}
        style={{margin: 'auto', marginVertical: 10}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Add space between the dropdowns
    alignItems: 'center', // Align items vertically in the center
    marginVertical: 10, // Add vertical spacing
  },
});

export default SearchField;
