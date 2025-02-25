import React, {useState} from 'react';
import {Text, ScrollView} from 'react-native';
import {TextStyle} from '../../styles';
import {Record} from '../../swagger';
import {TopContainer, Separator, AlignContainer} from '../index';
import WorkingHistoryList from '../ServiceProvider/WorkingHistoryList';
import SearchField from './SearchField';

const RecordHistory = ({route}: any) => {
  const [records, setRecords] = useState<Record[]>([]);

  let centerText = TextStyle.createCenterTextStyle();

  return (
    <TopContainer>
      <SearchField setRecords={setRecords} employer={route.params.employer} />
      <ScrollView>
        <AlignContainer>
          <Text>Date</Text>
          <Text>In</Text>
          <Text>Out</Text>
          <Text>Total</Text>
        </AlignContainer>
        <Separator />
        {records?.length ? (
          records.map((record: Record, index: number) => {
            return <WorkingHistoryList key={index} record={record}/>;
          })
        ) : (
          <Text style={centerText}>No records matched</Text>
        )}
      </ScrollView>
    </TopContainer>
  );
};

export default RecordHistory;
