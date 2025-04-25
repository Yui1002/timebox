import React from 'react';
import {ButtonStyle} from '../styles';
import {ActivityIndicator} from 'react-native';
import {AlignContainer, Button} from './index';

interface LoadingButtonProps {
  isLoading: boolean;
  onBack: () => void;
  onConfirm: () => void;
  backTitle?: string;
  confirmTitle?: string;
}

const LoadingButton = ({
  isLoading,
  onBack,
  onConfirm,
  backTitle = 'Back',
  confirmTitle = 'Confirm',
}: LoadingButtonProps) => {
  let backBtn = ButtonStyle.createBackButtonStyle();
  let continueBtn = ButtonStyle.createContinueButtonStyle();

  return (
    <AlignContainer>
      <Button title={backTitle} onPress={onBack} style={backBtn} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title={confirmTitle} onPress={onConfirm} style={continueBtn} />
      )}
    </AlignContainer>
  );
};

export default LoadingButton;
