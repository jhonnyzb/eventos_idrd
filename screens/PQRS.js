import React, {Component} from 'react'
import { Text, View, ScrollView, Button, Linking, TouchableOpacity, Platform } from 'react-native'
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
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
       

    },
    titulo: {
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: '#efefef', 
        borderRadius: 5,
        padding:10
    },
    link: {
        color: "#03a9f4",
        backgroundColor: '#efefef', 
        borderRadius: 5,
        padding:10
    }
})

export default class PQRS extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<SafeAreaView style={styles.content}>
				<View style={{flex: 1}}>
					<Header
						title={"PQRDS"}
						withSearch={false}
						onSearch={() => {}}
					/>
        			<View style={{flex: 1}}>
						<ScrollView>
							<View style={styles.row}>
                                <Text style={styles.titulo}>
                                    Peticiones, Quejas, Reclamos, Denuncias y Solicitudes.{'\n'}
                                </Text>
                            </View>
							<View style={styles.row}>
                                <Text style={{backgroundColor: '#efefef', padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 5}}>
                                    Tenga en cuenta que la PQRDS debe contener datos de contacto como nombre, dirección y teléfono, de lo contrario la PQRDS será recibida como anónima y se le dará dicho tratamiento. {'\n\n'}
                                    Para conocer las respuestas a PQRDS anónimas debe dirigirse al siguiente link:{'\n'}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity
			                            onPress={() => { Linking.openURL("https://www.idrd.gov.co/respuestas-peticionarios-anonimos#overlay-context=transparencia/instrumentos-gestion-informacion-publica/informe-peticiones-quejas-reclamos-denuncias") }}>
                                        <Text style={styles.link}>
                                            https://www.idrd.gov.co/respuestas-peticionarios-anonimos#overlay-context=transparencia/instrumentos-gestion-informacion-publica/informe-peticiones-quejas-reclamos-denunciasss
                                        </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <Text>{'\n'}</Text>
                            </View>
							{Platform.OS === 'ios'
							 ? 
							 <TouchableOpacity onPress={() => Linking.openURL(`mailto:atncliente@idrd.gov.co`)} style={{...styles.row, justifyContent: "center", alignItems: 'center', backgroundColor: 'blue', marginLeft: 10, marginRight: 10, height: 40}}>
                                <Text style={{color:'#ffffff', fontWeight: 'bold'}}>CREAR PQRDS</Text>
                            </TouchableOpacity>
							:
							<View style={{...styles.row, justifyContent: "space-around"}}>
                                <Button  onPress={() => Linking.openURL(`mailto:atncliente@idrd.gov.co`)} title={"CREAR PQRDS"} />
                            </View>
							}
                            
						</ScrollView>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}
