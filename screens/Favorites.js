import React, {Component} from 'react';
import {Text, View, ActivityIndicator, AsyncStorage, Image} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {SafeAreaView, NavigationEvents} from 'react-navigation';
import Header from '../components/Header';
import EventsList from '../components/EventsList';
import {view} from '../styles/';
import {AppContext} from '../contexts/app-context';

const styles = EStyleSheet.create({
  ...view,
});

export default class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      favorites: '',
    };
  }

  getFavorites = async () => {
    let favorites = '';
    try {
      favorites = (await AsyncStorage.getItem('favorites')) || '';
    } catch (error) {
      console.warn(error.message);
    }

    return favorites;
  };

  onSearch = key => {
    this.setState({
      filter: key,
    });
  };

  checkFavorites = async () => {
    let favorites = await this.getFavorites();
    this.setState({
      favorites: favorites,
    });
  };

  render() {
    return (
      <AppContext.Consumer>
        {({
          categorias,
          eventos,
          locationPermission,
          location,
          appDetailsSettings,
          checkPermissions,
          loading,
        }) => {
          const e = eventos.length ? eventos : [];

          this.getFavorites().then(favoritos => {
            let data = favoritos.split(',');
            let vigentes = [];
            const e = eventos.length ? eventos : [];

            data.map(id => {
              e.map(evento => {
                if (evento._id == id) {
                  vigentes.push(id);
                }
              });
            });

            AsyncStorage.setItem('favorites', vigentes.join(','));
          });

          return (
            <SafeAreaView style={styles.content}>
              <NavigationEvents
                onDidFocus={payload => {
                  this.checkFavorites();
                  checkPermissions();
                }}
              />
              <View style={{flex: 1}}>
                <Header
                  title={'Favoritos'}
                  withSearch={true}
                  onSearch={this.onSearch}
                />
                {loading ? (
                  <View style={styles.centerAll}>
                    <ActivityIndicator size="large" color="#5400c2b6" />
                    <Text style={styles.centerText}>
                      {'\n'}
                      Estamos descargando la información, no debería tardar
                      mucho.
                    </Text>
                  </View>
                ) : (
                  <EventsList
                    {...this.props}
                    eventos={e}
                    favoritos={this.state.favorites}
                    filter={this.state.filter}
                    location={location}
                    locationPermission={locationPermission}
                    soloFavoritos={true}
                  />
                )}
              </View>
            </SafeAreaView>
          );
        }}
      </AppContext.Consumer>
    );
  }
}
