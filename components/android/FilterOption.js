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
	Platform,
	StyleSheet,
	TouchableHighlight,
	TouchableNativeFeedback,
	View,
	Text,
	Picker
} = React;

export default class FilterOption extends React.Component{
	render() {
		let appliedFilters = this.props.appliedFilters;
		let appliedFilterLength = Object.keys(appliedFilters).length;
		return (
			<TouchableNativeFeedback
				onPress={this.props.onClick}
				background={TouchableNativeFeedback.SelectableBackground()}>
				{appliedFilterLength >0 ?
					<View style={styles.filter}>
						<View><Text style={styles.appliedFilterText}>Filter</Text></View>
						<View style={{flexDirection:'row'}}>
							{Object.keys(appliedFilters).map((filter, index) => {
									return <Text style={styles.appliedFacetText} key={"ApliedFilter_" + filter}>  {filter} {index+1 !== appliedFilterLength ? ',' : '' }</Text>;
								})
							}
						</View>
					</View>
					: 
					<View style={styles.filter}>
						<Text style={styles.filterText}>Filter</Text>
					</View>

				}
			  
			</TouchableNativeFeedback>
		);
	}
};

var styles = StyleSheet.create({
 filter:{
	flex:0.5,
	alignItems: 'center',
	justifyContent: 'center',
	borderColor: '#E4E4E4',
	borderRightWidth: 1,
	borderStyle:'dashed',
	padding:10
  },
  appliedFilter:{
	flex:0.5,
	alignItems: 'center',
	borderColor: '#E4E4E4',
	borderRightWidth: 1,
	borderStyle:'dashed',
	padding:5
  },
  appliedFilterText:{
	fontSize:16,
	color:'#565656'
  },
  appliedFacetText:{
	fontSize:12,
	color:'#565656'
  },
  filterText:{
	fontSize:18,
	color:'#565656'
  },
});
FilterOption.propTypes = {
		appliedFilters: React.PropTypes.object,
		onClick: React.PropTypes.func
};

module.exports = FilterOption;
