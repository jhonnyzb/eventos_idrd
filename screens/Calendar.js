import React, {Component} from 'react'
import {Text, View, ActivityIndicator} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { SafeAreaView } from 'react-navigation'
import Header from '../components/Header'
import {view} from '../styles/'
import CalendarPicker from 'react-native-calendar-picker'
import moment from "moment"
import {AppContext} from '../contexts/app-context'

const styles = EStyleSheet.create({
    ...view,
    tabLabel: {
        marginTop: 15,
        textAlign: 'center'
    },
    tabLabelActive: {
        color: '#11BBC2'
    },
    tabBarUnderlineStyle: {
        backgroundColor: '#11BBC2'
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
})

export default class Calendar extends Component {


    constructor(props) {
        super(props);
        
        this.state = {
            selectedStartDate: null,
            weekdays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        };

        this.onDateChange = this.onDateChange.bind(this);
    }

    onDateChange(date, eventos) {

        const {navigation} = this.props;

        this.setState({
            selectedStartDate: date,
        });

        navigation.navigate('Day', {
            date: date,
            eventos: eventos
        });

    }

    render() {
        return (
            <AppContext.Consumer>
                {({categorias, eventos, locationPermission, location, appDetailsSettings, checkPermissions, loading}) => {
                    const today = moment();
                    const day = today.clone().startOf('month');
                    const e = eventos.length ? eventos : [];
                    let dates = [];
                    let customDatesStyles = [];

                    e.map(function (object, i) {
                        const fecha_inicio = object.fecha;
                        const fecha_fin = object.fecha_fin ? object.fecha_fin : object.fecha;

                        if (fecha_inicio == fecha_fin) 
                        {
                            if (!dates.includes(fecha_inicio))
                            {
                                dates.push(fecha_inicio);
                            }
                        } else {
                            let dayiter = moment(fecha_inicio);
                            while(!dayiter.isAfter(fecha_fin, 'day')) {
                                let dateString = dayiter.format('YYYY-MM-DD');
                                if (!dates.includes(dateString))
                                {
                                    dates.push(dateString);
                                }

                                dayiter.add(1, 'days');
                            }
                        }
                    });

                    dates.forEach((fecha) => {
                        customDatesStyles.push(!today.isSame(fecha,'day') ? 
                            {
                                date: fecha,
                                style: {backgroundColor: '#5e4495'},
                                textStyle: {color: '#FFFFFF'},
                                containerStyle: {

                                }
                            } : {
                                date: fecha,
                                style: {backgroundColor: '#bbafd7'},
                                textStyle: {color: '#FFFFFF'},
                                containerStyle: {
                                    
                                }
                            }
                        );
                    });

                    return (
                        <SafeAreaView style={styles.content}>
                            <View style={styles.container}>
                                <Header
                                title={"Calendario de eventos"}
                                />
                                { loading ? (
                                    <View style={styles.centerAll}>
                                        <ActivityIndicator size="large" color="#009FE3"/>
                                        <Text style={styles.centerText}>
                                            {'\n'}
                                            Estamos descargando la información, no debería tardar mucho.
                                        </Text>
                                    </View>
                                    ) : (
                                        <CalendarPicker
                                            onDateChange={(date) => {this.onDateChange(date, e)}}
                                            weekdays={this.state.weekdays}
                                            months={this.state.months}
                                            customDatesStyles={customDatesStyles}
                                            todayBackgroundColor="#d6d7da"
                                            todayTextStyle={{
                                                color: "#333333"
                                            }}
                                            selectedDayTextColor="#333333"
                                            selectedDayStyle={{
                                                backgroundColor: '#EEEEEE',
                                                borderWidth: 3,
                                                borderColor: '#CCCCCC'
                                            }}
                                            previousTitle="Anterior"
                                            nextTitle="Siguiente"
                                        />
                                    )
                                }
                            </View>
                        </SafeAreaView>
                    )
                }}
            </AppContext.Consumer>
        );
    }

}
