
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
				 	{/* <Text style= {{fontSize:14}} numberOfLines={1} >{facet.title} </Text>
				 	<Text style= {{fontSize:14}}></Text> */}
				 </View>);
  		}
  		return (<View style={styles.container}/>);
  		
  }
};
var styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: 'white'
  },
  filterContainer: {
	flex: 1,
	backgroundColor: 'white',
	flexDirection:'row'
  },
  loader: {
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'row',

  },
  facetDetail:{
  	padding:15, 
  	flexDirection:'row'
  }
});

