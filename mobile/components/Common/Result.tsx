import React from 'react';
import {Text} from 'react-native';
import {TextStyle} from '../../styles';
import {COLORS} from '../../styles/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ErrorContainer, SuccessContainer} from '../index';
import { StatusModel } from '../../enums';

interface ResultProps {
  status: StatusModel;
  msg: string;
}

const Result = (props: ResultProps) => {
  let resText = TextStyle.createResultTextStyle();

  return props.status == StatusModel.ERROR ? (
    <ErrorContainer>
      <MaterialIcons name="error-outline" size={30} color={COLORS.RED} />
      <Text style={resText}>{props.msg}</Text>
    </ErrorContainer>
  ) : (
    <SuccessContainer>
      <MaterialIcons name="check-circle-outline" size={30} color={COLORS.GREEN} />
      <Text style={resText}>{props.msg}</Text>
    </SuccessContainer>
  );
};

export default Result;
