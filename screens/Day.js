import React, {Component} from 'react'
import {Text, View, TouchableHighlight, Dimensions} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { SafeAreaView, NavigationEvents } from 'react-navigation'
import Permissions from 'react-native-permissions'
import classNames from 'classnames'
import Evento from '../components/Evento'
import CalendarList from '../components/CalendarList'
import {db, synchandler} from '../database/DB'
import { view } from '../styles/'
import Header from '../components/Header'
import Geolocation from '@react-native-community/geolocation'

const styles = EStyleSheet.create({
    ...view
})

export default class Day extends Component {

    constructor(props) {
        super(props)
        this.state = {
            categorias: [],
            eventos: [],
            loading: true,
            filter: '',
            width: 400,
            height: 100,            
            locationPermission: '',
            location: null
        }
    }

    onSearch = (key) => {
        this.setState({
          filter: key
        });
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

    _requestPermission = () => {
        Permissions.request('location').then(response => {
            // Returns once the user has chosen to 'allow' or to 'not allow' access
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            this.setState({ locationPermission: response }, () => {
                if(response === 'authorized') this._checkPermissions();
            });
        });
    }


    _checkPermissions = () => {
        Permissions.check('location')
        .then(response => {
            if (response === 'undetermined' || response === '')
                this._requestPermission();
            else
                this.setState({ locationPermission: response }, () => {if(this.state.locationPermission === 'authorized') this._findCoordinates()})
        });
    }

    render() {
        const { navigation } = this.props;
        const date = navigation.getParam('date', {});
        const eventos = navigation.getParam('eventos', {});
        return (
            <SafeAreaView style={styles.content}>
                <NavigationEvents
                  onDidFocus={payload => this._checkPermissions()}
                />
                <View style={{flex: 1}}>
                    <Header
                        withBack={true}
                        onBack={() => this.props.navigation.goBack()}
                        title={"Eventos "+date.format('DD/MM/YYYY')}
                        withSearch={true}
                        onSearch={this.onSearch}
                    />
                    <CalendarList
                        {...this.props}
                        eventos={eventos}
                        fecha={date}
                        filter={this.state.filter}
                        location={this.state.location}
                        locationPermission={this.state.locationPermission}
                    />
                </View>
            </SafeAreaView>
        )
    }
}
