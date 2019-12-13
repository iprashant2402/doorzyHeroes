import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Picker,
  Linking
} from "react-native";

import { Button } from "react-native-elements";

import { MonoText } from "../components/StyledText";
import { inject, observer } from "mobx-react/native";
import { colors } from "../colors/colors";

import firebase from "firebase";
import "firebase/firestore";
import { TextInput } from "react-native-gesture-handler";
import sendNotification from '../util/sendNotification';

if (Platform.OS !== "web") {
  window = undefined;
}

@inject("mainStore")
@observer
class OrderDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order : {},
      showIndicator : true,
      user : {},
      Desc :'',
      packingCharge : 0,
      surgeFees : 0,
      exceptedTime : 0,
      updateStatusIndicator : false,
      generateBillIndicator : false,
      completeIndicator : false
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

  validateAmount = () => {
    var flag = true;
    this.state.order.products.forEach(function(item){
      
        if(item.amount===""){
          flag = false;
        }
      
    });
    return flag;
  }

  getNumberOfDays = (day) => {
    var one_day = 24*60*60*1000;
    var currentDay = + new Date();
    return (Math.round(Math.abs(currentDay-day)/one_day));
  }

  getCurrentTime = () => {
    var d = new Date(+ new Date);
    var hours = d.getHours();
    console.log(hours);
    return hours;
  }

  deliveryCharge = (total) => {
    const days = this.getNumberOfDays(this.state.user.regTimestamp);
    if(days<0){
      const delivery = 0;
      return delivery;
    }else{
      if(this.getCurrentTime() >= 23 || this.getCurrentTime() < 9){
        return 19;
      }
      if(total<100){
        return 25;
      }
      if(total>=100 && total<300){
        return 19; 
      }
      if(total >= 300){
        return 19;
      }
      else{
        return 0;
      }
    }
  }

  updateTotal = (total) => {
    let order = {...this.state.order};
    const deliveryRate = this.deliveryCharge(total);
    order.total = total + deliveryRate + this.state.packingCharge + this.state.surgeFees;
    this.setState({
      order : order
    });
  }

  generateBill = async () => {
    if(this.validateAmount()){
      this.setState({
        generateBillIndicator : true
      });
      const thisRef = this;
      const ordersRef = firebase.firestore().collection('orders').doc(this.state.order.oid);
      var total = 0;
      this.state.order.products.forEach(function(item){
        total = total + Number(item.amount);
      });
      await this.updateTotal(total);
      const products = this.state.order.products;
      const grandTotal = this.state.order.total;
      const packingCharge = this.state.packingCharge;
      const surgeFees = this.state.surgeFees;
      const Desc = this.state.Desc;
      const exceptedTime = this.state.exceptedTime;
      ordersRef.update({
        products : products,
        total : grandTotal,
        packingCharge : packingCharge,
        surgeFees : surgeFees,
        Desc : Desc,
        exceptedTime : exceptedTime,
      }).then(function(){
        thisRef.setState({
          generateBillIndicator : false
        });
        alert("Bill generated successfully.");
      }).catch(err=>{console.log(err)});
    }
  }

  updateStatus = () => {
    this.setState({
      updateStatusIndicator : true
    });
    const thisRef = this;
    const content = "Your order with Order # "+this.state.order.oid+" has been "+this.state.order.statusCode+".";
    const title = "Order "+this.state.order.statusCode;
    console.log(title);
    const ordersRef = firebase.firestore().collection('orders').doc(this.state.order.oid);
    const statusCode = this.state.order.statusCode;
    ordersRef.update({
      statusCode : statusCode
    }).then(function(){
      thisRef.setState({
        updateStatusIndicator : false
      });
      sendNotification(thisRef.state.order.uid,content,title);
    }).catch(err=>console.log(err));
  }

  componentDidMount = () => {
    const thisRef = this;
    const orderId = this.props.navigation.getParam("orderId", "NO-ID");
    const ordersRef = firebase
      .firestore()
      .collection("orders")
      .doc(orderId);
    ordersRef
      .get()
      .then(function(doc) {
        const userRef = firebase
          .firestore()
          .collection("users")
          .doc(doc.data().uid);
        userRef
          .get()
          .then(function(user) {
            thisRef.setState({
              user: user.data()
            });
          })
          .catch(err => console.log(err));
        thisRef.setState(
          {
            order: doc.data()
          },
          () => {
            thisRef.setState({ showIndicator: false });
          }
        );
      })
      .catch(err => console.log(err));
  };

  handleChange = (txt, i) => {
    let newText = '';
    let numbers = '0123456789.';
    let order = { ...this.state.order };
    for (var j=0; j < txt.length; j++) {
        if(numbers.indexOf(txt[j]) > -1 ) {
            newText = newText + txt[j];
        }
        else {
            // your call back function
        }
    }
    order.products[i].amount = newText;
    this.setState({
      order: order
    });
  };

  incrementOrderCount = () => {
    const thisRef = this;
    const deliveryExecRef = firebase.firestore().collection('deliveryExecs').doc(this.props.mainStore.user.uid);
    if(this.state.order.statusCode==="delivered"){
      deliveryExecRef.update({
        ordersCompleted : firebase.firestore.FieldValue.increment(1)
      });
    }
  }

  markComplete = () => {
    this.setState({
      completeIndicator : true
    });
    const thisRef = this;
    const ordersRef = firebase.firestore().collection('orders').doc(this.state.order.oid);
    ordersRef.update({
      active : false,
      paymentRecieved : true
    }).then(()=>{
      let order = {...thisRef.state.order};
      order.active = false;
      order.paymentRecieved = true;
      thisRef.setState({
        order : order,
        completeIndicator : false
      });
      alert("ORDER MARKED AS COMPLETED");
      this.incrementOrderCount();
    }).catch(err=>console.log(err));
  }

  render() {
    if (this.state.order.products) {
      productList = this.state.order.products.map((l, i) => (
        <View style={styles.productItemWrapper} key={i}>
          <View style={styles.leftItem}>
            <Text style={styles.productName}>
              {l.brand}-{l.name} X {l.quantity}
            </Text>
            <Text style={styles.productName}>
            Est. Cost: {l.estAmt}
            </Text>
            <Text style={styles.productName}>
            P.S.: {l.preferredShop}
            </Text>
          </View>
          <View>
            <Text style={styles.currency}>INR </Text>
          </View>
          <View style={styles.rightItem}>
            <TextInput
              onChangeText={txt => this.handleChange(txt, i)}
              value={l.amount || ""}
              keyboardType="numeric"
              placeholder="0.00"
              style={styles.productPrice}
            />
          </View>
        </View>
      ));
      address = (
        <View style={styles.timeWrapper}>
          <Text style={styles.productName}>
            {this.state.order.address.addLine1}
          </Text>
          <Text style={styles.productName}>
            {this.state.order.address.addLine2}
          </Text>
          <Text style={styles.productName}>
            {this.state.order.address.landmark}
          </Text>
        </View>
      );
    } else {
      productList = <Text />;
      address = <Text />;
    }
    if (this.state.user.phone) {
      userInfo = (
        <View style={styles.timeWrapper}>
          <Text style={styles.productName}>
            FULL NAME : {this.state.user.fname} {this.state.user.lname}
          </Text>
          <Text style={styles.productName}>
            PHONE : <Text onPress={()=>{Linking.openURL(`tel:${this.state.user.phone}`)}}>+91{this.state.user.phone}</Text>
          </Text>
        </View>
      );
    } else {
      userInfo = <Text />;
    }
    if (this.state.order.total){
      total = (
        <View style={styles.timeWrapper}>
          <Text style={styles.total}>
            TOTAL : {this.state.order.total}
          </Text>
        </View>
      );
    }
    else {
      total = <Text/>;
    }
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.timeWrapper}>
            <Button loading={this.state.completeIndicator} onPress={()=>this.markComplete()} disabled={!this.state.order.active} type="solid" buttonStyle={styles.successbtn} title="Mark As Completed" />
          </View>
          <View style={styles.timeWrapper}>
            <Text style={styles.activeOrderTitle}>
              ORDER # {this.state.order.oid}
            </Text>
          </View>
          <View style={styles.welcomeContainer}>
            <ActivityIndicator
              animating={this.state.showIndicator}
              size="large"
              color={colors.primary}
            />
          </View>
          <View style={styles.timeWrapper}>
            <Text style={styles.orderTitle}>CUSTOMER INFO</Text>
          </View>
          {userInfo}
          <View style={styles.timeWrapper}>
            <Text style={styles.orderTitle}>DELIVER TO</Text>
          </View>
          {address}
          <View style={styles.timeWrapper}>
            <Text style={styles.orderTitle}>PRODUCTS</Text>
          </View>
          <View style={styles.timeWrapper}>{productList}</View>
          <View style={styles.timeWrapper}>
          <TextInput
              onChangeText={txt => this.setState({Desc : txt})}
              value={this.state.Desc}
              placeholder="Description"
              style={styles.productDesc}
            />
          </View>
          <View style={styles.timeWrapper}>
          <TextInput
              onChangeText={txt => this.setState({packingCharge : parseInt(txt)})}
              value={this.state.packingCharge}
              keyboardType="numeric"
              placeholder="PACKING CHARGE IN INR"
              style={styles.productPrice}
            />
          </View>
          <View style={styles.timeWrapper}>
          <TextInput
              onChangeText={txt => this.setState({surgeFees : parseInt(txt)})}
              value={this.state.surgeFees}
              keyboardType="numeric"
              placeholder="SURGE FEESS IN INR"
              style={styles.productPrice}
            />
          </View>
          <View style={styles.timeWrapper}>
          <TextInput
              onChangeText={txt => this.setState({exceptedTime : parseInt(txt)})}
              value={this.state.exceptedTime}
              keyboardType="numeric"
              placeholder="Enter Excepted Time for Delivery (in mins)"
              style={styles.productPrice}
            />
          </View>
          {total}
          <View style={styles.timeWrapper}>
            <Button disabled={!this.state.order.active} title="GENERATE BILL" loading={this.state.generateBillIndicator} buttonStyle={styles.paymentBtn} onPress={()=>this.generateBill()}/>
          </View>
          <View style={styles.timeWrapper}>
            <Text style={styles.orderTitle}>ORDER STATUS</Text>
            <Picker
              selectedValue={this.state.order.statusCode}
              style={{ height: 50 }}
              onValueChange={(itemValue, itemIndex) => {
                let order = { ...this.state.order };
                order.statusCode = itemValue;
                this.setState({ order: order });
              }}
            >
              <Picker.Item
                label="Pending Confirmation"
                value="pending confirmation"
              />
              <Picker.Item label="Accepted" value="accepted" />
              <Picker.Item label="Picked Up" value="picked up" />
              <Picker.Item label="Cancel" value="cancelled" />
              <Picker.Item label="Delivered" value="delivered" />
            </Picker>
          </View>
          <View style={styles.timeWrapper}>
            <Button disabled={!this.state.order.active} title="UPDATE STATUS" loading={this.state.updateStatusIndicator} buttonStyle={styles.paymentBtn} onPress={()=>this.updateStatus()}/>
          </View>
        </ScrollView>
      </View>
    );
  }
}

OrderDetailScreen.navigationOptions = {
  title: "Order Details"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10
  },
  successbtn : {
    backgroundColor : colors.successButton,
    borderRadius : 0
  },
  btnWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  total : {
    fontSize : 20,
    color : colors.primary
  },
  productName: {
    fontSize: 16,
    color: colors.text
  },
  productPrice: {
    padding: 5,
    borderColor: colors.greyBorder,
    borderWidth: 1
  },
  productDesc: {
    padding: 5,
    borderColor: colors.greyBorder,
    borderWidth: 1,
    height: 100 
  },
  productItemWrapper: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 5
  },
  leftItem: {
    flex: 3
  },
  rightItem: {
    flex: 1
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
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder
  },
  orderTitleWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10
  },
  activeOrderTitle: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "bold"
  },
  total: {
    fontSize: 20,
    color: colors.text
  },
  orderTitle: {
    fontSize: 18,
    color: colors.primary,  
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
  }
});

export default OrderDetailScreen;
