import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import stripe from 'tipsi-stripe'
import Spoiler from '../components/Spoiler'
import Button from '../components/Button'
import testID from '../utils/testID'

export default class CustomCardScreen extends PureComponent {
  static title = 'Card + Extra details'

  state = {
    loading: false,
    token: null,
    error: null,
    params: {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 24,
      cvc: '223',
      name: 'Test User',
      currency: 'usd',
      addressLine1: '123 Test Street',
      addressLine2: 'Apt. 5',
      addressCity: 'Test City',
      addressState: 'Test State',
      addressCountry: 'Test Country',
      addressZip: '55555',
    },
  }

  handleCustomPayPress = async () => {
    try {
      this.setState({ loading: true, token: null, error: null })

      const token = await stripe.createTokenWithCard(this.state.params)
      this.setState({error: undefined, token })
      fetch('https://api.advance88.hasura-app.io/charge', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                src: this.state.token.tokenId,
                amount: "50",
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

      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false, error })
    }
  }

  render() {
    const { loading, token, error, params } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Generating token with custom params
        </Text>
        <Spoiler title="Mandatory Fields">
          <View style={styles.params}>
            <Text style={styles.param}>Number: {params.number}</Text>
            <Text style={styles.param}>Month: {params.expMonth}</Text>
            <Text style={styles.param}>Year: {params.expYear}</Text>
          </View>
        </Spoiler>
        <Spoiler title="Optional Fields" defaultOpen={false}>
          <View style={styles.params}>
            <Text style={styles.param}>CVC: {params.cvc}</Text>
            <Text style={styles.param}>Name: {params.name}</Text>
            <Text style={styles.param}>Currency: {params.currency}</Text>
            <Text style={styles.param}>Address Line 1: {params.addressLine1}</Text>
            <Text style={styles.param}>Address Line 2: {params.addressLine2}</Text>
            <Text style={styles.param}>Address City: {params.addressCity}</Text>
            <Text style={styles.param}>Address State: {params.addressState}</Text>
            <Text style={styles.param}>Address Country: {params.addressCountry}</Text>
            <Text style={styles.param}>Address Zip: {params.addressZip}</Text>
          </View>
        </Spoiler>
        <Text style={styles.instruction}>Click button to get token based on params.</Text>
        <Button
          text="Pay 50 usd with custom params"
          loading={loading}
          onPress={this.handleCustomPayPress}
          {...testID('customCardButton')}
        />
        {token &&
          <View style={styles.token} {...testID('customCardToken')}>
            <Text style={styles.instruction}>Token: {token.tokenId}</Text>
          </View>
        }
        {error &&
          <View style={styles.token} {...testID('customCardTokenError')}>
            <Text style={styles.instruction}>Error: {error}</Text>
          </View>
        }
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
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  params: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
    margin: 5,
  },
  param: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
})
