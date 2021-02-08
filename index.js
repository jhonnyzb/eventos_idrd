import './pollyfill';
import './shim.js';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import EStyleSheet from 'react-native-extended-stylesheet';

EStyleSheet.build();

console.log("_____EVENTOS_IDRD_____");

AppRegistry.registerComponent(appName, () => App);
