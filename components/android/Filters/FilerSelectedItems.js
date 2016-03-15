
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
  TouchableNativeFeedback,
  TouchableHighlight,
  ScrollView,
  ListView

} = React;

import FilterItem from './FilterItem';


export default class BrowseList extends React.Component{
  constructor(args){
	  super(args);
	  this.state = {
		facets: {},
		visibleFacet: {},
	  	dataSource: new ListView.DataSource({
			  rowHasChanged: (row1, row2) => {
				return row1 !== row2
			  },
			  getRowData: (dataBlob, sectionID, rowID) => {
				return dataBlob[sectionID][rowID];
			  }

		}),
		startIndex: 0,
		filterCount: 30
	  }
	  this.isFilterApplied = this.isFilterApplied.bind(this);
  }
 
componentDidMount() {
	if(this.props.selectedFacet){
		let facets = this.props.selectedFacet.value;
		let visibleFacets = facets.length > this.state.filterCount ? facets.slice(0,this.state.filterCount) : facets;
		this.setState({
			selectedFacet: this.props.selectedFacet,
			visibleFacets: visibleFacets,
			startIndex: visibleFacets.length,
			hasMoreRecords: facets.length > visibleFacets.length
		});
	} 
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
	if(facet.resource.selected || ( this.props.appliedFilters[parentFacet.title] && this.props.appliedFilters[parentFacet.title][facet.title])){
		return true;
	} 
	return false;
  }
  onEndReached() {
  	if(this.state.hasMoreRecords){
  		let facets  =this.state.facets.value;
  		let visibleFacets = this.state.visibleFacets;
  		let startIndex = this.state.startIndex;
  		let spliceIndex =  (facets.length - startIndex  > this.state.filterCount) ?  (startIndex +  this.state.filterCount) :  facets.length;
  		let newSet = facets.slice(startIndex,spliceIndex);

  		visibleFacets.push.apply(visibleFacets, newSet);	
	   	this.setState({
	   		visibleFacets: visibleFacets,
	   		startIndex: startIndex + this.state.filterCount,
			hasMoreRecords: facets.length > visibleFacets.length
	   	});
	}
  }
  componentWillReceiveProps (props) {
  		let facets = props.selectedFacet.value;
  		if(facets && facets.length > 0){
			let visibleFacets = facets.length > this.state.filterCount ? facets.slice(0,this.state.filterCount) : facets;
			let currentFacet = this.state.facets;
			this.setState({
				facets: props.selectedFacet,
				visibleFacets: visibleFacets,
				startIndex: visibleFacets.length,
				hasMoreRecords: facets.length > visibleFacets.length
			},()=>{
				// if(currentFacet.title !== props.selectedFacet.title )
				// 	this.refs['Listview'].scrollResponderScrollTo(0,0);
			});
		}
	}

  renderRow(
	facet: Object,
	sectionID: number | string,
	rowID: number | string,
	highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,) {
  	return (
		<FilterItem facet={facet} 
			isChecked = {this.isFilterApplied(facet,this.props.selectedFacet)} key = {facet.title} 
			onChange={(facet)=>{ this.props.filterItemChange (facet, this.props.selectedFacet) }}  />
	);
  }
  render() {
		 let selectedFacet = this.state.visibleFacets;
		 
		 if(selectedFacet){

			 let dataSource = this.state.dataSource.cloneWithRows(selectedFacet);
			 return (<View style={styles.container}>
						 {/* <ScrollView
						  automaticallyAdjustContentInsets={false}
						  style={styles.scrollView}>
								{selectedFacet.value.map(facet =>
									<FilterItem facet={facet} isChecked = {this.isFilterApplied(facet,selectedFacet)} key = {facet.title} onChange={(facet)=>{ this.props.filterItemChange (facet, selectedFacet) }}  />
								 )}
						</ScrollView> */}
						<ListView
							  ref={"Listview"}
							  pageSize={this.state.filterCount}
							  dataSource={dataSource}
							  renderRow={this.renderRow.bind(this)}
							  onEndReached={this.onEndReached.bind(this)}
							  automaticallyAdjustContentInsets={false}
							  keyboardDismissMode="on-drag"
							  keyboardShouldPersistTaps={true}
							  showsVerticalScrollIndicator={false} />
					</View> );
			} else{
				return (<View style={styles.container}/>);
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

