import React, {Component} from 'react'
import {Text, Image} from 'react-native'
import * as Animatable from 'react-native-animatable';
import {createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import Home from '../screens/Home'
import Events from '../screens/Events'
import Day from '../screens/Day'
import Favorites from '../screens/Favorites'
import Calendar from '../screens/Calendar'
import Patrocinadores from '../screens/Patrocinadores'
import PQRS from '../screens/PQRS'
import Evento from '../modals/Evento'

const styles = EStyleSheet.create({
    bar: {
        height: 90,
        backgroundColor: 'blue'
    },
    image: {
        width: 50,
        height: 50,
        marginTop: 10
    }
})

const CalendarStack = createStackNavigator({
        Calendar: Calendar,
        Day: Day,
    },
    {
        headerMode: 'none'
    }
);

const Tabs = createBottomTabNavigator(
    {
        Home: Home,
        Events: Events,
        Calendar: CalendarStack,
        Favorites: Favorites,
        PQRS: PQRS
        /*Patrocinadores: Patrocinadores*/
    },
    {
        lazy: true,
        removeClippedSubviews: true,
        tabBarOptions: {
            style: {
                backgroundColor: '#E9EBEC',
                height: 70
            }
        },
        defaultNavigationOptions: ({navigation}) => ({
            tabBarOnPress: ({defaultHandler}) => defaultHandler(),
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                let icon;
                let delay = 0;
                switch (routeName) {
                    case 'Home':
                        icon = focused ?
                            require('../assets/home-focus.png') :
                            require('../assets/home.png')
                        break
                    case 'Events':
                        icon = focused ?
                            require('../assets/events-focus.png') :
                            require('../assets/events.png')
                        delay += 50
                        break
                    case 'Favorites':
                        icon = focused ?
                            require('../assets/favorites-focus.png') :
                            require('../assets/favorites.png')
                        delay += 100
                        break
                    case 'Calendar':
                        icon = focused ?
                            require('../assets/calendar-focus.png') :
                            require('../assets/calendar.png')
                        delay += 150
                        break
                    case 'Patrocinadores':
                        icon = focused ?
                            require('../assets/patrocinadores-focus.png') :
                            require('../assets/patrocinadores.png')
                        delay += 200
                        break
                    case 'PQRS':
                        icon = focused ?
                            require('../assets/pqr-focus.png') :
                            require('../assets/pqr.png')
                        delay += 200
                        break
                    default:
                        icon = require('../assets/home-focus.png');
                }

                return <Image
                    animation={'zoomIn'}
                    style={ styles.image }
                    source={ icon }
                />
            },
            tabBarLabel: ({tintColor, focused}) => {
                return <Text></Text>
            }
        })
    }
);

const Navigator = createStackNavigator(
    {
        Main: {
            screen: Tabs
        },
        ModalEventos: {
            screen: Evento
        }
    },
    {
        mode: 'modal',
        headerMode: 'none'
    }
)

export default createAppContainer(Navigator);
