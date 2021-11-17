const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require('express')
const { Nuxt } = require('nuxt')
const app = express()
const cors = require('cors');
app.use(cors({
    origin: 'true'
}));
let serviceAccount = require("./geekyhubtz-firebase-adminsdk-bfffe-7649b0bc66.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://geekyhubtz.firebaseio.com",
});
const config = {
    dev: false,
    buildDir: '.nuxt',
    build: {
        publicPath: '/assets/'
    }
}
const nuxt = new Nuxt(config)

function handleRequests(req, res) {
    res.set('Cache-Content', 'public', 'max-age-600', 's-maxage-1200')
    nuxt.renderRoute(req.path, {req, res})
    .then((result) => {
        res.send(result.html)
    })
}

app.get('*', handleRequests)
exports.ssrapp = functions.https.onRequest(app)