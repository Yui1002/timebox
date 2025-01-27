import React, {useState} from 'react';
import {ButtonStyle} from '../../styles';
import {
  Button,
  Error,
  Dropdown,
  DatePickerDropdown,
  TopContainer,
  Container,
  Header,
  DropdownContainer,
} from '../index';
import {TimeType, Parameters, ErrMsg} from '../../enums';
import {ErrorModel} from '../../types';
import Validator from '../../validator/validator';
import {
  DefaultApiFactory,
  GetRecordRq,
  Employer,
  SetRecordRq,
} from '../../swagger';
import {returnFormat, getBeginningOfDay} from '../../helper/momentHelper';
const api = DefaultApiFactory();

interface RecordProps {
  employer: Employer;
  serviceProviderEmail: string;
}

const Record = ({route}: any) => {
  const {employer, serviceProviderEmail}: RecordProps = route.params;
  const {firstName, lastName, email, mode} = employer;
  let recordBtn = ButtonStyle.createRecordButtonStyle();

  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<ErrorModel>({message: ''});
  let minimumDate =
    mode === 1 ? new Date(Parameters.DEFAULT_DATE) : getBeginningOfDay();

  const validateInput = (type: TimeType): boolean => {
    const validateErr = Validator.validateRecordTime(type, startTime!, endTime!);
    if (validateErr) {
      setError({message: validateErr});
    }
    return validateErr == null;
  };

  const checkRecordExists = async (type: string): Promise<boolean> => {
    try {
      const params: GetRecordRq = {
        employerEmail: email,
        serviceProviderEmail: serviceProviderEmail,
      };

      await api.getRecord(params.employerEmail, params.serviceProviderEmail);
      return true;
    } catch {
      // no record found
      return false;
    }
  };

  const saveRecord = async (type: TimeType) => {

    if (!validateInput(type) || (await checkRecordExists(type))) return;

    // const stringStartTime = returnFormat(startTime);
    const stringStartTime = returnFormat(startTime, 'YYYY')
    const stringEndTime = returnFormat(endTime);
    {console.log(startTime)}

    try {
      await api.setRecord({
        employerEmail: email,
        serviceProviderEmail: serviceProviderEmail,
        recordTime: type === TimeType.START ? stringStartTime : stringEndTime,
        type: TimeType.START,
      } as SetRecordRq);
    } catch (e: any) {
      console.log(e)
      setError({message: ErrMsg.FAIL_RECORD});
    } finally {
      clearInput();
    }
  };

  const clearInput = () => {
    setError({message: ''});
  }

  return (
    <TopContainer>
      {error.message && <Error msg={error.message} />}
      <Container>
        <Header title={`Employer: ${firstName} ${lastName}`} />
      </Container>
      <DropdownContainer>
        <Dropdown
          onPress={() => setStartOpen(!startOpen)}
          placeholder={ startTime?.momentFormat("MM/DD LT") ?? "Select Start Time"}
        />
        <Button
          title="Record"
          onPress={() => saveRecord(TimeType.START)}
          style={recordBtn}
        />
      </DropdownContainer>
      <DropdownContainer>
        <Dropdown
          onPress={() => setEndOpen(!endOpen)}
          placeholder={
            endTime
              ? returnFormat(endTime, 'MM/DD LT') || ''
              : `Select end time`
          }
        />
        <Button
          title="Record"
          onPress={() => saveRecord(TimeType.END)}
          style={recordBtn}
        />
      </DropdownContainer>
      <DatePickerDropdown
        mode="datetime"
        open={startOpen}
        minimumDate={minimumDate}
        maximumDate={new Date()}
        // onConfirm={(d: Date) => setStartTime(d.toString())}
        onConfirm={(d: Date) => setStartTime(d)}
        onCancel={() => setStartOpen(false)}
      />
      <DatePickerDropdown
        mode="datetime"
        open={endOpen}
        minimumDate={minimumDate}
        maximumDate={new Date()}
        onConfirm={(d: Date) => setEndTime(d)}
        onCancel={() => setEndOpen(false)}
      />
    </TopContainer>
  );
};

export default Record;
