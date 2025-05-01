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
import {convertDateToEpoch} from '../../helper/DateUtils';

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
    from: null,
    to: null,
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

    const fromEpoch = convertDateToEpoch(searchPeriod.from!);
    const toEpoch = convertDateToEpoch(searchPeriod.to!);

    try {
      const {data} = await api.getRecordByPeriod(
        employer.email,
        serviceProviderEmail,
        fromEpoch,
        toEpoch,
        await getAuthHeader(),
      );
      setRecords(data.records!);
    } catch (e) {
      setResult({
        status: StatusModel.ERROR,
        message: e.response.data.message,
      });
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
              : 'From'
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
              : 'To'
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
