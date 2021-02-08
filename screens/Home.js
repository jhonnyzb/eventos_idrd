import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  AppState,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import {SafeAreaView, NavigationEvents} from 'react-navigation';
import AndroidOpenSettings from 'react-native-android-open-settings';
import Header from '../components/Header';
import Carousel from 'react-native-snap-carousel';
import moment from 'moment';
import HomeList from '../components/HomeList';
import DestacadosList from '../components/DestacadosList';
import {view} from '../styles/';
import {AppContext} from '../contexts/app-context';
import {getDistance} from '../util/';

const styles = EStyleSheet.create({
  ...view,
  carousel: {
    zIndex: 2,
    elevation: 2,
    marginTop: -10,
    paddingTop: 8,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: '#5b3d90',
  },
  carouselArea: {
    flex: 1,
    marginTop: -10,
  },
  checkLocationLabel: {
    backgroundColor: '#FFF9C4',
    color: '#333333',
    padding: 10,
    marginTop: -10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tabLabel: {
    marginTop: 15,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#5b3d90',
  },
  tabBarUnderlineStyle: {
    backgroundColor: '#5b3d90',
  },
});

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      width: 400,
      height: 100,
    };

    this.children = [];
  }

  onSearch = key => {
    this.setState({
      filter: key,
    });
  };

  onLayout = event => {
    let {x, y, width, height} = event.nativeEvent.layout;

    this.setState({
      width: width,
      height: height,
    });
  };

  handleChangeTab = ({i, ref, from}) => {
    if (this.children[i]) {
      this.children[i].onEnter();
      this.children[from].onLeave();
    }
  };

  renderTab = (name, page, isTabActive, onPressHandler, onLayoutHandler) => {
    return (
      <TouchableHighlight
        key={`${name}_${page}`}
        onPress={() => onPressHandler(page)}
        onLayout={onLayoutHandler}
        style={{flex: 1, minWidth: 120}}
        underlayColor="#FFFFFF">
        <Text
          style={[styles.tabLabel, isTabActive ? styles.tabLabelActive : {}]}>
          {name}
        </Text>
      </TouchableHighlight>
    );
  };

  componentDidMount() {
    const {width, height} = Dimensions.get('window');

    this.setState({
      width: width,
      height: height,
    });
  }

  _openDroidSetting = settingFunc => {
    return new Promise((resolve, reject) => {
      const listener = state => {
        if (state === 'active') {
          AppState.removeEventListener('change', listener);
          resolve();
        }
      };

      AppState.addEventListener('change', listener);
      try {
        settingFunc();
      } catch (e) {
        AppState.removeEventListener('change', listener);
        reject(e);
      }
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
          const c = categorias.length
            ? categorias[0].categorias instanceof Array
              ? categorias[0].categorias
              : []
            : [];

          const e = eventos.length ? eventos : [];

          let eventos_en_rango = e.filter(evento => {
            const fecha_inicio = evento.fecha;
            const fecha_fin = evento.fecha_fin
              ? evento.fecha_fin
              : evento.fecha;
            return (
              (moment(fecha_inicio).isSameOrAfter(moment(), 'day') &&
                moment(fecha_inicio).isBefore(
                  moment().add(6, 'days'),
                  'day',
                )) ||
              moment().isBetween(fecha_inicio, fecha_fin)
            );
          });

          let destacados = eventos_en_rango.filter(evento => {
            const fecha_inicio = evento.fecha;
            const fecha_fin = evento.fecha_fin
              ? evento.fecha_fin
              : evento.fecha;

            return (
              (moment(fecha_inicio).isSameOrAfter(moment(), 'day') ||
                moment().isBetween(fecha_inicio, fecha_fin)) &&
              evento.destacado == 1
            );
          });

          let categorias_con_eventos = c.map(categoria => {
            categoria.eventos = eventos_en_rango.filter(
              evento => evento.categoria == categoria.id,
            );
            categoria.total_eventos = categoria.eventos.length;
            return categoria;
          });

          categorias_con_eventos.sort((c1, c2) =>
            c1.total_eventos < c2.total_eventos ? 1 : -1,
          );

          if (locationPermission === 'authorized' && location) {
            destacadosGeo = destacados.map(e => {
              let distancia = e.ubicacion
                ? getDistance(
                    parseFloat(e.ubicacion.lat),
                    parseFloat(e.ubicacion.lon),
                    parseFloat(location.coords.latitude),
                    parseFloat(location.coords.longitude),
                  )
                : -1;

              e.distance = distancia;
              return e;
            });
          } else {
            destacadosGeo = destacados.map(e => {
              e.distance = -1;
              return e;
            });
          }

          if (destacadosGeo.length > 0) {
            categorias_con_eventos = [
              {
                id: '0',
                nombre: 'Destacados',
                eventos: destacadosGeo,
                total_eventos: destacadosGeo.length,
              },
              ...categorias_con_eventos,
            ];
          }

          return (
            <SafeAreaView style={styles.content}>
              <NavigationEvents onDidFocus={payload => checkPermissions()} />
              <Header withSearch={false} title={'Próximos eventos'} />
              {loading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size="large" color="#5400c2b6" />
                  <Text style={{textAlign: 'center'}}>
                    Estamos descargando la información, no debería tardar
                    mucho...
                  </Text>
                </View>
              ) : (
                <View onLayout={this.onLayout} style={styles.carouselArea}>
                  {locationPermission === 'denied' &&
                  appDetailsSettings === 0 ? (
                    <TouchableHighlight
                      style={styles.checkLocation}
                      onPress={() => {
                        this.setState({
                          appDetailsSettings: 1,
                        });

                        if (Platform.OS === 'android')
                          this._openDroidSetting(
                            AndroidOpenSettings.appDetailsSettings,
                          ).then(() => {
                            checkPermissions();
                          });
                        else if (Platform.OS === 'ios')
                          Linking.openURL('app-settings:');
                      }}>
                      <Text style={styles.checkLocationLabel}>
                        * Obten mejores resultados activando el permiso de
                        ubicación.
                      </Text>
                    </TouchableHighlight>
                  ) : null}
                  <ScrollableTabView
                    style={{marginTop: -10}}
                    renderTabBar={() => (
                      <ScrollableTabBar renderTab={this.renderTab} />
                    )}
                    onChangeTab={this.handleChangeTab}
                    tabBarUnderlineStyle={styles.tabBarUnderlineStyle}>
                    {categorias_con_eventos.map((categoria, i) => {
                      if (categoria.nombre == 'Destacados')
                        return (
                          <DestacadosList
                            {...this.props}
                            ref={ref => (this.children[i] = ref)}
                            tabLabel={categoria.nombre}
                            i={i}
                            key={i}
                            categoria={categoria.id}
                            eventos={categoria.eventos}
                            filter={this.state.filter}
                            location={location}
                            locationPermission={locationPermission}
                            width={this.state.width}
                            height={this.state.height}
                          />
                        );
                      else
                        return (
                          <HomeList
                            {...this.props}
                            ref={ref => (this.children[i] = ref)}
                            tabLabel={categoria.nombre}
                            i={i}
                            key={i}
                            categoria={categoria.id}
                            eventos={categoria.eventos}
                            filter={this.state.filter}
                            location={location}
                            locationPermission={locationPermission}
                          />
                        );
                    })}
                  </ScrollableTabView>
                </View>
              )}
            </SafeAreaView>
          );
        }}
      </AppContext.Consumer>
    );
  }
}
