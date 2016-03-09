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
	Picker
} = React;
import ReactComponentWithStore from 'react-native-shared/components/common/ReactComponentWithStore.js';

export default class SortOptions extends ReactComponentWithStore{

	constructor(args){
			super(args);
			this.state = {
				sortby:'popularity'
			}
	}
	sortOptionChange(value){
		this.setState({sortby: value});
		this.props.onSortOptionChange(value);
	}
	render() {
		return (
			 <View style={styles.sortBy}>
					<Picker
						selectedValue={this.state.sortby}
						onValueChange={this.sortOptionChange.bind(this)} style={styles.picker}>
							 {this.props.sortOptions.map(sortOption =>
								<Picker.Item key= {sortOption.title} label={sortOption.title} style= {styles.pickerItem} value={sortOption.resource.params} />
							 )}  
					</Picker>
				</View>
		 
		);
	}
};

var styles = StyleSheet.create({
 picker:{
		alignItems: 'center',
		width: 200,
		marginLeft:10,
		marginRight:20
	},
	sortBy:{
		flexDirection: 'row',
		flex:0.5,
		width:300
	},
	pickerItem:{
		color:'red'
	}
});
SortOptions.propTypes = {
		sortOptions: React.PropTypes.array,
		onSortOptionChange: React.PropTypes.func
};

module.exports = SortOptions;
