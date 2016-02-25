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

var ListPage = require('./components/android/ListPage');
var ToastAndroid = require('./nativemodules/ToastModule');

ToastAndroid.show('Awesome', ToastAndroid.SHORT);

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
  if (route.name === 'search') {
    return (
    	<View style={{flex: 1}}>
	        <ListPage navigator={navigationOperations} />
      </View>
      
    );
  }
};

var BrowsePage = React.createClass({
  render: function() {
    var initialRoute = {name: 'search'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}/>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#006cb4',
    height: 55,
    paddingTop:10
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#006cb4',
    paddingTop:10,
    paddingLeft:10
  },
  logoImage:{
  	height:30,
  	width:30
  },
});
module.exports = BrowsePage;

AppRegistry.registerComponent('BrowsePage', () => BrowsePage);
