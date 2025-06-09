import React from 'react';
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

  return (
    <AlignContainer>
      <Button
        title={backTitle}
        onPress={onBack}
        buttonWidth={'45%'}
        buttonHeight={'50%'}
        buttonColor='#6B7280'
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title={confirmTitle}
          onPress={onConfirm}
          buttonWidth={'45%'}
          buttonHeight={'50%'}
        />
      )}
    </AlignContainer>
  );
};

export default LoadingButton;
