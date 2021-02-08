import React, {Component} from 'react';
import {
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import {Popup} from 'react-native-map-link';
import imageCacheHoc from 'react-native-image-cache-hoc';
import EStyleSheet from 'react-native-extended-stylesheet';
import {SafeAreaView} from 'react-navigation';
import Header from '../components/Header';
import ErrorBoundary from '../components/ErrorBoundary';
import Date from '../components/Date';
import {view} from '../styles/';
import Toast from 'react-native-toast-message';
import Message from '../components/Message'

const CacheableImage = imageCacheHoc(Image, {
  fileHostWhitelist: ['idrd.gov.co', 'www.idrd.gov.co'],
});

const styles = EStyleSheet.create({
  ...view,
  itemContainer: {
    position: 'relative',
    flexDirection: 'row',
    height: 150,
    backgroundColor: 'rgba(0, 51, 102, .8)',
  },
  backgroundImage: {
    flex: 1,
  },
  view_title: {
    marginTop: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  view_datos: {
    flex: 1,
  },
  view_tipo: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    borderRadius: 5,
    height: 70,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tipo: {
    padding: 10,
    color: '#ffffff',
    borderRadius: 3,
  },
  buttonFavorites: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    right: 1,
    top: 140,
    width: 45,
    height: 45,
    zIndex: 20,
    elevation: 3,
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
  date: {
    position: 'absolute',
    right: 3,
    top: -5,
    width: 30,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#EEEEEE',
  },
  dateDay: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    flex: 1,
  },
  dateMonth: {
    fontSize: 10,
    textAlign: 'center',
    color: '#FF0000',
    flex: 1,
  },
  hyperlink: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  detail_text: {
    color: '#333333',
    textTransform: 'capitalize',
  },

  cardDataTitle: {
    backgroundColor: '#5400c2b6',
    fontWeight: 'bold',
    height: 20,
    width: '30%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10,
  },
  cardData: {
    backgroundColor: '#efefef',
    borderRadius: 5,
    paddingLeft: 5,
    minHeight: 80,
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 20,
  },
});

const toastConfig = {
  success: ({text1, props, ...rest}) => (
   <Message text1={text1} color_='green'/>
  ),
  info: ({text1, props, ...rest}) => (
    <Message text1={text1} color_='red'/>
  )
};

class Evento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      favorite: false,
      isVisible: false,
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

  addToFavorites = async evento => {
    try {
      let favorites = await this.getFavorites();
      favorites = (favorites.length > 0 ? favorites + ',' : '') + evento._id;
      let sinDuplicados = favorites.split(',').filter((item, pos, self) => {
        return self.indexOf(item) == pos;
      });

      await AsyncStorage.setItem('favorites', sinDuplicados.join(','));
      this.setState(
        {
          favorite: true,
        },
        () => {
          Toast.show({
            text1: 'Añadido',
            position: 'top',
            visibilityTime: 1500,
          });
        },
      );
    } catch (error) {
      console.warn(error.message);
    }
  };

  removeFromFavorites = async evento => {
    try {
      let favorites = await this.getFavorites();
      let sinFavorito = favorites.split(',').filter(item => item != evento._id);

      await AsyncStorage.setItem('favorites', sinFavorito.join(','));
      this.setState(
        {
          favorite: false,
        },
        () => {
          Toast.show({
            type: 'info',
            text1: 'Removido',
            position: 'bottom',
            visibilityTime: 1500,
          });
        },
      );
    } catch (error) {
      console.warn(error.message);
    }
  };

  async componentDidMount() {
    const {navigation} = this.props;
    const evento = navigation.getParam('evento', {
      _id: '',
      nombre: '',
      lugar: '',
      resumen: '',
      imagen: '',
      fecha: '',
      hora: '',
      tipo: '',
      categoria: '',
      destacado: '',
      distance: -1,
      ubicacion: {
        lat: 0,
        lon: 0,
      },
    });

    let favoritos = await this.getFavorites();
    let favoritosInt = favoritos.split(',');

    this.setState({
      favorite: favoritosInt.indexOf(evento._id) > -1,
      loading: false,
    });
  }

  render() {
    const {navigation} = this.props;

    const evento = navigation.getParam('evento', {
      _id: '',
      nombre: '',
      lugar: '',
      resumen: '',
      imagen: '',
      fecha: '',
      hora: '',
      tipo: '',
      categoria: '',
      destacado: '',
      distance: -1,
      ubicacion: {
        lat: 0,
        lon: 0,
      },
    });

    let label_distancia = '';

    if (evento.distance !== -1) {
      if (evento.distance <= 5.0) {
        label_distancia =
          'Cerca a tu ubicación actual. (' +
          evento.distance.toFixed(2) +
          ' Km)';
      } else {
        label_distancia =
          'A ' + evento.distance.toFixed(2) + ' Km de tu ubicación actual';
      }
    }

    return (
      <SafeAreaView style={styles.content} forceInset={{top: 'always'}}>
        <Popup
          isVisible={this.state.isVisible}
          onCancelPressed={() => this.setState({isVisible: false})}
          onAppPressed={() => this.setState({isVisible: false})}
          onBackButtonPressed={() => this.setState({isVisible: false})}
          modalProps={{
            // you can put all react-native-modal props inside.
            animationIn: 'slideInUp',
          }}
          appsWhiteList={['google-maps', 'waze', 'apple-maps']}
          options={{
            latitude: evento.ubicacion ? evento.ubicacion.lat : 0,
            longitude: evento.ubicacion ? evento.ubicacion.lon : 0,
            title: '',
            dialogTitle: 'Abrir en mapas',
            dialogMessage:
              '¿Cuál aplicación deseas utilizar para abrir la ubicación?',
            cancelText: 'Cancelar',
          }}
        />
        <Header
          withBack={true}
          onBack={() => this.props.navigation.goBack()}
          title={'Detalles'}
        />
        {this.state.loading ? (
          <View style={styles.centerAll}>
            <ActivityIndicator size="large" color="#5400c2b6" />
            <Text style={styles.centerText}>
              {'\n'}
              Estamos descargando la información, no debería tardar mucho.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{
              flex: 1,
              marginTop: -10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
            <TouchableOpacity
              style={styles.buttonFavorites}
              onPress={() => {
                this.state.favorite
                  ? this.removeFromFavorites(evento)
                  : this.addToFavorites(evento);
              }}>
              <Image
                style={styles.buttonImage}
                source={
                  this.state.favorite
                    ? require('../assets/favorites-focus.png')
                    : require('../assets/favorites.png')
                }
              />
            </TouchableOpacity>
            <ErrorBoundary>
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  evento.link ? Linking.openURL(evento.link) : '';
                }}>
                <CacheableImage
                  style={styles.backgroundImage}
                  source={{uri: evento.imagen}}
                  permanent={true}
                />
                <Date
                  fecha_inicio={evento.fecha}
                  fecha_fin={evento.fecha_fin ? evento.fecha_fin : evento.fecha}
                  modal={true}
                />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#EFEFEF',
                  width: '30%',
                  height: 25,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Rol del Usuario</Text>
              </View>
              <View style={styles.view_tipo}>
                <Text
                  style={[
                    styles.tipo,
                    evento.tipo == 'Espectador'
                      ? {backgroundColor: '#5400c2b6'}
                      : {backgroundColor: '#999999'},
                  ]}>
                  Espectador
                </Text>
                <Text
                  style={[
                    styles.tipo,
                    evento.tipo == 'Participante'
                      ? {backgroundColor: '#5400c2b6'}
                      : {backgroundColor: '#999999'},
                    {marginLeft: 10},
                  ]}>
                  {' '}
                  Participante
                </Text>
              </View>
            </ErrorBoundary>
            <View style={styles.view_title}>
              <Text style={styles.title}>{evento.nombre}</Text>
            </View>

            <View style={styles.view_datos}>
              {evento.lugar ? (
                <View>
                  <View
                    style={[
                      styles.topSeparation,
                      styles.cardDataTitle,
                      {right: 12},
                    ]}>
                    <Text style={{fontWeight: 'bold', color: '#ffffff'}}>
                      Lugar
                    </Text>
                  </View>
                  <View style={styles.cardData}>
                    <Text style={styles.detail_text}>
                      {('localidad' in evento && evento.localidad
                        ? evento.localidad + ' - '
                        : '') + evento.lugar}{' '}
                      {evento.distance !== -1 ? '\n' + label_distancia : ''}{' '}
                    </Text>
                  </View>
                </View>
              ) : null}

              {evento.hora ? (
                <View>
                  <View
                    style={[
                      styles.topSeparation,
                      styles.cardDataTitle,
                      {left: 12},
                    ]}>
                    <Text style={{fontWeight: 'bold', color: '#ffffff'}}>
                      Horario
                    </Text>
                  </View>
                  <View style={styles.cardData}>
                    <Text>{evento.hora}</Text>
                  </View>
                </View>
              ) : null}

              {evento.tipo_poblacion ? (
                <View>
                  <View
                    style={[
                      styles.topSeparation,
                      styles.cardDataTitle,
                      {right: 12},
                    ]}>
                    <Text style={{fontWeight: 'bold', color: '#ffffff'}}>
                      Dirigido a
                    </Text>
                  </View>
                  <View style={styles.cardData}>
                    <Text style={styles.detail_text}>
                      {' '}
                      {evento.tipo_poblacion.split(',').join('\n')}
                    </Text>
                  </View>
                </View>
              ) : null}

              {evento.entrada ? (
                <View>
                  <View
                    style={[
                      styles.topSeparation,
                      styles.cardDataTitle,
                      {left: 12},
                    ]}>
                    <Text style={{fontWeight: 'bold', color: '#ffffff'}}>
                      Entrada
                    </Text>
                  </View>
                  <View style={styles.cardData}>
                    <Text style={styles.detail_text}>{evento.entrada}</Text>
                  </View>
                </View>
              ) : null}

              {evento.descripcion ? (
                <View>
                  <View
                    style={[
                      styles.topSeparation,
                      styles.cardDataTitle,
                      {right: 12},
                    ]}>
                    <Text style={{fontWeight: 'bold', color: '#ffffff'}}>
                      Descripcion
                    </Text>
                  </View>
                  <View style={styles.cardData}>
                    <Text style={styles.detail_text}>{evento.descripcion}</Text>
                  </View>
                </View>
              ) : null}

              <View style={[styles.topSeparation, {marginTop: 20}]} />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: evento.ubicacion
                    ? 'space-between'
                    : 'space-around',
                }}>
                {evento.ubicacion ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({isVisible: true});
                    }}>
                    <View style={{alignItems: 'center'}}>
                      <Image
                        style={{width: 35, height: 35}}
                        source={require('../assets/map.png')}
                      />
                      <Text style={{color: '#9999', marginTop: 7}}>
                        ¿Como llegar?
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}

                {evento.link ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(evento.link)}>
                    <View style={{alignItems: 'center'}}>
                      <Image
                        style={{width: 35, height: 35}}
                        source={require('../assets/more.png')}
                      />
                      <Text style={{color: '#9999', marginTop: 7}}>
                        Entra aquí
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `mailto:atncliente@idrd.gov.co?subject=${evento.nombre}`,
                    )
                  }>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      style={{width: 35, height: 35}}
                      source={require('../assets/help.png')}
                    />
                    <Text style={{color: '#9999', marginTop: 7}}>
                      Dudas y sugerencias
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
        <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
      </SafeAreaView>
    );
  }
}

export default Evento;
