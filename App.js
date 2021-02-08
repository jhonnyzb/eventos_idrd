import React, {Component} from 'react'
import { BackHandler, StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box"
import Navigator from './components/Navigator'
import {db, synchandler} from './database/DB'
import {AppContext} from './contexts/app-context'
import Permissions from 'react-native-permissions'
import Geolocation from '@react-native-community/geolocation'

export default class App extends Component {
	constructor(props) {
		super(props)
		this.db = db
		this.synchandler = synchandler
		this.state = {
			categorias: [],
			eventos: [],
			loading: true,
			appDetailsSettings: 0,
			locationPermission: '',
			location: null
		}
	}

	onChange = (info) => {
		this.load('categorias')
		this.load('eventos')
	}

	setupDatabase = () => {
		this.db.createIndex({
			index: {
				fields: ['_id']
			}
		}).then(function (result) {
				// handle result
		}).catch(function (err) {
			console.log(err)
		});

		this.load('categorias')
		this.load('eventos')
	}

	load = (key) => {
			this.db.find({
				selector: {
					schema: key
				}
			}).then((result) => {
				if(result.docs.length > 0) {
					this.setState({
						[key]: result.docs,
						loading: key != 'eventos'
					}, () => {console.log(key, this.state)})
				}
			})
	}

	componentWillUnmount() {
		this.synchandler.cancel();
			LocationServicesDialogBox.stopListener();
			BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
		}

	componentDidMount() {
		this.synchandler.on('change', this.onChange)
		this.synchandler.on('error', (err) => {
			console.log(err);
		});

		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

		setTimeout(() => {
		this.setupDatabase();
		SplashScreen.hide();
		}, 2000);
	}

		_findCoordinates = () => {
			Geolocation.getCurrentPosition(
				position => {
					const location = position;

					this.setState({ location });
				},
				error => console.log(error.message),
				{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
			);
	}

		handleBackPress = () => {
			LocationServicesDialogBox.forceCloseDialog();
		}

		_requestPermission = () => {
			Permissions.request('location').then(response => {
				this.setState({ locationPermission: response }, () => {
					if(response === 'authorized') this._checkPermissions();
				});
			});
		}

		_checkPermissions = () => {
			Permissions.check('location')
			.then(response => {
				if (response === 'undetermined' || response === '') {
					this._requestPermission();
				} else {
					const _this = this;
					this.setState({ locationPermission: response }, () => {
						if(this.state.locationPermission === 'authorized') {
							if (Platform.OS === 'android')
							{
								LocationServicesDialogBox.checkLocationServicesIsEnabled({
									message: "<h2>Activar la ubicación</h2>Esta aplicación desea modificar algunas configuraciones de tu teléfono para mejorar la presentación de resultados:<br/><br/>Usar GPS, Wi-Fi, y redes de datos para encontrar tu ubicación",
									ok: "SI",
									cancel: "NO",
									enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
									showDialog: true, // false => Opens the Location access page directly
									openLocationServices: true, // false => Directly catch method is called if location services are turned off
									preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
									preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
									providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
								}).then(function(success) {
									_this._findCoordinates();
								}).catch((error) => {
									console.log(error.message);
								});
							} else {
								this._findCoordinates();
							}
							/*
							DeviceEventEmitter.addListener('locationProviderStatusChange', function(status) { // only trigger when "providerListener" is enabled
								console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
							} );
							*/

						}
					});
				}
			});
		}

	render() {
		return (
			<>
				<StatusBar backgroundColor="white" barStyle="dark-content" />
				<AppContext.Provider value={
					{
						...this.state, 
						checkPermissions: () => {
							this._checkPermissions();
						}
					}
				}>
					
					<Navigator />
				</AppContext.Provider>
			</>
		);
	}
}
