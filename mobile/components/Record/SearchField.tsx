import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ResultModel, DateInput} from '../../types';
import {Title, Button, Result} from '../index';
import {DefaultApiFactory, Employer, Record} from '../../swagger';
import {StatusModel} from '../../enums';
let api = DefaultApiFactory();
import { DateDropdown } from '../Common/CustomDropdown'
import Validator from '../../validator/validator';
import {getAuthHeader} from '../../tokenUtils';
import { getPrevDay } from '../../helper/momentHelper';

interface SearchFieldProps {
  employer: Employer;
  serviceProviderEmail: string;
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
}

const SearchField = ({
  employer,
  serviceProviderEmail,
  setRecords,
}: SearchFieldProps) => {
  const [fromOpen, setFromOpen] = useState<boolean>(false);
  const [toOpen, setToOpen] = useState(false);
  const [searchPeriod, setSearchPeriod] = useState<DateInput>({
    from: getPrevDay(15).toDate(),
    to: getPrevDay(0).toDate()
  });
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

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

    const start = new Date(searchPeriod.from!)
    start.setHours(0,0.0,0);
    const startEpoch = Math.floor(start.getTime() / 1000);

    const end = new Date(searchPeriod.to!)
    end.setHours(23,59,59,999);
    const endEpoch = Math.floor(end.getTime() / 1000);

    try {
      const {data} = await api.getRecordByPeriod(
        employer.email,
        serviceProviderEmail,
        startEpoch,
        endEpoch,
        await getAuthHeader(),
      );
      setRecords(data.records!);
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
              to: date
            });
            setToOpen(false);
          }}
          // onConfirm={(date: Date) => {
          //   const endOfDay = new Date(date);
          //   endOfDay.setHours(23, 59, 59, 999);

          //   setSearchPeriod({
          //     from: searchPeriod.from,
          //     to: endOfDay
          //   });

          //   setToOpen(false);
          // }}
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
