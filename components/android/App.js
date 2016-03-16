/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  ToolbarAndroid,
  Text,
  Image,
  View,
} = React;
//import { connect } from 'react-redux';
import ListPage from './BrowseList';
import Filter from './Filters/Filters';
var ToastAndroid = require('../../nativemodules/ToastModule');
import ReactComponentWithStore from 'react-native-shared/components/common/ReactComponentWithStore.js';

//ToastAndroid.show('Awesome', ToastAndroid.SHORT);
var _navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;
  if (route.name === 'filter') {
    return (
      <View style={{flex: 1}}>
         <View style={styles.headerStrip}>
            <Text style={{fontSize:22, color:'#353535'}}> Filter</Text>
        </View>
        <Filter navigator={navigationOperations} facets={route.facets}/>
      </View>
    );
  } else if (route.name === 'browse') {
    return (
      <View style={{flex: 1}}>
       <View style={styles.flipkartHeader}>
         {/* <View style={styles.backButton}>
              <Image
              style={styles.backlogo}
              source={{uri:'back'}}/>
          </View>*/}
          <View style={styles.flipkartLogo}>
            <Image
              style={styles.logo}
              source={{uri:'logo'}}/>
          </View>
        </View>
        <ListPage
          style={{flex: 1}}
          navigator={navigationOperations}
        />
      </View>
    );
  }
};

export default class App extends ReactComponentWithStore{
  constructor(args){
      super(args);
  }

  render() {
    var initialRoute = {name: 'browse'};
    return (
      <Navigator
        style={{flex: 1}}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}/>
    );
  }
};

var styles = StyleSheet.create({
  headerStrip:{
    borderColor: '#E4E4E4',
    borderBottomWidth: 1,
    backgroundColor:'#ffffff',
    padding:10
  },
  flipkartHeader:{
    backgroundColor:'#4279D4',
    height:50,
    paddingLeft:20,
    paddingTop:10,
    flexDirection:'row'
  },
  logo:{
    height:30,
    width:30,
  },
  flipkartLogo:{
    height:30,
    width:30
  },
  backButton:{
    marginRight:10,
    height:20,
    width:20,
  },
  backlogo:{
    backgroundColor:'#ffffff',
    height:20,
    width:20,
  }
});
