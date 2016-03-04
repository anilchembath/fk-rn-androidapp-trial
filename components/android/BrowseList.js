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
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  Image,
  Picker
} = React;
import {Actions, ActionCreator} from '../../actions';
var invariant = require('invariant');
var dismissKeyboard = require('dismissKeyboard');

var ProductCell = require('./ProductCell');
var SortOptions = require('./SortOptions');
var ServiceResponse = require('./ServiceResponse');
var DataSource = require('./DataSource');

var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/';
var API_KEYS = [
  '7waqfqbprs7pajbz28mqf6vz',
  // 'y4vwv8m33hed9ety83jmv52f', Fallback api_key
];


import ReactComponentWithStore from 'react-native-shared/components/common/ReactComponentWithStore.js';


export default class BrowseList extends ReactComponentWithStore{
  constructor(args){
	  super(args);
	  this.state = {
		isLoading: true,
		isLoadingTail: false,
		dataSource: new ListView.DataSource({
		  rowHasChanged: (row1, row2) => row1 !== row2,
		  getRowData: (dataBlob, sectionID, rowID) => {
			  return dataBlob[sectionID][rowID];
		  }

		}),
		startIndex: 0,
		product_count: 10,
		products : [],
		hasMoreRecords: true,
		sortby:'popularity',
		sortOptions:'&sort=price_desc'

	  }
  }
  componentWillMount(){
	this._bindActionCreator(ActionCreator);
	this.subscribeToStore(this._getStore());
  }

  async componentDidMount() {
	let actionCreator = this.getActionCreator()
	actionCreator.getProducts(this.state.startIndex,this.state.product_count, this.state.sortOptions );
  }
  getSortOptions(search){
	return search && search.sortOptions ? search.sortOptions : []
  }
  subscribeToStore(store){
	  store.subscribe(()=>{
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
			  this.setState({
				products: products,
				search:newState.data.search,
				isLoading: false,
				startIndex: startIndex,
				hasMoreRecords: productCount == this.state.product_count
			  });
			  //console.log("products" + products, "hasMoreRecords  ", productCount == this.state.product_count)
		  }
	  });
  }
  getDummyProducts(){
	return ServiceResponse.default.RESPONSE.product;
  }

  onEndReached() {
  	if(this.state.hasMoreRecords){
	   let actionCreator = this.getActionCreator()
		actionCreator.getProducts(this.state.startIndex,this.state.product_count,this.state.sortOptions);
	}
  }

  getDataSource(products: Array<any>): ListView.DataSource {
	return this.state.dataSource.cloneWithRows(products);
  }

  renderFooter() {
	if (!this.hasMore() || !this.state.isLoadingTail) {
	  return <View style={styles.scrollSpinner} />;
	}
	  return (
		<View  style={{alignItems: 'center'}}>
		  <ProgressBarAndroid styleAttr="Large"/>
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
  onSortOptionChange(value){
	 this.setState({
		startIndex:0,
		sortOptions:'&' + value
	   },()=> {
		  let actionCreator = this.getActionCreator();
		  actionCreator.getProducts(this.state.startIndex,this.state.product_count,this.state.sortOptions);
		}
	 );
  }
  render() {

	 var content = "";

	 if(this.state.isLoading && this.state.products.length === 0){
		content =  <View  style={[styles.container, styles.loader]}>
			<ProgressBarAndroid styleAttr="Large"/>
		</View>
	 } else {
	   content = <ListView
		  ref="listview"
		  renderSeparator={this.renderSeparator.bind(this)}
		  dataSource={this.getDataSource(this.state.products)}
		  renderRow={this.renderRow.bind(this)}
		  onEndReached={this.onEndReached.bind(this)}
		  automaticallyAdjustContentInsets={false}
		  keyboardDismissMode="on-drag"
		  keyboardShouldPersistTaps={true}
		  showsVerticalScrollIndicator={false} />;
	 }

	return (
	  <View style={styles.container}>
		<View style={styles.filterBar}>
		  <View style={styles.filter}>
			<Text style={styles.filterText}>Filter</Text>
		  </View>
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
	var text = '';
	if (this.props.filter) {
	  text = `No results for "${this.props.filter}"`;
	} else if (!this.props.isLoading) {
	  // If we're looking at the latest movies, aren't currently loading, and
	  // still have no results, show a message
	  text = 'No products found';
	}

	return (
	  <View style={[styles.container, styles.centerText]}>
		<Text style={styles.noProducts}>{text}</Text>
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

