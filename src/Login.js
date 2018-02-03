import React, { PureComponent } from 'react'
import { View, Text,  Alert, Button, TextInput, TouchableOpacity } from 'react-native'
import Cluster from './../Clustername';
import Root from './Root'

export default class Login extends PureComponent{
  state = {
    auth_token: '',
    otpcheck: false,
    mobile: '',
    otp: '',
  }

  Loginclick = async () => {
    Alert.alert("Login start");
    fetch('https://auth.advance88.hasura-app.io/v1/providers/mobile/send-otp', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "mobile": this.state.mobile,
            "country_code": "91"
          })
        })
        .then((response) => {
               Alert.alert("OTP sent", "An OTP is sent to your mobile number: "+ this.state.mobile);
               this.setState({ otpcheck: true });
              }).catch((error) => {
                console.error(error);
              });
  }

  Checkotp = async() =>{
    Alert.alert("OTP check start");
    fetch('https://auth.advance88.hasura-app.io/v1/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "provider" : "mobile",
              "data" : {
                 "mobile": this.state.mobile,
                 "country_code": "91",
                 "otp": this.state.otp
              }
          })
        }).then((response) => response.json())
        .then((responsejson) => {
          if(responsejson.code=="no-user"){
            fetch('https://auth.advance88.hasura-app.io/v1/signup', {
                  method: 'post',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    "provider" : "mobile",
                      "data" : {
                         "mobile": this.state.mobile,
                         "country_code": "91",
                         "otp": this.state.otp
                      }
                  })
                }).then((res) => res.json())
                .then((resjson) => {
                 if (resjson.code=="invalid-mobile") {
                    Alert.alert("Invalid credentials", "Mobile number is invalid or otp is already used/expired");
                  }
                  else{
                    this.setState({ auth_token: responsejson.auth_token });
                  }
                      }).catch((error) => {
                        console.error(error);
                      });
          }
          else if (responsejson.code=="invalid-mobile") {
            Alert.alert("Invalid credentials", "Mobile number is invalid or otp is already used/expired");
          }
          else{
            this.setState({ auth_token: responsejson.auth_token });
          }
              }).catch((error) => {
                console.error(error);
              });
  }
  render(){
    if(this.state.auth_token==''){
      if(this.state.otpcheck){
        return(
          <View>
          <TextInput
           placeholder="Enter OTP"
           onChangeText={ TextInputValue => this.setState({ mobile : TextInputValue }) }
           underlineColorAndroid='transparent'
           style={
           {
               textAlign: 'center',
               width: '90%',
               marginBottom: 7,
               height: 40,
               borderRadius: 5 ,
           }
         }
         />

        <Button
          onPress={this.Checkotp}
          title="Validate OTP"
          color="#841584"
          accessibilityLabel="CLICK THIS TO Validate OTP"
        />
        <TouchableOpacity onPress={this.Checkotp.bind(this)}>
          <Text> Otp check </Text>
        </TouchableOpacity>
          </View>
        );
      }else{
        return(
          <View>
          <TextInput
           placeholder="Enter mobile number"
           onChangeText={ TextInputValue => this.setState({ mobile : TextInputValue }) }
           underlineColorAndroid='transparent'
           style={
           {
               textAlign: 'center',
               width: '90%',
               marginBottom: 7,
               height: 40,
               borderRadius: 5 ,
           }
         }
         />

        <Button
          onPress={this.LoginClick}
          title="LOGIN"
          color="#841584"
          accessibilityLabel="CLICK THIS TO LOGIN"
        />
        <TouchableOpacity onPress={this.Loginclick.bind(this)}>
          <Text> Login </Text>
        </TouchableOpacity>
          </View>
        );
      }
    }
      else{
        return(
          <Root />
        );
    }

  }
}
