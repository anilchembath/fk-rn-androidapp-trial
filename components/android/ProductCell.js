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
     console.log(product);
      let prices= product.pricing.prices;
       console.log(prices);
        for (var price in prices) {
         if(price.name === "Selling Price"){
           console.log(price.value);
            return price.value;
         }
       }
       return "";
  },
  render: function() {
   // var criticsScore = this.props.movie.ratings.critics_score;
   let product  =this.props.product;
   let sellingPrice = this.getSellingPrice(product);
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
              * omit a property or set it to undefined if it's inside a shape,
              * even if it isn't required */}
            <Image
              source={this.getImageSource(product)}
              style={styles.cellImage}
              xresizeMode={Image.resizeMode.contain}
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
              <View>
                <View style={{flex:1,flexDirection:'row'}}>
                  <Text style={styles.productTitle}   numberOfLines={1}>
                    {product.pricing.finalPrice.value}
                  </Text>
                  {/* sellingPrice &&  sellingPrice > product.pricing.finalPrice.value ?
                      <Text style={styles.specialPrice}   numberOfLines={1}>
                          {sellingPrice}
                      </Text>
                     : null
                   */}
                   {product.pricing.totalDiscount &&  product.pricing.totalDiscount>0 ?
                      <Text style={styles.totalDiscount}   numberOfLines={1}>
                          {product.pricing.totalDiscount} %
                      </Text>
                     : null
                   }

                </View>
              </View>
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
    paddingLeft: 20,
    paddingTop: 10
  },
  productTitle: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'RobotoBold',
    marginBottom: 5
  },
  subTitle: {
    color: '#333333',
    fontFamily: 'Roboto',
    marginBottom:10,
    fontSize: 22,
  },
  specialPrice: {
    color: '#333333',
    fontFamily: 'Roboto',
    marginBottom:5,
    marginLeft:20,
    fontSize:30,
    textDecorationLine: 'line-through'

  },
  totalDiscount: {
    color: '#333333',
    fontFamily: 'Roboto',
    marginBottom:5,
    marginLeft:20,
    fontSize:30

  },
  row: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems:'flex-start',
    padding: 20,
    height: 250

  },
  cellImage: {
    backgroundColor: 'transparent',
    height: 200,
    marginRight: 30,
    marginLeft: 20,
    width: 100,
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
