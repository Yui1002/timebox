import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../config.js';
import axios from 'axios';
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
              <Text style={styles.modalText}>2. If it's found on the app, the service provider will see your name on the employer's list.</Text>
              <Text style={styles.modalText}>3. Otherwise, we will send the service provider an email to download this app</Text>
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
