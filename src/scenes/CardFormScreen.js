import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

export default class CardFormScreen extends PureComponent {
  static title = 'Pay via card'

  state = {
    loading: false,
    token: null,
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

      fetch('https://api.ascendancy10.hasura-app.io/charge', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                key: "sk_test_BQokikJOvBiI2HlWgH4olfQ2",
                src: this.state.token,
                amount: "50",
                currency: "EUR"

                })
              }).then((res) => {
                      // Showing response message coming from server updating records.
                      Alert.alert(""+res.status);
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
          Click button to show Card Form dialog.
        </Text>
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
