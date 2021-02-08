import React, { Component, PureComponent } from 'react'
import { View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import moment from 'moment'
import EStyleSheet from 'react-native-extended-stylesheet'
import Permissions from 'react-native-permissions'
import Evento from './Evento'
import Nothing from './Nothing'
import { view } from '../styles/'
import { like, getDistance } from '../util/'
import { Viewport } from '@skele/components'

const styles = EStyleSheet.create({
	...view,
	loadMore: {
		flex: 1,
		height: 10,
		padding: 10,
		justifyContent: 'center'
	}
})

const ViewportAwareTouchable= Viewport.Aware(TouchableOpacity)

const pageSize = 20;

export default class EventsList extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			eventos: [],
			to_render: [],
			filter: ''
		}
	}

	componentDidMount() {
		
		const eventos = this.props.eventos.filter(evento => {

    			const fecha_inicio = evento.fecha;
    			const fecha_fin = evento.fecha_fin ? evento.fecha_fin : evento.fecha;
    			
    			//si es la vista de favoritos no filtrar por fecha
    			if (this.props.soloFavoritos)
    			{
    				return moment(fecha_inicio).isSameOrAfter(moment(), 'day') || ( 
						moment().isBetween(fecha_inicio, fecha_fin)
					);
    			} else {
    				return (
	    				moment(fecha_inicio).isSameOrAfter(moment(), 'day') &&
						moment(fecha_inicio).isBefore(moment().add(6, 'days'), 'day')
					) || ( 
						moment().isBetween(fecha_inicio, fecha_fin)
					);
    			}
			}
		)

		this.setState({
			eventos: eventos,
			to_render: eventos.slice(0, pageSize)
		});
	}

	cargarMas = (status) => {
		let from = this.state.to_render.length;
		let to = (this.state.to_render.length + pageSize) < this.state.eventos.length ? (this.state.to_render.length + pageSize) : this.state.eventos.length;
		this.setState({to_render: [...this.state.to_render, ...this.state.eventos.slice(from, to)]});
	}

	render() {
		const {navigation, filter, favoritos, soloFavoritos, location, locationPermission} = this.props;
		let eventos;
		let deFavoritos;
		let eventosFinales;
		let eventosGeo;

		if (filter.length > 0) {
			eventos = this.state.eventos.filter(evento => {
				return like(evento, ['nombre', 'lugar', 'resumen', 'localidad'], filter);
			});
		} else {
			eventos = this.state.to_render;
		}

		if(soloFavoritos) {
			let favoritosInt = favoritos.split(',');

			deFavoritos = eventos.filter(evento => {
				return favoritosInt.indexOf(evento._id) > -1
			})
		}

		eventosFinales = soloFavoritos ? deFavoritos : eventos;

		eventosFinales.sort((a, b) => {
			let comp = 0;

			if (moment(a.fecha).isBefore(moment(b.fecha), 'day'))
				comp = -1;

			if (moment(a.fecha).isAfter(moment(b.fecha), 'day'))
				comp = 1;

			return comp;
		});

		if (locationPermission === 'authorized' && location)
		{
			eventosGeo = eventosFinales.map((e) => {
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
			eventosGeo = eventosFinales.map((e) => {
				e.distance = -1;
				return e;
			});
		}
		console.log('ef', eventosFinales)
		eventosGeo = filter.length > 0 ? eventosGeo : [...eventosGeo, { loadMore: true }] 
		console.log('eg', eventosGeo)
		return (
			<View style={[styles.content, {marginTop: -15}]}>
				<Viewport.Tracker>
					<ScrollView scrollEventThrottle={10}>
					{
						eventosGeo.length > 0 && eventosFinales > 0 ?
						<FlatList
							style={styles.content_list}
							data={ eventosGeo }
							renderItem={
								({item, index}) => {
									if(item.loadMore) {
										return (
											<ViewportAwareTouchable style={styles.loadMore} onViewportEnter={this.cargarMas} />
										)
									}

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
				</Viewport.Tracker>
			</View>
		)
	}
}
