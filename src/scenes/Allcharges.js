import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Alert, ListView, Image, ScrollView, TouchableOpacity } from 'react-native'
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
      fetch('https://api.advance88.hasura-app.io/charges/10', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
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
class PaidImg extends PureComponent{
  render(){
    if(this.props.paid){
      return(
        <View style ={this.props.style}>
          <Image source={require('../assets/green.png')} />
          <Text> Success </Text>
        </View>
      );
    }
    else{
      return(
        <View style ={this.props.style}>
          <Image source={require('../assets/red.png')} />
          <Text> Failed </Text>
        </View>
      );
    }
  }
}
class Listcharges extends PureComponent{
  ListViewItemSeparator = () => {
  return (
    <View
      style={{
        height: 2,
        width: "100%",
        backgroundColor: "#000",
      }}
    />
  );
  }
  GetStatus=(rowData)=>{
    if(rowData.paid){
      Alert.alert("Payment successful", "Payment was successful with\n transaction id: "+ rowData.id);
    }
    else{
      Alert.alert("Payment failed", "Your payment failed as \n"+rowData.failure_message );
    }
  }
  render(){
    if(this.props.press){
      return(
        <View>
	<Text> Click on any transaction to get its details, its failure code etc.</Text>
        <ScrollView>
            <ListView
          dataSource={this.props.data}
          style={{paddingRight: 10,}}
          renderSeparator= {this.ListViewItemSeparator}
          renderRow={(rowData) =>
            <TouchableOpacity onPress={this.GetStatus.bind(this, rowData)} >
            <View style={{borderColor: '#DAFF7F', backgroundColor:'#FFFFFF', padding: 5, paddingTop: 5, paddingLeft: 5}}>
            <Text> Amount:  <Text style={{color: '#F73131', size: 20}}>{rowData.amount} {rowData.currency}</Text>
            </Text>
            <PaidImg paid = {rowData.paid} style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',}}/>
            <Text> Transaction id:  {rowData.id} </Text>
            </View>
            </TouchableOpacity>
          }
          />
          </ScrollView>
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
