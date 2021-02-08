import React, {Component} from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { SafeAreaView, NavigationEvents } from 'react-navigation'
import Header from '../components/Header'
import EventsList from '../components/EventsList'
import { view } from '../styles/'
import {AppContext} from '../contexts/app-context'

const styles = EStyleSheet.create({
	...view
})

export default class Events extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filter: ''
		}
	}

	onSearch = (key) => {
		this.setState({
			filter: key
		});
	}

	render() {
	return(
		<AppContext.Consumer>
			{({categorias, eventos, locationPermission, location, appDetailsSettings, checkPermissions, loading}) => {
			const e = eventos.length ? eventos : [];

				return (
				<SafeAreaView style={styles.content}>
					<NavigationEvents
					onDidFocus={payload => checkPermissions()}
					/>
					<View style={{flex: 1}}>
					<Header
						title={"Más eventos"}
						withSearch={true}
						onSearch={this.onSearch}
					/>
					{ loading ? 
						(
						<View style={styles.centerAll}>
							<ActivityIndicator size="large" color="#009FE3" />
							<Text style={styles.centerText}>
							{'\n'}
							Estamos descargando la información, no debería tardar mucho.
							</Text>
						</View>
						) : (
						<EventsList
							{...this.props}
							eventos={e}
							filter={this.state.filter}
							location={location}
							locationPermission={locationPermission}
						/>
						)
					}
					</View>
				</SafeAreaView>
				)
			}}
		</AppContext.Consumer>
		)
	}
}
