import React, {PureComponent} from 'react'
import moment from 'moment'
import { View, TouchableOpacity, ImageBackground, Image, Text } from 'react-native'
import imageCacheHoc from 'react-native-image-cache-hoc'
import * as Animatable from 'react-native-animatable'
import EStyleSheet from 'react-native-extended-stylesheet'
import ErrorBoundary from './ErrorBoundary'
import Date from './Date'

const styles = EStyleSheet.create({
	radius: {
		borderRadius:50
	},
	itemContainer: {
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		marginTop: 5
	},
	backgroundImage: {
		flex: 1
	},
	background: {
		flex: 1,
		position: 'absolute',
		top: 0,
		left: 10,
		width: '100%',
		height: '100%',
		zIndex: -1
	},
	itemDataContainer: {
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 10,
		backgroundColor: 'rgba(255,255,255, .90)',
		borderWidth: 0.5,
		borderColor: '#EEE'
	},
	itemCercano: {
		width: 200,
		backgroundColor: '#5b3d90',
		color: '#ffffff',
		fontSize: 13,
		paddingLeft: 4,
		paddingRight: 4,
		paddingTop: 2,
		paddingBottom: 2,
		marginLeft: -10,
		marginBottom: -1,
		borderTopRightRadius: 4
	},
	itemTitle: {
		flex: 1,
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000',
		paddingTop: 10,
		paddingRight: 45
	},
	itemDescription: {
		flex: 1,
		fontSize: 13,
		color: '#333'
	},
	itemDirection: {
		flex: 1,
		fontSize: 13,
		color: '#666'
	},
	importantContainer: {
		width: '100%', 
		flexDirection:'row', 
		justifyContent: 'flex-start',
		padding: 10
	},
	importantImageContainer: {
		flexDirection: 'row',
		height: 180,
		paddingLeft: 10,
		paddingRight: 10
	},
	importantTitle: {
		flex: 1,
		fontSize: 18,
		marginTop: 0,
		fontWeight: 'bold',
		color: '#333'
	},
	importantDescription: {
		flex: 1,
		fontSize: 14,
		color: '#333',
		marginTop: -20
	},
	activityIndicatorStyle: {
		flex: 1,
		height: 80,
		backgroundColor: '#dc143c'
	}
});

const CacheableImage = imageCacheHoc(Image, {
	fileHostWhitelist: ['idrd.gov.co', 'www.idrd.gov.co']
});

class Evento extends PureComponent {

	constructor(props) {
		super(props);
		this.state = { hasError: false };
		moment.updateLocale('en', {
			monthsShort : [
			"Ene", "Feb", "Mar", "Abr", "May", "Jun",
			"Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
			]
		});
	}

	renderEvento = () => {
		const {index, evento, onPress, withDate, tipo} = this.props;
		let view = null;
		let cercano = false;
		if (evento.distance && evento.distance !== -1)
		{
			if (evento.distance <= 5.0) 
			{
				cercano = true;
			}
		}

		switch (tipo) {
			case 'lista':
			view = (
					<ErrorBoundary>
						<View style={styles.radius}>
							<TouchableOpacity
								style={[styles.itemContainer, cercano ? styles.itemContainerCercano : {}]}
								onPress={() => onPress()}
								activeOpacity={0.85}
							>
								<CacheableImage style={styles.background} source={{uri: evento.imagen}} permanent={true} />
								<View style={[styles.itemDataContainer]}>
									<View>
										<Text
											numberOfLines={1}
											style={ styles.itemTitle }>
											{evento.nombre}
										</Text>
									</View>
									<View style={{marginTop: 10}}>
										<Text
											numberOfLines={1}
											style={ styles.itemDirection }>
											{ 
												('localidad' in evento && evento.localidad ? evento.localidad+' - ' : '') + evento.lugar
											}
										</Text>
									</View>
									<View style={{marginTop: 10}}>
										<Text
											numberOfLines={2}
											style={ styles.itemDescription }>
											{ 
												evento.resumen 
											}
										</Text>
									</View>
									<View style={{marginTop: 10}}>
										{ cercano ? 
											<Text
												numberO	fLines={1}
												style={ styles.itemCercano }
											>
												A ({evento.distance.toFixed(2)} Km) de tu ubicación
											</Text> : null
										}
									</View>
								</View>
							{ withDate ?
								<Date fecha_inicio={evento.fecha} fecha_fin={evento.fecha_fin ? evento.fecha_fin : evento.fecha}/> : null
							}
							</TouchableOpacity>
						</View>
					</ErrorBoundary>
				)
			break;
			case 'carousel':
			view = (
				<ErrorBoundary>
					<View style={{flex: 1, backgroundColor:'#dcd7ec', justifyContent: 'center', alignItems: "center"}}>
						<TouchableOpacity
							onPress={() => onPress()}
							activeOpacity={0.85}
						>
							<View style={styles.importantImageContainer}>
								<CacheableImage style={styles.backgroundImage} source={{uri: evento.imagen}} permanent={true} />
								{withDate ?
									<Date fecha_inicio={evento.fecha} fecha_fin={evento.fecha_fin ? evento.fecha_fin : evento.fecha}/> : null
								}
							</View>
							<View style={styles.importantContainer}>
								<Text
									numberOfLines={1}
									style={styles.importantTitle}>
									{evento.nombre}
								</Text>
							</View>
							<View style={styles.importantContainer}>
								<Text
									numberOfLines={10}
									style={ styles.importantDescription }>
									{ 
										'\n'+('localidad' in evento && evento.localidad ? evento.localidad+' - ' : '')+evento.lugar+'\n\n'+evento.resumen 
									}
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</ErrorBoundary>
				)
			break;
			default:
			view = (
				<View style={styles.radius}>
					<TouchableOpacity
						style={ styles.importantContainer }
						onPress={() => onPress()}
						activeOpacity={0.85}
					>
						<View style={styles.importantImageContainer}>
						</View>
						<View style={styles.importantTitleContainer}>
							<Text
								numberOfLines={1}
								style={styles.importantTitle}>
								{evento.nombre}
							</Text>
						</View>
					{withDate ?
						<Date fecha_inicio={evento.fecha} fecha_fin={evento.fecha_fin ? evento.fecha_fin : evento.fecha}/> : null
					}
					</TouchableOpacity>
				</View>
				)
		}
		return view;
	}

	render() {
		return this.renderEvento();
	}
}

export default Evento;
