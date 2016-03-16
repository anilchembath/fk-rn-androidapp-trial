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
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} = React;

var NavigationModule = require('../../nativemodules/Navigation');
var ProductCell = React.createClass({
  getTextFromScore: function(score: number): string {
	return score > 0 ? score + '%' : 'N/A';
  },
  getImageSource: function(product: Object): {uri: ?string} {
	var uri = product && product.media && product.media.images ? product.media.images[0].url : null;
	if (uri) {
		uri = uri.replace("{@width}", "300");
		uri = uri.replace("{@height}", "300");
		uri = uri.replace("{@quality}", "100");
	}
	return { uri };
  },
  getSellingPrice: function(product){
	if(product && product.pricing){
	  let prices= product.pricing.prices;
		for (var price in prices) {
		 if(price.name === "Selling Price"){
			return price.value;
		 }
	   }
	}
	   return "";
  },

  getFinalDiscount: function(product){
	 return product && product.pricing ? product.pricing.totalDiscount : 0;
  },
  getFinalPrice: function(product){
	 return product && product.pricing ? product.pricing.finalPrice.value : "";
  },
  showAvailability: function(product){
	 return product.availability &&  product.availability.showMessage  ? product.availability.showMessage : "";
  },
  isProductAvailable: function(product){
	 return product.availability &&  product.availability.intent === "negative"  ? false : true;
  },
  getAvailabilityMessage: function(product){
	 return product.availability &&  product.availability.message  ? product.availability.message : "";
  },
  getAvailabilityIntent: function(product){
	 return product.availability &&  product.availability.intent  ? product.availability.intent : "";
  },
  selectProduct(){
  	let productAction= this.props.action;
  	NavigationModule.navigate(JSON.stringify(productAction));
  },
  hasOffer(product){
  	return product.flags && product.flags.enableOfferTag;
  },

  render: function() {
   // var criticsScore = this.props.movie.ratings.critics_score;
   let product  =this.props.product;
   let sellingPrice = this.getSellingPrice(product);
   let finalPrice = this.getFinalPrice(product);
   let dicount = this.getFinalDiscount(product);
   let hasOffer = this.hasOffer(product);
   let isProductAvailable = this.isProductAvailable(product);
   	var TouchableElement = TouchableHighlight;
	if (Platform.OS === 'android') {
	  TouchableElement = TouchableNativeFeedback;
	}
	return (
	  <View>
		<TouchableElement
		  onShowUnderlay={this.props.onHighlight}
		  onHideUnderlay={this.props.onUnhighlight} onPress = {this.selectProduct}>
		  <View style={isProductAvailable ? styles.row : styles.unAvailableRow}>
		  	<View>
				<Image
				  source={this.getImageSource(product)}
				  loadingIndicatorSource = {{uri:'fk_default_image'}}
				  style={styles.cellImage}
				  resizeMode={Image.resizeMode.contain}/>
					{isProductAvailable && hasOffer ? 
						<View style={styles.offer}>
							<Text style={styles.offerText}>OFFER </Text>
						</View>
						: null
					}
			</View>
			<View style={styles.textContainer}>
			  <View >
				<Text style={styles.productTitle} numberOfLines={1}>
				  {product.titles.title}
				</Text>
			  </View>
			  {product.titles.subtitle  ?
				  <View>
					  <Text numberOfLines={1}  style={styles.subTitle}>
						{product.titles.subtitle}
					  </Text>
				  </View>
				 : null
			  }
			  {isProductAvailable ? 
				  <View style={{flex:1,flexDirection:'column'}}>
					<View style={{flex:1,flexDirection:'row'}}>
					
						<Text style={styles.productPrize}   numberOfLines={1}>
						  Rs. {finalPrice}
						</Text>
						 {dicount>0 ?
							<Text style={styles.totalDiscount}   numberOfLines={1}>
								{dicount} %
							</Text>
						   : null
						 }
					  </View>
					  {product.tags ? 
					   <View style={{flex:1,flexDirection:'row'}}>
						{product.tags.map(tag =>
							<View key={tag} style={styles.tags}>
								<Text style={styles.tagText}>{tag} </Text>
							</View>
						  )}
					   </View>
					   : null
					  }
					   {product.rating  && product.rating.count>0 ? 
					  	<View style={{flex:1, flexDirection:'row'}}> 
							<View style={{height:20,overflow:'hidden',width:100,marginBottom:10, }}>
								<View style={styles.ratingContainer}><Text  style={styles.rating}>&#9733;&#9733;&#9733;&#9733;&#9733;</Text></View>
								<View style={styles.ratingContainer, {width:product.rating.average*16}} ><Text style={styles.ratingSelected}>&#9733;&#9733;&#9733;&#9733;&#9733;</Text></View>
							</View>
							<View style={{paddingTop:5}}>
								<Text style={styles.ratingText}>{product.rating.count} Ratings</Text>
							</View>
						</View>
						: null }
					
					   
				  </View>
				: <View View style={{flex:1,flexDirection:'row'}}>
					  {this.showAvailability(product) ? 
						<View style={{flex:1,flexDirection:'row'}}>
						  <Text style={[styles.availabilityMessage,styles[product.availability.intent]]}   numberOfLines={1}>
							{this.getAvailabilityMessage(product)}
						  </Text>
						</View>  
					: null }
				   </View> 
				}                
			</View>
		  </View>
		</TouchableElement>
	  </View>
	);
  }
});

var styles = StyleSheet.create({
  textContainer: {
	flex: 1,
	alignItems:'flex-start',
	paddingLeft: 20
  },
  cellImage: {
	backgroundColor: 'transparent',
	height: 120,
	marginRight: 0,
	marginLeft: 10,
	width: 70,
  },
  row: {
	backgroundColor: 'white',
	flexDirection: 'row',
	alignItems:'flex-start',
	padding: 14,
	height: 150
  },
  unAvailableRow: {
	backgroundColor: 'white',
	flexDirection: 'row',
	alignItems:'flex-start',
	padding: 14,
	height: 150
  },
  productTitle: {
	flex: 1,
	fontSize: 14,
	//fontWeight: 'bold',
	overflow:'hidden',
	fontFamily: 'sans-serif',
	marginBottom: 2,
	color:'#353535'
  },
  productPrize: {
	flex: 1,
	fontSize: 18,
	fontFamily: 'sans-serif',
	color:'#353535',
	fontWeight: 'bold',
  },
  availabilityMessage: {
	flex: 1,
	fontSize: 14,
	fontFamily: 'sans-serif',
	marginBottom: 5
  },
  negative: {
	color:'red'
  },
  positive: {
	color:'green'
  },
  subTitle: {
	fontFamily: 'sans-serif',
	color:'#353535',
	marginBottom:5,
	fontSize: 12,
  },
  specialPrice: {
	marginLeft:10,
	fontSize:18,
	fontFamily: 'sans-serif',
	color:'#353535',
	textDecorationLine: 'line-through'
  },
  tags:{
	flex:1,
	padding:2,
	marginRight:5,
	borderColor: '#E4E4E4',
	borderWidth: 1,
	marginTop:5,
	marginBottom:5,
  },
  tagText:{
	fontSize:12,
	fontFamily: 'sans-serif',
	color:'#353535',
  },
  offer:{
	flex:1,
	paddingLeft:8,
	paddingTop:3,
	paddingBottom:3,
	paddingRight:8,
	marginRight:5,
	marginLeft:7,
	marginTop:10,
	marginBottom:5,
	backgroundColor:'#70AC79',
	position:'absolute',
	left:10,
	bottom:0

  },
  offerText:{
	fontSize:12,
	color:'#ffffff',
	fontFamily: 'sans-serif',
	fontWeight: 'bold',
  },
  ratingContainer: {
	left:0,
	position:'absolute',
	height:20,
	overflow:'hidden',
  },
  rating: {
	color:'#eeeeee',
	fontSize:18
  },
  ratingText: {
  	fontFamily: 'sans-serif',
	color:'#353535',
  	fontSize: 12 
  },
  ratingSelected:{
	fontSize:18,
	color:'#FEDA00'
  },
  totalDiscount: {
	fontFamily: 'Roboto',
	marginLeft:20,
	fontSize:14,
	color:'green'
  },
  cellBorder: {
	backgroundColor: 'rgba(0, 0, 0, 0.1)',
	height: StyleSheet.hairlineWidth,
	marginLeft: 4,
  },
  noScore: {
	color: '#999999',
  }
});

module.exports = ProductCell;
