import React from 'react';
import {StyleProp} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../styles/theme';

interface IconProps {
  name: string;
  type: 'MaterialCommunity' | 'Material';
  size: number;
  style?: StyleProp<any>;
  onPress?: () => void;
}

const Icon = ({name, type, size, style, onPress}: IconProps) => {
  return type === 'MaterialCommunity' ? (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={COLORS.BLACK}
      style={style}
      onPress={onPress}
    />
  ) : (
    <MaterialIcons
      name={name}
      size={size}
      color={COLORS.BLACK}
      style={style}
      onPress={onPress}
    />
  );
};

export default Icon;
