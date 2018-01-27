import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Alert, ListView } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

export default class Allcharges extends PureComponent {
  static title = 'Last 10 transactions'
  state = {
    loading: false,
    buttonclk: false,
    dataSource: '',
  }

  handleCardPayPress = async () => {
          this.setState({ loading: true})
      fetch('https://api.ascendancy10.hasura-app.io/charges/10', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                key: "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
                })
              })
              .then((response) => response.json())
              .then((responsejson) => {
                      // Showing response message coming from server updating records.
                      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                      this.setState({ loading: false,
                       dataSource: ds.cloneWithRows(responsejson.data),});
                     this.setState({ buttonclk: true });

                    }).catch((error) => {
                      console.error(error);
                    });


  }

  render() {
    const { loading, token } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Click to get last 10 transactions
        </Text>
        <Button
          text="Click to get last 10 transactions"
          loading={loading}
          onPress={this.handleCardPayPress}
          {...testID('cardFormButton')}
        />
     <Listcharges press={this.state.buttonclk} data ={this.state.dataSource}/>
      </View>
    )
  }
}
class Listcharges extends PureComponent{
  ListViewItemSeparator = () => {
  return (
    <View
      style={{
        height: .5,
        width: "100%",
        backgroundColor: "#000",
      }}
    />
  );
}
  render(){
    if(this.props.press){
      return(
        <View>
            <ListView
          dataSource={this.props.data}
          style={{paddingRight: 10,}}
          renderSeparator= {this.ListViewItemSeparator}
          renderRow={(rowData) =>
            <View>
              <Text> Transaction id:  {rowData.id}</Text>
            </View>
          }
          />
          </View>
      );
    }
    else{
      return(
        <View>
        <Text> </Text>
        </View>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
