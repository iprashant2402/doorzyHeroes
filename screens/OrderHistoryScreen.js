import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";

import { Button } from "react-native-elements";

import { MonoText } from "../components/StyledText";
import { inject, observer } from "mobx-react/native";
import { colors } from "../colors/colors";

import firebase from "firebase";
import "firebase/firestore";


if (Platform.OS !== "web") {
  window = undefined;
}

@inject('mainStore')
@observer
class OrderHistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      showIndicator: true
    };
  }

  getNotifDate = timestamp => {
    var d = new Date(timestamp);
    if (d.getHours() >= 12)
      return (
        d.getHours() +
        ":" +
        d.getMinutes() +
        " PM" +
        "  " +
        d.getDate() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getFullYear()
      );
    else
      return (
        d.getHours() +
        ":" +
        d.getMinutes() +
        " AM" +
        "  " +
        d.getDate() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getFullYear()
      );
  };

  viewOrderDetails = orderId => {
    this.props.navigation.navigate('OrderDetail',{
      orderId : orderId
    });
  }

  
  componentDidMount = () => {
    const thisRef = this;
    const ordersRef = firebase.firestore().collection("orders");
    ordersRef
      .where("deliveryExecId", "==", this.props.mainStore.uid).where("active","==",true)
      .onSnapshot(function(snap) {
        const ordersArray = [];
        snap.forEach(order => {
          ordersArray.push(order.data());
        });
        thisRef.setState(
          {
            orders: ordersArray.sort(function(x, y) {
              return y.regTime - x.regTime;
            })
          },
          () => {
            console.log("CALLBACK OF setState");
            console.log(thisRef.state.orders);
            thisRef.setState({ showIndicator: false });
          }
        );
      });
  };

  render() {
    ordersList = this.state.orders.map((l, i) => (
      <View
        style={styles.orderItem}
        key={i}
      >
        <View style={styles.orderTitleWrapper}>
          <Text style={styles.orderTitle}>ORDER # {l.oid}</Text>
        </View>
        <View style={styles.productList}>
          {l.products.map((p, j) => (
            <Text style={styles.productItem} key={j}>
              {p.brand}-{p.name} x {p.quantity}
            </Text>
          ))}
        </View>
        <View style={styles.timeWrapper}>
          <Text style={styles.status}>STATUS : {l.statusCode}</Text>
        </View>
        <View style={styles.btnWrapper}>
        <Button
          type="solid"
          titleStyle={styles.paymentBtn}
          title="VIEW"
          onPress={() => this.viewOrderDetails(l.oid)}
          buttonStyle={styles.paymentBtn}
        />
      </View>
        <View style={styles.timeWrapper}>
          <Text style={styles.time}>
            Placed at : {this.getNotifDate(l.regTime)}
          </Text>
        </View>
      </View>
    ));
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          {ordersList}
          <View style={styles.welcomeContainer}>
            <ActivityIndicator
              animating={this.state.showIndicator}
              size="large"
              color={colors.primary}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

OrderHistoryScreen.navigationOptions = {
  title: 'My Orders',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  btnWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  paymentBtn: {
    backgroundColor: colors.primary,
    borderRadius: 0
  },
  timeWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  time: {
    fontSize: 12,
    color: colors.text
  },
  h1: {
    fontSize: 15,
    color: colors.text
  },
  activeOrder: {
    marginBottom: 10,
    backgroundColor: colors.white,
    paddingVertical: 20
  },
  orderItem: {
    marginBottom: 10,
    backgroundColor: colors.white,
    paddingVertical: 20,
    borderBottomWidth : 1,
    borderBottomColor : colors.greyBorder
  },
  orderTitleWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10
  },
  activeOrderTitle: {
    fontSize: 15,
    color: colors.successButton
  },
  total: {
    fontSize: 20,
    color: colors.text
  },
  orderTitle: {
    fontSize: 15,
    color: colors.primary
  },
  productList: {
    paddingHorizontal: 20
  },
  productItem: {
    fontSize: 12,
    color: colors.text
  },
  status: {
    textTransform: "uppercase",
    fontSize: 12,
    color: colors.primary
  },
});

export default OrderHistoryScreen;