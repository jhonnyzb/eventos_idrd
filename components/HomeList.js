import React, { Component, PureComponent } from 'react'
import { View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import moment from 'moment'
import EStyleSheet from 'react-native-extended-stylesheet'
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

export default class HomeList extends PureComponent {

	constructor(props) {
		super(props)

		this.state = {
			to_render: [],
			filter: ''
		}
	}

	onEnter = () => {}

	onLeave = () => {}

	componentDidMount = () => {
		this.setState({to_render: this.props.eventos.slice(0, pageSize)});
	}

	cargarMas = (status) => {
		let from = this.state.to_render.length;
		let to = (this.state.to_render.length + pageSize) < this.props.eventos.length ? (this.state.to_render.length + pageSize) : this.props.eventos.length;
		this.setState({to_render: [...this.state.to_render, ...this.props.eventos.slice(from, to)]});
	}

    render() {
    	const {navigation, filter, location, locationPermission} = this.props;
    	let eventos;
    	let eventosGeo;

    	if (filter.length > 0) {
    		eventos = this.props.eventos.filter(evento => {
    			return like(evento, ['nombre', 'lugar', 'resumen'], filter);
    		});
    	} else {
    		eventos = this.state.to_render;
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

		eventosGeo.sort((a, b) => {
			let comp = 0;

			if (moment(a.fecha).isBefore(moment(b.fecha), 'day'))
				comp = -1;

			if (moment(a.fecha).isAfter(moment(b.fecha), 'day'))
				comp = 1;

			return comp;
		});

		eventosGeo = filter.length > 0 ? eventosGeo : [...eventosGeo, { loadMore: true }] 

    	return (
    		<View style={[styles.content, {marginTop: 0}]}>
				<Viewport.Tracker>
					<ScrollView scrollEventThrottle={10}>
					{
						eventosGeo.length > 0 && !eventosGeo[0]['loadMore'] ?
						<FlatList
							style={ styles.content_list }
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
