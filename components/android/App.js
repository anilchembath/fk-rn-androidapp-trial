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
var ToastAndroid = require('../../nativemodules/ToastModule');
import ReactComponentWithStore from 'react-native-shared/components/common/ReactComponentWithStore.js';

ToastAndroid.show('Awesome', ToastAndroid.SHORT);

export default class App extends ReactComponentWithStore{
  constructor(args){
      super(args);
  }

  render() {
    return (
      <View style={{flex: 1}}>
          <ListPage/>
      </View>
    );
  }
};
