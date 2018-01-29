import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Alert, TextInput } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

export default class CardFormScreen extends PureComponent {
  static title = 'Pay via card'

  state = {
    loading: false,
    token: null,
    amount: 50,
  }

  handleCardPayPress = async () => {
    try {
      this.setState({ loading: true, token: null })
      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: 'Gunilla Haugeh',
            line1: 'Canary Place',
            line2: '3',
            city: 'Macon',
            state: 'Georgia',
            country: 'US',
            postalCode: '31217',
            email: 'ghaugeh0@printfriendly.com',
          },
        },
      })
        this.setState({token});
      fetch('https://api.advance88.hasura-app.io/charge', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                src: this.state.token.tokenId,
                amount: this.state.amount,
                currency: "USD"

                })
              }).then((response) => response.json())
              .then((res) => {
                      // Showing response message coming from server updating records.
                      if(res.status==200 || res.status=="succeeded"){
                        Alert.alert("Payment successfull", "Transaction id:"+res.id);
                      }
                      else{
                        Alert.alert("Payment Failure", ""+res.message)
                      }
                      this.setState({ loading: false});

                    }).catch((error) => {
                      console.error(error);
                    });

    } catch (error) {
      this.setState({ loading: false })
    }
  }

  render() {
    const { loading, token } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Click to pay via Card
        </Text>
        <Text style={styles.instruction}>
          Enter the amount you want to pay in US Dollars.
        </Text>
        <TextInput
         placeholder="50"
         onChangeText={ TextInputValue => this.setState({ amount : TextInputValue }) }
         underlineColorAndroid='transparent'
         style={
         {
             textAlign: 'center',
             width: '90%',
             marginBottom: 7,
             height: 40,
             borderWidth: 1,
             borderColor: '#FF5722',
             borderRadius: 5 ,
         }
       }
       />
        <Button
          text="Enter you card details and pay"
          loading={loading}
          onPress={this.handleCardPayPress}
          {...testID('cardFormButton')}
        />
        <View
          style={styles.token}
          {...testID('cardFormToken')}>
          {token &&
            <Text style={styles.instruction}>
              Token: {token.tokenId}
            </Text>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
})
