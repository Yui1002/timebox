import React from 'react';
import {ContainerStyle, TextStyle} from '../styles';
import {View, Text} from 'react-native';

interface InfoSectionProps {
    title: string;
    text: string;
    onEdit?: () => void
}

const InfoSection = ({title, text, onEdit}: InfoSectionProps) => {
  let alignContainer = ContainerStyle.createAlignContainer();
  let titleText = TextStyle.createTitleTextStyle();
  let editLinkText = TextStyle.createDeleteLinkTextStyle();
  let textStyle = TextStyle.createBasicTextStyle();

  return (
    <View style={alignContainer}>
      <Text style={titleText}>
        {title}{' '}
        {onEdit && (
          <Text style={editLinkText} onPress={onEdit}>
            Edit
          </Text>
        )}
      </Text>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

export default InfoSection;
