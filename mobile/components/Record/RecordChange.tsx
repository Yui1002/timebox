import React, {useState} from 'react';
import {Text, ScrollView, View} from 'react-native';
import {Record, DefaultApiFactory} from '../../swagger';
import {TopContainer, Separator} from '../index';
import SearchField from './SearchField';
import TableHeader from './TableHeader';
import RecordChangeList from './RecordChangeList';
import {TextStyle} from '../../styles';
let api = DefaultApiFactory();

const RecordChange = ({route, navigation}: any) => {
  const {employer, serviceProviderEmail} = route.params;
  const [records, setRecords] = useState<Record[]>([]);
  const headerContent = ['Date', 'In', 'Out', 'Updated by', 'Updated Date'];
  let centerText = TextStyle.createCenterTextStyle();
  const [selectedPeriod, setSelectedPeriod] = useState({
    from: '',
    to: '',
  });

  const getRecordChanges = async () => {
    console.log('clicked')
    try {
      const {data} = await api.getRecordChanges(
        employer.email,
        serviceProviderEmail,
        selectedPeriod.from ? selectedPeriod.from : '2020-01-01',
        selectedPeriod.to ? selectedPeriod.to : new Date().momentFormat('YYYY-MM-DD'),
      );
      console.log('data back', data.records)
      setRecords(data.records!);
    } catch (e) {
        console.log('e', e.response.data)
      setRecords([]);
    }
  };

  return (
    <TopContainer>
      <SearchField
        selectedPeriod={selectedPeriod}
        // setRecords={setRecords}
        setSelectedPeriod={setSelectedPeriod}
        onPress={getRecordChanges}
        employer={employer}
        serviceProviderEmail={serviceProviderEmail}
      />
      <TableHeader headerContent={headerContent} />
      <Separator />
      {records?.length ? (
        records.map((record: Record, index: number) => {
          return <RecordChangeList key={index} record={record} />;
        })
      ) : (
        <Text style={centerText}>No records matched</Text>
      )}
    </TopContainer>
  );
};

export default RecordChange;
