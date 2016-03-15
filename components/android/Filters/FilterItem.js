
'use strict';

var React = require('react-native');
var PropTypes = React.PropTypes;
var {
  StyleSheet,
  Text,
  View
} = React;

import Checkbox from '../../shared/checkbox/checkbox';


export default class BrowseList extends React.Component{
  constructor(args){
	  super(args);
	  this.state = {
		isChecked: this.props.isChecked || false
	  }
  }
  propTypes: {
    facet: PropTypes.object,
    onChange: PropTypes.func,
    isChecked:PropTypes.boolean
  }
  onChange(){
  	this.setState({
  		isChecked: !this.state.isChecked
  	});
  	this.props.onChange(this.props.facet);
  }
  render() {
  		let facet = this.props.facet;
  		let label  = facet.title + "  (" + facet.count + " results)";
  		if(this.props.facet){
  			 return (<View 	style={styles.facetDetail} key = {facet.title}>
				   	<Checkbox label = {label} checked={this.state.isChecked} onChange= {this.onChange.bind(this)}  />
				  </View>); qew
  		} 
  		return (<View style={styles.container}/>);
  		
  }
};
var styles = StyleSheet.create({
  container: {
  	backgroundColor: 'white'

  },
  facetDetail:{
  	flexDirection:'row',
    borderColor: '#E4E4E4',
    borderBottomWidth: 1,
  }
});

