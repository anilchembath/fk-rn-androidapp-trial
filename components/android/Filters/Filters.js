
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
import {Actions, ActionCreator} from '../../../actions';
import Checkbox from '../../shared/checkbox/checkbox';
import FilterItem from './FilterItem';
import FilerSelectedItems from './FilerSelectedItems';
import ReactComponentWithStore from 'react-native-shared/components/common/ReactComponentWithStore.js';


export default class BrowseList extends ReactComponentWithStore{
  constructor(args){
	  super(args);
	  this.state = {
		isLoading: true,
		facets: [],
		selectedFacet:{},
		appliedFilters:{}
	  }
	  this.selectFacet = this.selectFacet.bind(this);
	  this.filterItemChange = this.filterItemChange.bind(this);
	  this.isFilterApplied = this.isFilterApplied.bind(this);
  }
  componentWillMount(){
	this._bindActionCreator(ActionCreator);
	// this.subscribeToStore(this._getStore());
  }

 //  async componentDidMount() {
	// let actionCreator = this.getActionCreator()
	// actionCreator.getProducts(0,1,"");
 //  }

  componentDidMount() {
	let actionCreator = this.getActionCreator()
	if(this.props.facets){
		let facets = this.props.facets;
		let visibleFacets = facets.slice(0,8);
		let appliedFilters = this._getStore().getState().data.appliedFilters
		this.setState({
			facets: visibleFacets,
			selectedFacet: visibleFacets[0],
			isLoading: false,
			appliedFilters: appliedFilters
		});
	} 
  }

  subscribeToStore(store){
	  store.subscribe(()=>{
		  let newState = store.getState();
		  let search = newState.data.search;
		  let facetResponse = search.facetResponseList;
		  let visibleFacets = facetResponse.slice(0,7);
	  	  this.setState({
			facets: visibleFacets,
			selectedFacet: facetResponse[0],
			isLoading: false
		  });
	  });
  }
  selectFacet(facet){
  	this.setState({
  		selectedFacet:facet
  	});
  }
  clearFilter(){
  	this.getActionCreator().updateAppliedFilters({});
  	this.props.navigator.pop();
  }
  applyFilter(){
  	this.getActionCreator().updateAppliedFilters(this.state.appliedFilters);
  	this.props.navigator.pop();
  }

  filterItemChange(facet,parentFacet){
  	var appliedFilters = this.state.appliedFilters;
  	if(!appliedFilters[parentFacet.title]){
		appliedFilters[parentFacet.title] = {};
  	}
  	var filter = appliedFilters[parentFacet.title];
  	if(!filter[facet.title]){
  		filter[facet.title] = facet.resource.params;
  	}else {
  		delete filter[facet.title];
  	}
  	if(Object.keys(filter).length === 0){
  		delete appliedFilters[parentFacet.title];
  	}
  	this.setState({
  		appliedFilters: appliedFilters
  	});
  }

  isFilterApplied(facet, parentFacet){
  	if(facet.resource.selected || ( this.state.appliedFilters[parentFacet.title] && this.state.appliedFilters[parentFacet.title][facet.title])){
  		return true;
  	} 
  	return false;
  }
  render() {
  		if(!this.state.isLoading  && this.state.facets.length > 0){
  			let selectedFacet = this.state.selectedFacet;
			 return (<View style={styles.container}>
			 			{/*<View style={styles.headerStrip}>
			 				<Text style={{fontSize:22, color:'#353535'}}> Filter</Text>
			 			</View>*/}
			 			<View style={styles.filterContainer}>
						  	<View style={styles.leftContainer}>
							  	 {this.state.facets.map(facet =>
							  	 	<TouchableHighlight
								        onPress={() => this.selectFacet(facet)} key = {facet.title}>
								        { facet.title === selectedFacet.title ? 
									        <View style={styles.selectedFacet} >
											 	<Text style= {styles.selectedFacetTitleText} numberOfLines={1}>{facet.title}</Text>
											 </View>
											:
											<View style={styles.facetTitle} >
											 	<Text style= {styles.facetTitleText} numberOfLines={2}>{facet.title}</Text>
											</View>
										}
									</TouchableHighlight>
								 )}
								{/* <View style={styles.facetTitle} key ='More'>
								 	<Text style= {styles.facetTitleText} numberOfLines={2}>More</Text>
								 </View>*/}
						  	</View>
						  	<View style={styles.rightContainer}>
								{ <ScrollView
						          automaticallyAdjustContentInsets={false}
						          style={styles.scrollView}>
								        {selectedFacet.value.map(facet =>
											<FilterItem facet={facet} isChecked = {this.isFilterApplied(facet,selectedFacet)} key = {facet.title} onChange={(facet)=>{ this.filterItemChange (facet, selectedFacet) }}  />
										 )}
						        </ScrollView>}
						    {/*<FilerSelectedItems selectedFacet= {selectedFacet} filterItemChange = {this.filterItemChange} appliedFilters={this.state.appliedFilters} />*/}
							  	 
						  	</View>
						</View>
						<View style={{height:50, flexDirection:'row'}}>
							<View style={{flex:0.5}}>
								<TouchableNativeFeedback
								        onPress={this.clearFilter.bind(this)}
								        background={TouchableNativeFeedback.SelectableBackground()}>
								       		<View style={styles.clearFilter}  >
											 	<Text style= {styles.clearFilterText} numberOfLines={2}>Clear Filters</Text>
											</View>
								</TouchableNativeFeedback>
							</View>
							<View style={{flex:0.5}}>
								<TouchableNativeFeedback
								        onPress= {this.applyFilter.bind(this)}
								        background={TouchableNativeFeedback.SelectableBackground()}>
								       		<View style={styles.applyFilter} >
											 	<Text style= {styles.applyFilterText} numberOfLines={2}>Apply Filters</Text>
											</View>
								</TouchableNativeFeedback>
							</View>
						</View>
				</View> );
		} else {
			return <View  style={[styles.container, styles.loader]}>
				<ProgressBarAndroid styleAttr="Normal"/>
			</View>
		}
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

