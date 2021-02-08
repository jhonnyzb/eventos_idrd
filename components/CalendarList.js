import React, {Component, PureComponent} from 'react'
import {View, ScrollView, FlatList, Text} from 'react-native'
import moment from 'moment'
import EStyleSheet from 'react-native-extended-stylesheet'
import Evento from './Evento'
import Nothing from './Nothing'
import { view } from '../styles/'
import { like, getDistance } from '../util/'

const styles = EStyleSheet.create({
	...view
})

export default class CalendarList extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			eventos: [],
			filter: ''
		}
	}

	componentDidMount() {
		const {fecha} = this.props;

		const eventos = this.props.eventos.filter(evento => {
			const fecha_inicio = evento.fecha;
			const fecha_fin = evento.fecha_fin ? evento.fecha_fin : evento.fecha;

			return moment(fecha).isSame(fecha_inicio, 'day') || moment(fecha).isBetween(fecha_inicio, fecha_fin, null, '(]');
		})

		this.setState({
			eventos: eventos
		})
	}

	render() {
		const {navigation, filter, location, locationPermission} = this.props;
		let eventos;
		let eventosGeo;

		if (filter.length > 0) {
			eventos = this.state.eventos.filter(evento => {
				return like(evento, ['nombre', 'lugar', 'resumen', 'localidad'], filter);
			});
		} else {
			eventos = this.state.eventos;
		}

		if (locationPermission === 'authorized' && location)
		{
			eventosGeo = eventos.map((e) => {
				let distancia = e.ubicacion ?
					getDistance(
						parseFloat(e.ubicacion.lat), 
						parseFloat(e.ubicacion.lon), 
						parseFloat(location.coords.latitude),
						parseFloat(location.coords.longitude)
					) : -1;
				
				e.distance = distancia;
				return e;
			});
		} else {
			eventosGeo = eventos.map((e) => {
				e.distance = -1;
				return e;
			});
		}

		return (
			<View style={[styles.content, {marginTop: -15}]}>
				<ScrollView>
				{
					eventosGeo.length > 0 ?
	    			<FlatList
						style={styles.content_list}
						data={ eventosGeo }
						renderItem={
							({item, index}) => {
								return (
									<Evento
										evento={item}
										index={index}
										withDate={true}
										tipo={'lista'}
										onPress={() => {
											navigation.navigate('ModalEventos', {
											  evento: item
											})
										}}
									/>
								)
							}
						}
						keyExtractor={(item, index) => index.toString()}
					/>
	    			:
	    			<Nothing label="Consulte más eventos en www.idrd.gov.co"/>
				}
				</ScrollView>
			</View>
		)
	}
}
