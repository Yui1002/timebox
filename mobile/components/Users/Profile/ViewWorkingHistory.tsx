import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {View, Text} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {
  Button,
  TopContainer,
  Title,
  AlignContainer,
  Separator,
  Container,
  Dropdown,
  Center,
  Result,
} from '../../index';
import WorkingHistoryList from '../../ServiceProvider/WorkingHistoryList';
import {DefaultApiFactory, Record} from '../../../swagger';
import Validator from '../../../validator/validator';
import {ResultModel} from '../../../types';
import {StatusModel} from '../../../enums';
import {getBeginningOfDay, getEndOfDay} from '../../../helper/momentHelper';

let api = DefaultApiFactory();

const ViewWorkingHistory = ({route}: any) => {
  const epEmail = useSelector(state => state.userInfo).email;
  const {spEmail} = route.params;
  const [fromDropdown, setFromDropDown] = useState(false);
  const [toDropdown, setToDropDown] = useState(false);
  const [from, setFrom] = useState<Date>(getBeginningOfDay(new Date()));
  const [to, setTo] = useState<Date>(getEndOfDay(new Date()));
  const [searchResult, setSearchResult] = useState<Record[]>([]);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

  const onPeriodChange = (type: string, date: Date) => {
    type === 'from'
      ? setFrom(getBeginningOfDay(date))
      : setTo(getEndOfDay(date));
  };

  const validateInput = () => {
    const validateErr = Validator.validatePeriod(from, to);
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }
    return validateErr == null;
  };

  const search = async () => {
    if (!validateInput()) return;

    try {
      const {data} = await api.getRecordByPeriod(
        epEmail,
        spEmail,
        from.momentFormat('YYYY-MM-DD'),
        to.momentFormat('YYYY-MM-DD'),
      );
      setSearchResult(data.records!);
    } catch (e) {
      setSearchResult([])
    }
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Title title="Select period" />
      <AlignContainer>
        <Dropdown
          placeholder={from.momentFormat('YYYY-MM-DD')}
          width="45%"
          height="100%"
          onPress={() => setFromDropDown(!fromDropdown)}
        />
        <Dropdown
          placeholder={to.momentFormat('YYYY-MM-DD')}
          width="45%"
          height="100%"
          onPress={() => setToDropDown(!toDropdown)}
        />
      </AlignContainer>
      <DatePicker
        modal
        open={fromDropdown}
        mode="date"
        date={new Date()}
        onConfirm={d => onPeriodChange('from', d)}
        onCancel={() => {
          setFromDropDown(false);
        }}
      />
      <DatePicker
        modal
        open={toDropdown}
        mode="date"
        date={new Date()}
        onConfirm={d => onPeriodChange('to', d)}
        onCancel={() => {
          setToDropDown(false);
        }}
      />
      <Button title="Search" onPress={search} />
      <AlignContainer>
        <Text>Date</Text>
        <Text>Check In</Text>
        <Text>Check Out</Text>
        <Text>Total</Text>
      </AlignContainer>
      <Separator />
      {searchResult && searchResult.length > 0 && (
        <View>
          {searchResult.map((s: Record, index: number) => {
            return <WorkingHistoryList key={index} list={s} />;
          })}
        </View>
      )}
      {searchResult && !searchResult.length && (
        <Container>
          <Center title="No record matched" />
        </Container>
      )}
    </TopContainer>
  );
};

export default ViewWorkingHistory;
