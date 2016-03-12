/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  ListView,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} = React;
import {Actions, ActionCreator} from '../../actions';

var ProductCell = require('./ProductCell');
var SortOptions = require('./SortOptions');
var FilterOption = require('./FilterOption');


import ReactComponentWithStore from 'react-native-shared/components/common/ReactComponentWithStore.js';


export default class BrowseList extends ReactComponentWithStore{
  constructor(args){
	  super(args);
	  this.state = {
		isLoading: true,
		isLoadingTail: false,
		dataSource: new ListView.DataSource({
		  rowHasChanged: (row1, row2) => {
		  	return row1 !== row2
		  },
		  getRowData: (dataBlob, sectionID, rowID) => {
			  return dataBlob[sectionID][rowID];
		  }

		}),
		startIndex: 0,
		product_count: 10,
		products : [],
		hasMoreRecords: true,
		sortOptions:'',
		facetsList: [],
		appliedFilters: {}
	}
  }
  componentWillMount(){
	this._bindActionCreator(ActionCreator);
	this._getStore().subscribe(this.changeHandler.bind(this));
  }

  componentWillUnMount(){
	this._getStore().unsubscribe(this.changeHandler.bind(this));
  }

  async componentDidMount() {
	let actionCreator = this.getActionCreator();
	// var appliedFilters = {
 //  // 	 	"Resolution Type" :  { 
	// 	// 		'DVGA': "filter=facets.resolution_type%255B%255D%3DDVGA",
	// 	// 		'Full HD': "filter=facets.resolution_type%255B%255D%3DFull%2BHD"
	// 	// }, 
	// 	"Brand":{
	// 		'Acer': "filter=facets.brand%255B%255D%3DAcer"
	// 	}
 //  	 };
  	 let browseState = this._getStore().getState();
  	 let appliedFilters = browseState.appliedFilters;
  	 actionCreator.getProducts(this.state.startIndex,this.state.product_count, this.state.sortOptions ,appliedFilters);
  }

  getSortOptions(search){
  	return search && search.sortOptions ? search.sortOptions : []
  }

  changeHandler(){
  	  let store = this._getStore();
 	  let newState = store.getState();
 	  let productList = newState.data.productList;
 	  let productKeys = Object.keys(productList); 
	  let productCount = productKeys.length;
	  if(productCount> 0){
	  	  let startIndex = this.state.startIndex + productCount;
		  var products = this.state.startIndex !== 0 ? this.state.products : [] ; // handling reset scenario
		  for(let porductId in productList){
			products[porductId]  = productList[porductId];
		  }
		  let updatedState = {
			products: products,
			search:newState.data.search,
			isLoading: false,
			startIndex: startIndex,
			isLoadingTail:false,
			hasMoreRecords: productCount == this.state.product_count
		  };
		  let facetsList = newState.data.search.facetResponseList;
		  if(facetsList.length > 0) { // facets will come only in the first request
		  		updatedState["facetsList"] =  facetsList 
		  }
		  this.setState(updatedState);
	  }else {
	  		this.setState({
	  			isLoading: false
	  		});	
	  }
  }
  onSortOptionChange(value){
	 this.setState({
		startIndex:0,
		sortOptions:'&' + value,
		products: [],
		sorting: true,
		isLoading: true,
	   },()=> {
		  let actionCreator = this.getActionCreator();
		  actionCreator.getProducts(this.state.startIndex,this.state.product_count,this.state.sortOptions);
		}
	 );
  }
  getDummyProducts(){
	return ServiceResponse.default.RESPONSE.product;
  }

  onEndReached() {
  	if(this.state.hasMoreRecords){
	   let actionCreator = this.getActionCreator()
	   this.setState({
	   	isLoadingTail: true
	   })
		actionCreator.getProducts(this.state.startIndex,this.state.product_count,this.state.sortOptions);
	}
  }

  getDataSource(products: Array<any>): ListView.DataSource {
	return this.state.dataSource.cloneWithRows(products);
  }

  renderFooter() {
	if (!this.state.hasMoreRecords || !this.state.isLoadingTail) {
	  return <View style={styles.scrollSpinner} />;
	}
	  return (
		<View  style={{alignItems: 'center'}}>
		  <ProgressBarAndroid styleAttr="Small"/>
		</View>
	  );
  }

  renderSeparator(
	sectionID: number | string,
	rowID: number | string,
	adjacentRowHighlighted: boolean
  ) {
	var style = styles.rowSeparator;
	if (adjacentRowHighlighted) {
		style = [style, styles.rowSeparatorHide];
	}
	return (
	  <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
	);
  }

  renderRow(
	product: Object,
	sectionID: number | string,
	rowID: number | string,
	highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,) {
	let productData = product.value;
	return (
	  <ProductCell
		key={productData.id}
		
		onHighlight={() => highlightRowFunc(sectionID, rowID)}
		onUnhighlight={() => highlightRowFunc(null, null)}
		product={productData} />
	);
  }
  selectFilter(){
  	this.props.navigator.push({
	    title: "Filter",
	    name: 'filter',
	    facets: this.state.facetsList
	  });
  }
  render() {
	 var content = "";
	 let productList = this.state.products; 
	 if(this.state.isLoading){
		content =  <View  style={[styles.container, styles.loader]}>
			<ProgressBarAndroid styleAttr="Normal"/>
		</View>
	 } else if(Object.keys(productList).length === 0){
	 	 content =  <NoProducts/>
	 } else {
	 	content = <ListView
		  ref="listview"
		  renderSeparator={this.renderSeparator.bind(this)}
		  dataSource={this.getDataSource(this.state.products)}
		  renderRow={this.renderRow.bind(this)}
		  renderFooter= {this.renderFooter.bind(this)}
		  onEndReached={this.onEndReached.bind(this)}
		  automaticallyAdjustContentInsets={false}
		  keyboardDismissMode="on-drag"
		  keyboardShouldPersistTaps={true}
		  showsVerticalScrollIndicator={false} />;
	 }

	return (
	  <View style={styles.container}>
	  	{/* this.state.sorting ? 
	  			<ProgressBarAndroid styleAttr="Horizontal"/>
	  		: null
	  	*/}
	  	<View style={styles.filterBar}>
	  		<FilterOption onClick={this.selectFilter.bind(this)} appliedFilters = {this.state.appliedFilters}/>
		 	<SortOptions sortOptions = {this.getSortOptions(this.state.search)} 
				onSortOptionChange={this.onSortOptionChange.bind(this)}/>
		</View>
		{content}
	  </View>
	);
  }
};

var NoProducts = React.createClass({
  render: function() {
	return (
	  <View style={[styles.container, styles.centerText]}>
		<Text style={styles.noProducts}>No products found</Text>
	  </View>
	);
  }
});

var styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: 'white',
	flexDirection:'column'
  },
  progresContainer:{
	flex: 1,
	alignSelf:'center',
	flexDirection:'column'
  },
  centerText: {
	alignItems: 'center',
  },
  loader: {
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'row',

  },
  noProducts: {
	marginTop: 80,
	color: '#888888',
  },
  picker:{
	alignItems: 'center',
	width: 200,
	marginLeft:10,
	marginRight:10
  },
  sortBy:{
	flexDirection: 'row',
	flex:0.5,
	width:300
  },
  filterBar:{
	backgroundColor: '#ffffff',
	height:50,
	borderBottomWidth:1,
	flexDirection: 'row',
	borderColor: '#E4E4E4',
  },
  filter:{
	flex:0.5,
	alignItems: 'center',
	justifyContent: 'center',
	borderColor: '#E4E4E4',
	borderRightWidth: 1,
	borderStyle:'dashed',
	padding:10
  },
  filterText:{
	fontSize:18,
	color:'#565656'
  },
  separator: {
	height: 1,
	backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
	marginVertical: 20,
  },
  rowSeparator: {
	backgroundColor: 'rgba(0, 0, 0, 0.1)',
	height: 1,
	marginLeft: 4,
  },
  rowSeparatorHide: {
	opacity: 0.0,
  },
});

