import React,{Component} from 'react';
import {Ionicons} from '@expo/vector-icons';
import firebase from 'firebase';
import 'firebase/firestore';
import { StyleSheet,Text, TextInput, View,Image} from 'react-native';
import {colors} from '../../colors/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input,Button,Divider } from 'react-native-elements';
import {Platform} from 'react-native';
import { inject, observer } from 'mobx-react/native';

if (Platform.OS !== 'web') {
  window = undefined
}

@inject('mainStore')
@observer
export class SignInScreen extends Component {

constructor(props){
  super(props);
  this.state = {
     email: '',
     password: '',
     errorMessage: ''
   };

}

validateForm = () => {
  if(this.state.email == '' || this.state.password == ''){
    this.setState((previousState)=>({
      email : previousState.email,
      password : previousState.password,
      errorMessage : 'One or more fields left blank. All fields are required.'
    }));
    return false;
  }
  var emailReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  var passReg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if(!emailReg.test(this.state.email)){
     this.setState((previousState)=>({
      email : previousState.email,
      password : previousState.password,
      firstName : previousState.firstName,
      lastName : previousState.lastName,
      business : previousState.business,
      errorMessage : 'Please enter a valid e-mail address.'
    }));
    return false;
  }
  if(!passReg.test(this.state.password)){
     this.setState((previousState)=>({
      email : previousState.email,
      password : previousState.password,
      firstName : previousState.firstName,
      lastName : previousState.lastName,
      business : previousState.business,
      errorMessage : 'Your password should be between 6 and 16 characters. It should contain atleast one number and one special character. '
    }));
    return false;
  }
  else{
    this.setState((previousState)=>({
     email : previousState.email,
     password : previousState.password,
     firstName : previousState.firstName,
     lastName : previousState.lastName,
     business : previousState.business,
     errorMessage : ''
   }));
    return true;
  }

}

handleSignIn = () => {
  const thisRef = this;
  if(this.validateForm()){
    console.log("LOGIN : Validated");
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => this.setState({ errorMessage: error.message }))
  }else{
    console.log("LOGIN : Error");
  }
}

render() {
  return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>d<Text style={{color : colors.brandSecondary}}>oo</Text>rzy</Text>
          <Text style={styles.logo}>Heroes</Text>
        </View>
        <Text style={styles.logoCaption}>Sign in to your account</Text>
        <View style={styles.form}>
        <Input inputContainerStyle={styles.textInput}
        placeholder='Email' placeholderTextColor={colors.placeholder}
        onChangeText={(text)=>{
          this.setState((previousState)=>({
            email : text,
            password : previousState.password,
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
            errorMessage : previousState.errorMessage
          }))
        }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{this.state.errorMessage}</Text>
        </View>
        <View style={styles.disclaimerContainer}>
        <Button title="Login" type="solid" raised={true} buttonStyle={styles.button} onPress={this.handleSignIn.bind(this)}/>
        </View>
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimer}>
            Don't have an account ?
          </Text>
          <Divider style={{height:10,backgroundColor:colors.white}}/>
          <Button title="Register Now" type="clear" titleStyle={{color:colors.text}} onPress={()=>{this.props.navigation.navigate('SignUp')}}/>
        </View>
        </View>
    </View>
  )
}
}
const styles = StyleSheet.create({
container: {
  flex: 1,
  padding : 20,
  justifyContent : 'center'
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
  color : colors.brandPrimary,
  fontFamily : 'josefin',
  fontSize : 40,
  fontWeight : '500'
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
