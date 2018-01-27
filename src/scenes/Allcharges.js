import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import {Container, Left, Right, Card, CardItem  } from 'native-base';
import { View,  ListView, Text} from 'react-native';
export default class Allcharges extends Component {
 state = {
    isLoading: true,
  };

  componentDidMount() {
    return fetch('https://api.bouncy64.hasura-app.io/charges/10', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
      })
    })
    .then((response) => {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      isLoading: false,
      dataSource: ds.cloneWithRows(response.data),
    }, function() {});
    })
    .catch((error) => {
      console.error(error);
    });
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
        <ActivityIndicator />
        </View>
      );
    }
    else{
      return (
        <Container>
          <ListView
          dataSource={this.state.dataSource}
          style={{paddingRight: 10,}}
          renderRow={(rowData) =>
              <Card style={{flex: 1}}>
              <CardItem>
                <Left>
                  <Text> Amount:  {rowdata.amount} </Text>
                </Left>
                <Body/>
                <Right/>
              </CardItem>
              <CardItem>
                <Left/>
                <Body/>
                <Right>
                  <Text color: '#99FF00'> Succes: <Text color: '#FF4600'> {rowddata.paid} </Text></Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text> Charge id:   <Text color: '#99FF00'> {rowdata.id} </Text></Text>
                </Left>
              </CardItem>
              </Card>
          }
          />
        </Container>);

    }
  }


}
