import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../../../styles/statusBarStyles.js';
import {ProgressBar as Bar} from '../../../enums';

const ProgressBar = ({title, isFocused}: any) => {
  return (
    <View style={styles.container}>
      {Object.values(Bar).map((progress: Bar) => (
        <View style={styles.subContainer}>
          <Text style={styles.title}>{progress}</Text>
          <View
            style={
              isFocused && progress == title
                ? [styles.bar, styles.bar_focused]
                : styles.bar
            }
          />
        </View>
      ))}
    </View>
  );
};

export default ProgressBar;
