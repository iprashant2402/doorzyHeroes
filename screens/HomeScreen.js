import * as WebBrowser from "expo-web-browser";
import React from "react";
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

import firebase from "firebase";
import "firebase/firestore";

import { Button } from "react-native-elements";

import { MonoText } from "../components/StyledText";
import { inject, observer } from "mobx-react/native";
import { colors } from "../colors/colors";

import sendNotification from '../util/sendNotification';

if (Platform.OS !== "web") {
  window = undefined;
}

@inject("mainStore")
@observer
class HomeScreen extends React.Component {
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

  acceptOrder = async order => {
    const db = firebase.firestore();
    const thisRef = this;
    const uid = this.props.mainStore.uid;
     db.collection('orders').doc(order.oid).update({
      statusCode : 'accepted',
      deliveryExecId : uid
    }).then(function(){
      sendNotification(order.uid,"Your order has been accepted. Our doorzy hero is on the way to pick up your order.","Order Accepted");
      console.log("ORDER ACCEPTED : " + order.oid);
      thisRef.props.navigation.navigate('OrderHistory');
    }).catch(err => console.log(err));
  };

  showAcceptLink = order => {
    return (
      <View style={styles.btnWrapper}>
        <Button
          type="solid"
          titleStyle={styles.paymentBtn}
          title="ACCEPT"
          onPress={() => this.acceptOrder(order)}
          buttonStyle={styles.paymentBtn}
        />
      </View>
    );
  };

  componentDidMount = () => {
    const thisRef = this;
    const ordersRef = firebase.firestore().collection("orders");
    ordersRef
      .where("statusCode", "==", "pending confirmation")
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
          <Text style={styles.status}>ITEMS:</Text>
        </View>
        <View style={styles.productList}>
          {l.products.map((p, j) => (
            <Text style={styles.productItem} key={j}>
            {p.brand}-{p.name} x {p.quantity}
            </Text>
          ))}
        </View>
        <View style={styles.productList}>
          <Text style={styles.status}>ADDRESS:</Text>
            <Text style={styles.productItem}>
              {l.address.addLine1}
            </Text>
            <Text style={styles.productItem}>
              {l.address.addLine2}
            </Text>
            <Text style={styles.productItem}>
              {l.address.landmark}
            </Text>
        </View>
        <View style={styles.timeWrapper}>
          <Text style={styles.status}>STATUS : {l.statusCode}</Text>
        </View>
        {this.showAcceptLink(l)}
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

HomeScreen.navigationOptions = {
  header: null
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
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    padding: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});

export default HomeScreen;
