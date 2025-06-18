import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import ProgressBar from './ProgressBar';
import {useSelector, useDispatch} from 'react-redux';
import {resetShifts} from '../../../redux/actions/workShiftsAction';
import {WorkShiftsProps, ResultModel} from '../../../types';
import {alertError} from '../../../helper/Alert';
import {DefaultApiFactory} from '../../../swagger';
import {
  Header,
  Result,
  TopContainer,
  AlignContainer,
  Container,
} from '../../index';
import {Screen, ProgressBar as Bar, StatusModel} from '../../../enums';
import {getAuthHeader} from '../../../tokenUtils';
import InfoSection from '../../InfoSection';
import LoadingButton from '../../LoadingButton';
import WorkShiftsSection from '../../WorkShiftsSection';

let api = DefaultApiFactory();

const Review = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const {firstName, lastName, email, rate, rateType, allowEdit} = params;
  const userInfo = useSelector((state: any) => state.userInfo);
  const workShifts = useSelector((state: any) => state.workShifts);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const editDay = () => {
    navigation.navigate(Screen.WORK_SHIFTS, params);
  };

  const editRate = () => {
    navigation.navigate(Screen.PERSONAL_INFO, params);
  };

  const confirmServiceProvider = async () => {
    setLoading(true);

    try {
      const header = await getAuthHeader();
      if (!header) return null;

      await api.setRequest(
        {
          senderEmail: userInfo.email,
          receiverEmail: email,
          rate: Number(rate),
          rateType: rateType,
          schedules: workShifts,
          allowEdit: allowEdit,
        },
        header,
      );
      clearInput();
      showSuccess();
    } catch (e: any) {
      setResult({
        status: StatusModel.ERROR,
        message: e.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = () => {
    alertError(
      'Success',
      `We have sent an email to ${firstName} ${lastName}. Once this request is approved, you will see this person on your service provider list.`,
      function () {
        navigation.navigate(Screen.HOME);
      },
    );
  };

  const clearInput = (): void => {
    dispatch(resetShifts());
    setResult({status: StatusModel.NULL, message: ''});
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <TopContainer>
      <ProgressBar title={Bar.REVIEW} isFocused={true} />
      {result.status && <Result status={result.status} msg={result.message} />}
      <ScrollView>
        <Header title="Review" />
        <AlignContainer>
          <InfoSection title="First Name" text={firstName || 'Not specified'} />
          <InfoSection title="Last Name" text={lastName || 'Not specified'} />
        </AlignContainer>
        <InfoSection title="Email Address" text={email} />
        <AlignContainer>
          <InfoSection title="Rate" text={`$${rate}`} onEdit={editRate} />
          <InfoSection
            title="Rate Type"
            text={`${rateType}`}
            onEdit={editRate}
          />
        </AlignContainer>
        <WorkShiftsSection workShifts={workShifts} onEdit={editDay} />
        <Container>
          <InfoSection
            title="Allow service provider to edit record time"
            text={allowEdit ? 'Yes' : 'No'}
          />
        </Container>
        <LoadingButton
          isLoading={loading}
          onBack={navigateBack}
          onConfirm={confirmServiceProvider}
        />
      </ScrollView>
    </TopContainer>
  );
};

export default Review;
