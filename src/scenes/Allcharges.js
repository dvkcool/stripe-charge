import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import {Container, Header, Left, Right, Content, Body, Thumbnail, Title,
        Icon, Button, Card, CardItem  } from 'native-base';
import { Image, Dimensions, TouchableHighlight, View, ActivityIndicator, ListView, Text} from 'react-native';
import {AppLoading } from 'expo';
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
    .then((response) => response.json())
    .then((responseJson) => {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      isLoading: false,
      dataSource: ds.cloneWithRows(responseJson),
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
            <Animatable.View
            key={rowData.count}
            animation={'bounce'}
            delay={rowData.count * 100}
            >
              <Card style={{flex: 1}}>
                
              </Card>
            </Animatable.View>
          }
          />
        </Container>);

    }
  }


}
