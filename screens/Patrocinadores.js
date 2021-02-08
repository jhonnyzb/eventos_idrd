import React, {Component} from 'react'
import { Text, View, ScrollView, Image, Linking, TouchableOpacity } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { SafeAreaView, NavigationEvents } from 'react-navigation'
import classNames from 'classnames'
import Header from '../components/Header'
import { view } from '../styles/'

const styles = EStyleSheet.create({
	...view,
	image: {
		width: 100,
		resizeMode: "contain"
	},
	row: {
	    flex: 1,
	    flexDirection: 'row',
	    justifyContent: 'space-around'
	}
})

export default class Patrocinadores extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<SafeAreaView style={styles.content}>
				<View style={{flex: 1}}>
					<Header
						title={"Patrocinadores:"}
						withSearch={false}
						onSearch={() => {}}
					/>
        			<View style={{flex: 1}}>
						<ScrollView>
							<View style={styles.row}>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://www.mundoaventura.com.co/web2018/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/aventura.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://california.com.co/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/california.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://lakalle.bluradio.com/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/calle.jpg')}
			                      />
			                    </TouchableOpacity>
							</View>

							<View style={styles.row}>
								<TouchableOpacity
			                      onPress={() => { }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/food.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://www.dimonex.co/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/dimonex.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://www.efecty.com.co/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/efecty.jpg')}
			                      />
			                    </TouchableOpacity>
							</View>

							<View style={styles.row}>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://www.caracoltv.com/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/caracol.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://www.gatorade.com.co/app/website/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/gatorade.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://www.loteriadebogota.com/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/loteria.jpg')}
			                      />
			                    </TouchableOpacity>
							</View>

							<View style={styles.row}>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("http://olimpicastereo.com.co/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/olimpica.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/plazas.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://hechoconamor.elpomar.com.co/lp869/landing-lacteos-pomar/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/pomar.jpg')}
			                      />
			                    </TouchableOpacity>
							</View>

							<View style={styles.row}>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://www.ramo.com.co/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/ramo.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://www.smartfit.com.co/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/smart.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("https://www.casaluker.com/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/sol.jpg')}
			                      />
			                    </TouchableOpacity>
							</View>

							<View style={styles.row}>
								<TouchableOpacity
			                      onPress={() => { Linking.openURL("http://www.superricas.com/") }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/sricas.jpg')}
			                      />
			                    </TouchableOpacity>
								<TouchableOpacity
			                      onPress={() => { }}>
			                      <Image
			                      	style={styles.image}
			                        source={require('../assets/truck.jpg')}
			                      />
			                    </TouchableOpacity>
							</View>
						</ScrollView>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}
