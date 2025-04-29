import React, {useState} from 'react';
import {Text, ScrollView, View} from 'react-native';
import {TextStyle} from '../../styles';
import {Record, DefaultApiFactory, Employer} from '../../swagger';
import {TopContainer, Separator, Button, Result} from '../index';
import WorkingHistoryList from '../ServiceProvider/WorkingHistoryList';
import SearchField from './SearchField';
import {COLORS} from '../../styles/theme';
import {ResultModel, DateInput} from '../../types';
import {StatusModel, ActionType, ErrMsg, Screen} from '../../enums';
import TableHeader from './TableHeader';
import EditRecordModal from './EditRecordModal';

interface RecordHistoryProps {
  route: {
    params: {
      employer: Employer;
      serviceProviderEmail: string;
    };
  };
  navigation: any;
}

const RecordHistory = ({route, navigation}: RecordHistoryProps) => {
  const {employer, serviceProviderEmail} = route.params;
  const [records, setRecords] = useState<Record[]>([]);
  const [rowSelected, setRowSelected] = useState<Record | null>(null);
  let centerText = TextStyle.createCenterTextStyle();
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const headerContent = ['Date', 'In', 'Out', 'Total'];
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const enableEditMode = () => {
    console.log('row selected', rowSelected);
    if (rowSelected) {
      setIsModalVisible(true);
    } else {
      setResult({
        status: StatusModel.ERROR,
        message: 'Please select a record to edit',
      });
    }
  };

  const updateRecord = (updatedRecord: Record) => {
    setRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === updatedRecord.id ? updatedRecord : record,
      ),
    );
    setRowSelected(null);
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <SearchField
        employer={employer}
        serviceProviderEmail={serviceProviderEmail}
        setRecords={setRecords}
      />
      <View style={{height: '50%'}}>
        {records?.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              height: '10%',
            }}>
            <Button
              title="Edit"
              onPress={enableEditMode}
              buttonWidth={'20%'}
              buttonHeight={'80%'}
              buttonColor={COLORS.LIGHT_GREY}
              style={{marginRight: 20}}
            />
            <Button
              title="Delete"
              onPress={() => {
                enableActionMode(ActionType.DELETE), deleteAlert();
              }}
              buttonWidth={'20%'}
              buttonHeight={'80%'}
              buttonColor={COLORS.LIGHT_GREY}
            />
          </View>
        )}
        <TableHeader headerContent={headerContent} />
        <Separator />
        {records?.length ? (
          records.map((record: Record, index: number) => {
            return (
              <WorkingHistoryList
                key={index}
                record={record}
                rowSelected={rowSelected}
                setRowSelected={setRowSelected}
                setResult={setResult}
              />
            );
          })
        ) : (
          <Text style={centerText}>No records matched</Text>
        )}
      </View>
      <EditRecordModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        setResult={setResult}
        updateRecord={updateRecord}
      />
    </TopContainer>
  );
};

export default RecordHistory;
