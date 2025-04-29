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
import {alert} from '../../helper/Alert';
import TableHeader from './TableHeader';
import moment from 'moment';
import Validator from '../../validator/validator';
import EditRecordModal from './EditRecordModal';
let api = DefaultApiFactory();

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
  const [rowSelected, setRowSelected] = useState<{
    selectMode: boolean;
    selectRow: Record | null;
  }>({
    selectMode: false,
    selectRow: null,
  });
  const [editSelected, setEditSelected] = useState({
    editMode: false,
    editRow: '',
  });
  const [deleteSelected, setDeleteSelected] = useState({
    deleteMode: false,
    deleteRow: '',
  });
  let centerText = TextStyle.createCenterTextStyle();
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const headerContent = ['Date', 'In', 'Out', 'Total'];
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const enableActionMode = async (type: ActionType) => {
    if (type === ActionType.EDIT) {
      setEditSelected({
        editMode: true,
        editRow: rowSelected.selectRow,
      });
      if (editSelected.editMode) {
        console.log('here');
        setIsModalVisible(true); // Show the modal
      }
    } else {
      setDeleteSelected({
        deleteMode: true,
        deleteRow: rowSelected.selectRow,
      });
    }
  };

  const enableEditMode = () => {
    if (rowSelected) {
      setIsModalVisible(true);
    } else {
      setResult({
        status: StatusModel.ERROR,
        message: 'Please select a row to edit',
      });
    }
  };

  const deleteAlert = async () => {
    const date = moment(rowSelected.selectRow.startTime).format('YYYY/MM/DD');

    alert(
      `Are you sure you want to delete the record of ${date}?`,
      '',
      function () {
        deleteRecord();
      },
      null,
    );
  };

  const deleteRecord = async () => {
    try {
      await api.deleteRecord({
        recordId: rowSelected.selectRow!.id,
      });
      setResult({
        status: StatusModel.SUCCESS,
        message: ErrMsg.SUCCESS_DELETE_RECORD,
      });
    } catch (e) {
      setResult({
        status: StatusModel.ERROR,
        message: ErrMsg.FAIL_DELETE_RECORD,
      });
    }
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
              // onPress={() => enableActionMode(ActionType.EDIT)}
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
            console.log('record', record);
            return (
              <WorkingHistoryList
                key={index}
                record={record}
                rowSelected={rowSelected}
                editSelected={editSelected}
                setRowSelected={setRowSelected}
                setEditSelected={setEditSelected}
                setResult={setResult}
              />
            );
          })
        ) : (
          <Text style={centerText}>No records matched</Text>
        )}
      </View>
      {rowSelected && (
        <EditRecordModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          startTime={rowSelected.selectRow?.epoch_start_time}
          endTime={rowSelected.selectRow?.epoch_end_time}
          onConfirmStartTime={date => console.log('New Start Time:', date)}
          onConfirmEndTime={date => console.log('New End Time:', date)}
        />
      )}
    </TopContainer>
  );
};

export default RecordHistory;
