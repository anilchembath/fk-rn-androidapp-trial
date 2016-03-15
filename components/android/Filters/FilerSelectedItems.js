
'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableHighlight,
  ScrollView
} = React;

import FilterItem from './FilterItem';


export default class BrowseList extends React.Component{
  constructor(args){
	  super(args);
	  this.state = {
		isLoading: true,
		facets: [],
		selectedFacet:{},
		visibleFacet : {}
	  }
	  this.isFilterApplied = this.isFilterApplied.bind(this);
  }
 
componentDidMount() {
	// let actionCreator = this.getActionCreator()
	// if(this.props.facets){
	// 	let facets = this.props.facets;
	// 	let visibleFacets = facets.slice(0,8);
	// 	let appliedFilters = this._getStore().getState().data.appliedFilters
	// 	this.setState({
	// 		facets: visibleFacets,
	// 		selectedFacet: visibleFacets[0],
	// 		isLoading: false,
	// 		appliedFilters: appliedFilters
	// 	});
	// } 
  }
 isFilterApplied(facet, parentFacet){
  	if(facet.resource.selected || ( this.props.appliedFilters[parentFacet.title] && this.props.appliedFilters[parentFacet.title][facet.title])){
  		return true;
  	} 
  	return false;
  }
  render() {
		 let selectedFacet = this.props.selectedFacet;
		 return (<View style={styles.container}>
		 			<ScrollView
			          automaticallyAdjustContentInsets={false}
			          style={styles.scrollView}>
					        {selectedFacet.value.map(facet =>
								<FilterItem facet={facet} isChecked = {this.isFilterApplied(facet,selectedFacet)} key = {facet.title} onChange={(facet)=>{ this.props.filterItemChange (facet, selectedFacet) }}  />
							 )}
			        </ScrollView>
				</View> );
		
  }
};
var styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: 'white',
	flexDirection:'column'
  },
  filterContainer: {
	flex: 1,
	backgroundColor: 'white',
	flexDirection:'row'
  },
  leftContainer:{
  	flex:0.4,
  	backgroundColor:'#454545'
  },
  rightContainer:{
  	flex:0.6,
  	backgroundColor:'#ffffff',
  	overflow:'visible'
  },
  headerStrip:{
  	borderColor: '#E4E4E4',
	borderBottomWidth: 1,
	padding:10
  },
  loader: {
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'row',

  },
  facetTitle: {
  	backgroundColor:'#454545',
  	alignItems: 'center',
  	justifyContent: 'center',
  	borderColor: '#E4E4E4',
	borderBottomWidth: 1,
	overflow:'hidden',
	paddingLeft:5,
	paddingRight:5,
	height:50
  },
  selectedFacet: {
  	backgroundColor:'#F5F4ED',
  	alignItems: 'center',
	justifyContent: 'center',
  	borderColor: '#E4E4E4',
	borderBottomWidth: 1,
	overflow:'hidden',
	paddingLeft:5,
	paddingRight:5,
	height:50
  },
  facetTitleText: {
  	fontSize:16,
  	color:'#ffffff'
  },
  selectedFacetTitleText: {
  	fontSize:16,
  	color:'#353535'
  },
  facetDetail:{
  	padding:15, 
  	flexDirection:'row'
  },
  applyFilter: {
  	backgroundColor:'#f36522',
  	alignItems: 'center',
	justifyContent: 'center',
  	overflow:'hidden',
	height:50
  },
  clearFilter: {
  	backgroundColor:'#EEEEEE',
  	alignItems: 'center',
	justifyContent: 'center',
  	
	overflow:'hidden',
	height:50
  },
  clearFilterText: {
	fontSize:18,
  	color:'#353535'
  },
  applyFilterText: {
  	fontSize:18,
  	color:'#ffffff'
  },
   scrollView: {
    height: 300,
  },
});

