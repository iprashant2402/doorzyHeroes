import React,{Component} from 'react';
import {Ionicons} from '@expo/vector-icons';
import firebase from 'firebase';
import 'firebase/firestore';
import { ScrollView,StyleSheet,Text, TextInput, View,Image,Alert} from 'react-native';
import {colors} from '../../colors/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input,Button } from 'react-native-elements';
import {Platform} from 'react-native';
const notifId = require('uuid/v4');

if (Platform.OS !== 'web') {
  window = undefined
}

export class SignUpScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
       email: '',
       password: '',
       firstName : '',
       lastName : '',
       phone : '',
       errorMessage: ''
     };

  }

  validateForm = () => {
    if(this.state.email == '' || this.state.password == '' || this.state.firstName == '' || this.state.lastName == '' || this.state.phone == ''){
      this.setState((previousState)=>({
        email : previousState.email,
        password : previousState.password,
        firstName : previousState.firstName,
        lastName : previousState.lastName,
        phone : previousState.phone,
        errorMessage : 'One or more fields left blank. All fields are required.'
      }));
      return false;
    }
    var emailReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    var bussReg = /^\d{10}$/;
    var nameReg = /^[a-zA-Z ]{2,30}$/;
    var passReg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if(!emailReg.test(this.state.email)){
       this.setState((previousState)=>({
        email : previousState.email,
        password : previousState.password,
        firstName : previousState.firstName,
        lastName : previousState.lastName,
        phone : previousState.phone,
        errorMessage : 'Please enter a valid e-mail address.'
      }));
      return false;
    }
    if(!nameReg.test(this.state.firstName)){
       this.setState((previousState)=>({
        email : previousState.email,
        password : previousState.password,
        firstName : previousState.firstName,
        lastName : previousState.lastName,
        phone : previousState.phone,
        errorMessage : 'Please enter a valid first name.'
      }));
      return false;
    }
    if(!nameReg.test(this.state.lastName)){
       this.setState((previousState)=>({
        email : previousState.email,
        password : previousState.password,
        firstName : previousState.firstName,
        lastName : previousState.lastName,
        phone : previousState.phone,
        errorMessage : 'Please enter a valid last name.'
      }));
      return false;
    }
    if(!passReg.test(this.state.password)){
       this.setState((previousState)=>({
        email : previousState.email,
        password : previousState.password,
        firstName : previousState.firstName,
        lastName : previousState.lastName,
        phone : previousState.phone,
        errorMessage : 'Your password should be between 6 and 16 characters. It should contain atleast one number and one special character. '
      }));
      return false;
    }
    if(!bussReg.test(this.state.phone)){
       this.setState((previousState)=>({
        email : previousState.email,
        password : previousState.password,
        firstName : previousState.firstName,
        lastName : previousState.lastName,
        phone : previousState.phone,
        errorMessage : 'Please enter a Phone Number.'
      }));
      return false;
    }
    else{
      this.setState((previousState)=>({
       email : previousState.email,
       password : previousState.password,
       firstName : previousState.firstName,
       lastName : previousState.lastName,
       phone : previousState.phone,
       errorMessage : ''
     }));
      return true;
    }
  }

  handleSignUp = () => {
      if(this.validateForm()){
        var newUser = this.state;
        const db = firebase.firestore();
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(function(){
            var user = firebase.auth().currentUser;
            var uid = user.uid;
            var nid = notifId();
            db.collection('deliveryExecs').doc(uid).set({
              uid : uid,
              firstName : newUser.firstName,
              lastName : newUser.lastName,
              email : newUser.email,
              phone : newUser.phone,
              ordersCompleted : 0
            }).then(function(){
              console.log("USER RECORD STORED");
            }).catch(function(err){console.log(err);});
          })
          .catch(error => this.setState({ errorMessage: error.message }))
      }else{
      //Alert.alert(this.state.errorMessage);
      console.log(this.state.errorMessage);
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Sign Up</Text>
          </View>
          <Text style={styles.logoCaption}>And be a doorzy Hero</Text>
          <View style={styles.form}>
          <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
              <Input inputContainerStyle={styles.textInput}
              placeholder='First Name' placeholderTextColor={colors.placeholder}
              onChangeText={(text)=>{
                this.setState((previousState)=>({
                  email : previousState.email,
                  password : previousState.password,
                  firstName : text,
                  lastName : previousState.lastName,
                  phone : previousState.phone,
                  errorMessage : previousState.errorMessage
                }))
              }}
              />
            </View>
            <View style={{flex:1}}>
              <Input inputContainerStyle={styles.textInput}
              placeholder='Last Name' placeholderTextColor={colors.placeholder}
              onChangeText={(text)=>{
                this.setState((previousState)=>({
                  email : previousState.email,
                  password : previousState.password,
                  firstName : previousState.firstName,
                  lastName : text,
                  phone : previousState.phone,
                  errorMessage : previousState.errorMessage
                }))
              }}
              />
            </View>
          </View>
          <Input inputContainerStyle={styles.textInput}
          placeholder='Email' placeholderTextColor={colors.placeholder}
          onChangeText={(text)=>{
            this.setState((previousState)=>({
              email : text,
              password : previousState.password,
              firstName : previousState.firstName,
              lastName : previousState.lastName,
              phone : previousState.phone,
              errorMessage : previousState.errorMessage
            }))
          }}
          />
          <Input inputContainerStyle={styles.textInput}
          placeholder='Password' placeholderTextColor={colors.placeholder}
          onChangeText={(text)=>{
            this.setState((previousState)=>({
              email : previousState.email,
              password : text,
              firstName : previousState.firstName,
              lastName : previousState.lastName,
              phone : previousState.phone,
              errorMessage : previousState.errorMessage
            }))
          }}
          />
          <Input inputContainerStyle={styles.textInput}
          placeholder='Enter your phone number' placeholderTextColor={colors.placeholder}
          onChangeText={(text)=>{
            this.setState((previousState)=>({
              email : previousState.email,
              password : previousState.password,
              firstName : previousState.firstName,
              lastName : previousState.lastName,
              phone : text,
              errorMessage : previousState.errorMessage
            }))
          }}
          />
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          </View>
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimer}>
              By creating an account, I agree to abide by doorzy's free membership agreement.
            </Text>
          </View>
          <Button title="Submit" type="solid" raised={true} buttonStyle={styles.button} onPress={
            this.handleSignUp.bind(this)
          }/>
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimer}>
              Already have an account ?
            </Text>
            <Button title=" Click here to sign in" type="clear" buttonSyle={styles.button} titleStyle={{color:colors.text}} onPress={()=>{this.props.navigation.navigate('SignIn')}}/>
          </View>
          </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding : 20,
  },
  error : {
    color : colors.errorMessage
  },
  errorContainer : {
    padding : 10
  },
  textInput: {
    height: 40,
    width: '100%',
    borderColor: colors.secondary,
    borderWidth: 1,
    backgroundColor : colors.secondary,
    marginTop: 10,
    padding : 5,
    borderRadius : 3,

  },
  button : {
    backgroundColor : colors.successButton,
    borderRadius : 25
  },
  logo : {
    textAlign : 'center',
    color : colors.text,
    fontSize : 40
  },
  form : {

  },
  leftIconContainer : {
    padding : 5,
    margin : 5
  },
  logoContainer : {
    marginTop : 20,
    marginBottom : 20
  },
  logoCaption : {
    textAlign : 'center',
    fontSize : 20,
    color : colors.text,
    marginBottom : 10
  },
  disclaimer : {
    color : colors.text,
    fontSize : 12,
    textAlign : 'center'
  },
  disclaimerContainer : {
    marginTop : 20,
    marginBottom : 20,
    padding : 10
  }
})
