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


var ProductCell = React.createClass({
  getTextFromScore: function(score: number): string {
    return score > 0 ? score + '%' : 'N/A';
  },
  getImageSource: function(product: Object): {uri: ?string} {
    var uri = product && product.media && product.media.images ? product.media.images[0].url : null;
    if (uri) {
        uri = uri.replace("{@width}", "200");
        uri = uri.replace("{@height}", "200");
        uri = uri.replace("{@quality}", "80");
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

  render: function() {
   // var criticsScore = this.props.movie.ratings.critics_score;
   let product  =this.props.product;
   let sellingPrice = this.getSellingPrice(product);
   let finalPrice = this.getFinalPrice(product);
   let dicount = this.getFinalDiscount(product);
   let isProductAvailable = this.isProductAvailable(product);
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View>
        <TouchableElement
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <Image
              source={this.getImageSource(product)}
              style={styles.cellImage}
              resizeMode={Image.resizeMode.contain}
            />
            <View style={styles.textContainer}>
              <View >
                <Text style={styles.productTitle} numberOfLines={2}>
                  {product.titles.title}
                </Text>
              </View>
              {product.titles.subtitle  ?
                  <View>
                      <Text style={styles.subTitle}   numberOfLines={1}>
                        {product.titles.subtitle}
                      </Text>
                  </View>
                 : null
              }
              {isProductAvailable ? 
                  <View style={{flex:1,flexDirection:'column'}}>
                    <View style={{flex:1,flexDirection:'row'}}>
                    
                        <Text style={styles.productPrize}   numberOfLines={1}>
                          {finalPrice}
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
                                <Text>{tag} </Text>
                            </View>
                          )}
                       </View>
                       : null
                      }
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
  productTitle: {
    flex: 1,
    fontSize: 14,
    //fontWeight: 'bold',
    fontFamily: 'RobotoBold',
    marginBottom: 5
  },
  productPrize: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'RobotoBold',
    marginBottom: 5
  },
  availabilityMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'RobotoBold',
    marginBottom: 5
  },
  negative: {
    color:'red'
  },
  positive: {
    color:'green'
  },
  subTitle: {
    //color: '#333333',
    //fontFamily: 'Roboto',
    marginBottom:5,
    fontSize: 12,
  },
  specialPrice: {
    color: '#333333',
    fontFamily: 'Roboto',
    marginLeft:10,
    fontSize:18,
    textDecorationLine: 'line-through'

  },
  tags:{
    flex:1,
    padding:5,
    marginRight:5,
    borderColor: '#E4E4E4',
    borderWidth: 1
  },

  totalDiscount: {
    fontFamily: 'Roboto',
    
    marginLeft:20,
    fontSize:14,
    color:'green'
  },
  row: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems:'flex-start',
    padding: 14,
    height: 130

  },
  cellImage: {
    backgroundColor: 'transparent',
    height: 80,
    marginRight: 10,
    marginTop: 10,
    marginLeft: 10,
    width: 50,
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
