import {View, Button} from 'react-native';
import styles from '../styles/styles';

const Setup = ({route, navigation}: any) => {
  const ownerEmail = route.params.ownerEmail;
  const onPress = (type: string) => {
    switch (type) {
      case 'user':
        navigation.navigate('Users', {ownerEmail: ownerEmail});
        break;
      case 'activity':
        navigation.navigate('AddActivity', {
          ownerEmail: route.params.ownerEmail,
        });
        break;
      default:
        console.log('null');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.setup_container}>
        <View style={styles.setup_btn}>
          <Button title="User" onPress={() => onPress('user')} color="#fff" />
        </View>
        <View style={styles.setup_btn}>
          <Button
            title="Activity"
            color="#fff"
            onPress={() => onPress('activity')}
          />
        </View>
      </View>
    </View>
  );
};

export default Setup;
