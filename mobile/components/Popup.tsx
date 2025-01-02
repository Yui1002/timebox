import React from 'react';
import {Text, View, SafeAreaView, Modal, Pressable} from 'react-native';
import {styles} from '../styles/popupStyles.js';

const Popup = (props: any) => {
  const { modalVisible, setModalVisible } = props;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>To hire a service provider...</Text>
              <Text style={styles.modalText}>1. Type the email of a service provider you would like to hire.</Text>
              <View style={styles.separator}></View>
              <Text style={styles.modalText}>{`<If the email is found on our app>`}</Text>
              <Text style={styles.modalText}>You can specify employment conditions between you and the service provider</Text>
              <View style={styles.separator}></View>
              <Text style={styles.modalText}>{`<If the email is not found on our app>`}</Text>
              <Text style={styles.modalText}>The service provider will receive a request from you</Text>
              <View style={styles.separator}></View>
              <Text style={styles.modalText}>2. Once the request has been approved, you will see the name on your service provider's list</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Got it!</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Popup;
