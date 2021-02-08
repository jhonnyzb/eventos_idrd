import PouchDB from '@craftzdog/pouchdb-core-react-native'
import HttpPouch from 'pouchdb-adapter-http'
import replication from '@craftzdog/pouchdb-replication-react-native'
import mapreduce from 'pouchdb-mapreduce'
import find from 'pouchdb-find'
import SQLite from 'react-native-sqlite-2'
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite'
import axios from 'axios'
import moment from 'moment'

const SQLiteAdapter = SQLiteAdapterFactory(SQLite)

PouchDB.plugin(HttpPouch)
	.plugin(replication)
	.plugin(mapreduce)
	.plugin(find)
	.plugin(SQLiteAdapter)

let db = new PouchDB('eventos_idrd', { adapter: 'react-native-sqlite' });
let remoteDB = new PouchDB('http://idrdgov_apps:56tyghbn@mapas.idrd.gov.co:5984/eventos_idrd');

let synchandler = db.sync(remoteDB, {
	live: true,
	retry: true,
	filter: function (doc) {
		if (doc.schema === 'categorias')
			return true;
		if (doc.schema === 'eventos') {
			const fecha_inicio = doc.fecha;
			const fecha_fin = doc.fecha_fin ? doc.fecha_fin : doc.fecha;
			return (moment(fecha_inicio).isSameOrAfter(moment().subtract(15, 'days'), 'day') && moment(fecha_inicio).isBefore(moment().add(15, 'days'), 'day')) || (moment().isBetween(fecha_inicio, fecha_fin)) || doc.categoria == '-1'
		} else {
			return true;
		}
	}
}).on('error', (err) => {
	console.log("ERROR", err);
}).on('complete', function (info) {
	console.log("MENSAJE", info);
});

export { db, synchandler };
