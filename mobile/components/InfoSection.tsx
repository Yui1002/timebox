import React from 'react';
import {TextStyle} from '../styles';
import {View, Text} from 'react-native';

interface InfoSectionProps {
    title: string;
    text: string;
    onEdit?: () => void
}

const InfoSection = ({title, text, onEdit}: InfoSectionProps) => {
  let titleText = TextStyle.createTitleTextStyle();
  let editLinkText = TextStyle.createDeleteLinkTextStyle();
  let textStyle = TextStyle.createBasicTextStyle();

  return (
    <View>
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
