import React,{Component} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Button,View,Text,ActivityIndicator} from 'react-native';
import firebase from 'firebase';
import {inject} from 'mobx-react/native';
import registerForPushNotificationsAsync from '../../util/registerPushNotification';


@inject('mainStore')
export class AuthLoading extends Component{

  _bootstrapUserInfo = async (uid) => {
    const db = firebase.firestore();
    const thisRef = this.props;
    await db.collection('deliveryExecs').doc(uid).onSnapshot(function(snap){
      thisRef.mainStore.setUser(snap.data());
      console.log("SUCCESS USERINFO");
    });

    return true;
  }

  _syncNotifications = (uid) => {
    const db = firebase.firestore();
    const thisRef = this.props;
    const thisPureRef = this;
  }

  componentDidMount(){
    const rootRef = this.props.navigation;
    const storeRef = this.props;
    const thisRef = this;

    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        const uid = user.uid;
        if(thisRef._bootstrapUserInfo(uid)){
        storeRef.mainStore.setUid(uid);
        registerForPushNotificationsAsync(uid);
        rootRef.navigate('Main');
        }
      }
      else{
        rootRef.navigate('Auth');
      }
    });
  }

  render(){
    return(
      <View>
        <Text>AuthLoading</Text>
        <ActivityIndicator />
      </View>
    );
  }
}
