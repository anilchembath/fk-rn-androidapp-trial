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
        <Filter navigator={navigationOperations} facets={route.facets}/>
      </View>
    );
  } else if (route.name === 'browse') {
    return (
      <View style={{flex: 1}}>
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
