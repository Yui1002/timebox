import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {TextStyle} from '../../styles';
import {Record, Employer} from '../../swagger';
import {TopContainer, Separator, Button, Result} from '../index';
import RecordHistoryList from './RecordHistoryList';
import SearchField from './SearchField';
import {COLORS} from '../../styles/theme';
import {ResultModel} from '../../types';
import {StatusModel} from '../../enums';
import TableHeader from './TableHeader';
import EditRecordModal from './EditRecordModal';

interface RecordHistoryProps {
  route: {
    params: {
      employer: Employer;
      serviceProviderEmail: string;
      updatedBy: string;
      mode: number
    };
  };
}

const RecordHistory = ({
  route: {
    params: {employer, serviceProviderEmail, updatedBy, mode},
  },
}: RecordHistoryProps) => {
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
    resetSelection();
  };

  const resetSelection = (): void => {
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
        {records?.length > 0 && mode > 0 && (
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
          </View>
        )}
        <TableHeader headerContent={headerContent} />
        <Separator />
        {records?.length ? (
          records.map((record: Record, index: number) => {
            return (
              <RecordHistoryList
                key={index}
                record={record}
                rowSelected={rowSelected}
                setRowSelected={setRowSelected}
                resetSelection={resetSelection}
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
        resetSelection={resetSelection}
        updatedBy={updatedBy}
      />
    </TopContainer>
  );
};

export default RecordHistory;
