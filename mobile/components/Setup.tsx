import {View, Button} from 'react-native';
import styles from '../styles/styles';

const Setup = ({navigation, route}: any) => {
  const onPress = (type: string) => {
    switch (type) {
      case 'user':
        navigation.navigate('AddUser', {ownerEmail: route.params.ownerEmail});
        break;
      case 'activity':
        navigation.navigate('AddActivity');
        break;
      default:
        console.log('null');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.setup_container}>
        <View style={styles.setup_btn}>
          <Button
            title="Add User"
            onPress={() => onPress('user')}
            color="#fff"
          />
        </View>
        <View style={styles.setup_btn}>
          <Button
            title="Add Activity"
            color="#fff"
            onPress={() => onPress('activity')}
          />
        </View>
      </View>
    </View>
  );
};

export default Setup;
