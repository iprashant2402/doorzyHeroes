import React from 'react';
import { ScrollView, StyleSheet, Platform, Text ,View} from 'react-native';
import {Button,Divider,Avatar,ListItem} from 'react-native-elements';
import { inject, observer } from 'mobx-react/native';
import firebase from 'firebase';
import { colors } from "../colors/colors";
import 'firebase/firestore';

if (Platform.OS !== "web") {
  window = undefined;
}

@inject('mainStore')
@observer
class AccountScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={};
  }

  handleSignOut = async () => {
    await firebase.auth().signOut();
  }

  render(){
    const user = this.props.mainStore.user;
  return (
    <View style={styles.container}>
        <ScrollView>
          <Divider style={{ backgroundColor: "transparent", height: 20 }} />
          <View style={styles.cardWrapper}>
            <View style={styles.backgroundBox}>
              <View style={styles.avatarContainer}>
                <Avatar
                  placeholderStyle={{ backgroundColor: "#446DF6" }}
                  rounded
                  title={user.firstName[0] + user.lastName[0]}
                  size="xlarge"
                />
              </View>
              <View style={styles.avatarContainer}>
                <Text style={styles.itemTitle}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text style={styles.itemTitle}>
                  {user.email}
                </Text>
              </View>
            </View>
          </View>
          <Divider style={{ backgroundColor: "transparent", height: 20 }} />
          <View style={styles.cardWrapper}>
          <ListItem key="phone" title={user.phone} leftIcon={{ name: "call",color:colors.brandPrimary }}/>
          <ListItem key="orders" title={"Total Orders Completed : "+user.ordersCompleted}/>
          </View>
          <Divider style={{ backgroundColor: "transparent", height: 20 }} />
          <Button title="SIGN OUT" onPress={()=>{this.handleSignOut()}} type="clear"/>
        </ScrollView>
      </View>
  );
  }
}

AccountScreen.navigationOptions = {
  title: 'My Account',
};

const styles = StyleSheet.create({
  headerLeftButton: {
    padding: 5
  },
  boxTitle: {
    fontSize: 30,
    fontFamily: "Rubik-Regular",
    textAlign: "center",
    color: colors.primarySupport
  },
  cardWrapper: {
    padding: 15,
    //borderRadius : 3,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor : colors.greyBorder
  },
  container: {
    flex: 1,
    backgroundColor: colors.greyBackground
  },
  backgroundBox: {
    backgroundColor: colors.white,
    padding: 10,
    justifyContent: "center",
    textAlign: "center"
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10
  },
  dividerStyle: {
    backgroundColor: "transparent"
  },
  listItemWrapper: {
    flexDirection: "row",
    padding: 10
  },
  itemText: {
    //fontFamily: "Rubik-Regular",
    textAlign: "center",
    fontSize: 15,
    color: colors.placeholder
  },
  itemTitle: {
    //fontFamily: "josephine",
    color: '#331a4b',
    fontSize: 25
  },
  nameTitle: {
    fontSize: 25,
    fontFamily: "josephine",
    textAlign: "center",
    color: colors.white
  },
  overlayText: {
    fontFamily: "montserrat",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center"
  },
  centeredRow: {
    justifyContent: "center",
    flexDirection: "row"
  }
});


export default AccountScreen;