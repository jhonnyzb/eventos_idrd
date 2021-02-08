import React, { Component, PureComponent } from 'react'
import { View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import moment from 'moment'
import EStyleSheet from 'react-native-extended-stylesheet'
import Evento from './Evento'
import Nothing from './Nothing'
import { view } from '../styles/'
import { like, getDistance } from '../util/'
import { Viewport } from '@skele/components'
import Carousel from 'react-native-snap-carousel'

export default class DestacadosList extends PureComponent {

	constructor(props) {
		super(props)

		this.state = {
			to_render: [],
			filter: ''
		}
	}

	onEnter = () => {}

	onLeave = () => {}

	renderItem = ({item, index}) => {
		const { navigation } = this.props;
		let evento = (<Evento
				evento={item}
				index={index}
				tipo={'carousel'}
				withDate={true}
				onPress={() => navigation.navigate('ModalEventos', {
					evento: item
				})}
			/>);
		
		return evento;
	}

    render() {
    	return (
			<Carousel
				data={this.props.eventos}
				renderItem={this.renderItem}
				sliderWidth={this.props.width}
				itemWidth={this.props.width}
				autoplay={true}
				loop={false}
				removeClippedSubviews={false}
				layout={'tinder'}
			/>
		)
    }
}
