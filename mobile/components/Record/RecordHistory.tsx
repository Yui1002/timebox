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
import AddRecordModal from './AddRecordModal';

interface RecordHistoryProps {
  route: {
    params: {
      employer: Employer;
      serviceProviderEmail: string;
      updatedBy: string;
      allowEdit: number;
    };
  };
}

const RecordHistory = ({
  route: {
    params: {employer, serviceProviderEmail, updatedBy, allowEdit},
  },
}: RecordHistoryProps) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalSalary, setTotalSalary] = useState<number>(0);
  const [rowSelected, setRowSelected] = useState<Record | null>(null);
  let centerText = TextStyle.createCenterTextStyle();
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const headerContent = ['Date', 'In', 'Out', 'Total', 'Salary'];
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);

  const enableEditMode = () => {
    if (rowSelected) {
      setIsEditModalVisible(true);
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
        setTotalHours={setTotalHours}
        setTotalSalary={setTotalSalary}
      />
      {records?.length > 0 && allowEdit > 0 && (
        <View style={styles.button}>
          <Button
            title="Add"
            onPress={() => setIsAddModalVisible(true)}
            buttonWidth={'20%'}
            buttonHeight={'80%'}
            buttonColor={COLORS.LIGHT_GREY}
            style={{marginRight: 20}}
          />
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
      <View style={{maxHeight: '60%', marginBottom: 20}}>
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
        {records?.length > 0 && <Separator />}
        {records?.length > 0 && (
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{`${totalHours}h`}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Salary:</Text>
              <Text style={styles.totalValue}>{`$${totalSalary.toFixed(
                2,
              )}`}</Text>
            </View>
          </View>
        )}
      </View>
      <EditRecordModal
        isModalVisible={isEditModalVisible}
        setIsModalVisible={setIsEditModalVisible}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        setResult={setResult}
        updateRecord={updateRecord}
        resetSelection={resetSelection}
        updatedBy={updatedBy}
      />
      <AddRecordModal
        isModalVisible={isAddModalVisible}
        setIsModalVisible={setIsAddModalVisible}
        setResult={setResult}
        employer={employer}
        serviceProviderEmail={serviceProviderEmail}
        updateRecord={updateRecord}
      />
    </TopContainer>
  );
};

const styles = StyleSheet.create({
  totalContainer: {
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingVertical: 10,
    borderTopColor: '#dee2e6',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    minWidth: 150,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginRight: 10,
    minWidth: 50,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'right',
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: '4%',
  },
});

export default RecordHistory;
