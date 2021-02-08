import React, {Component} from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import LinearGradient from 'react-native-linear-gradient'

const styles = EStyleSheet.create({
    back_2: {
      position: 'relative',
      height: 70,
      left: 0,
      width: '100%',
      marginBottom: 20
    },
    back_1: {
      position: 'relative',
      height: 70,
      left: 0,
      width: '100%',
      marginBottom: 20
    },
    buscador: {
      position: 'absolute',
      height: 40,
	  borderColor: '#EEEEEE',
	  color: '#000',
      backgroundColor: 'rgba(255,255,255,1)',
      borderWidth: 0.5,
      top: 20,
      right: 10,
      left: 10,
      borderRadius: 20,
      paddingLeft: 40,
      paddingRight: 40
    },
    title: {
      position: 'absolute',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      top: 28,
      left: 25
    },
    button_container: {
      position: 'absolute',
      zIndex: 20
    },
    button_right: {
      right: 20,
      top: 25
    },
    button_left: {
		left: -22,
		top: 12
	},
	button_left_back: {
		left: 5,
		top: 15
	},
    button: {
      width: 30,
      height: 30
    },
    logo: {
        marginLeft: 10,
        marginTop: 20,
        width: 50,
        height: 25
    },
    withBack: {
      left: 70
    }
})


class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      searching: false,
      key: ''
    }
  }

  onSearch = (text) => {
    this.setState({
      key: text
    }, () => {
      this.props.onSearch(this.state.key);
    });
  }

  render() {
    const { searching } = this.state;
    const { withSearch, withBack } = this.props;
    return (
      <View>
        { searching && withSearch ?
          <View>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                colors={['#38245f', '#5b3d90']}
                style={styles.back_2}>
                  <TouchableOpacity
                    style={[styles.button_container, styles.button_left_back, {padding: 10}]}
                    onPress={() => { this.setState({searching: false}, () => {this.onSearch('') }) }}>
                    <Image
                      style={styles.button}
                      source={require('../assets/back.png')}
                    />
                  </TouchableOpacity>
                  <TextInput
                    onChangeText={this.onSearch}
                    value={this.state.key}
                    style={styles.buscador}
                    autoFocus={true}
                  />
                  {
                    this.state.key.length ?
                      <TouchableOpacity
                        style={[styles.button_container, styles.button_right]}
                        onPress={() => { this.onSearch('') }}>
                        <Image
                          style={styles.button}
                          source={require('../assets/clear.png')}
                        />
                      </TouchableOpacity>
                      :
                      null
                  }
              </LinearGradient>
          </View>
          :
          <View>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                colors={['#38245f', '#5b3d90']}
                style={styles.back_1}>
                  {
                    withBack ?
                    <TouchableOpacity
                      style={[styles.button_container, styles.button_left_back, {padding: 10}]}
                      onPress={() => { this.props.onBack() }}>
                      <Image
                        style={styles.button}
                        source={require('../assets/backi.png')}
                      />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                      style={[styles.button_container]}
                      onPress={() => { }}>
                      <Image
                        resizeMode="contain"
                        style={styles.logo}
                        source={require('../assets/slogan.png')}
                      />
                    </TouchableOpacity>
                  }
                  <Text numberOfLines={1} style={[styles.title, styles.withBack]}>
                    {this.props.title}
                  </Text>
                  {
                    withSearch ?
                      <TouchableOpacity
                        style={[styles.button_container, styles.button_right]}
                        onPress={() => { this.setState({searching: true}) }}>
                        <Image
                          style={styles.button}
                          source={require('../assets/search.png')}
                        />
                      </TouchableOpacity>
                      :
                      null
                  }
              </LinearGradient>
          </View>
      }
    </View>
    );
  }
}

Header.defaultProps = {
  title: '',
  withSearch: false,
  withBack: false,
  onBack: () => {},
  onSearch: (key) => {}
}

export default Header;
