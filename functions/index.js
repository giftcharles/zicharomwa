const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require('express')
const { Nuxt } = require('nuxt')
const app = express()
const cors = require('cors');
app.use(cors({
    origin: 'true'
}));
let serviceAccount = require("./zicharomwa-ent-firebase-adminsdk-c4v23-22dcba7674.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const config = {
    dev: false,
    buildDir: '.nuxt',
    build: {
        publicPath: '/assets/'
    }
}
const nuxt = new Nuxt(config)

async function handleRequests(req, res) {
    res.set('Cache-Content', 'public', 'max-age-600', 's-maxage-1200')
    await nuxt.ready();
    nuxt.render(req, res);
}

app.get('*', handleRequests)
exports.ssrapp = functions.https.onRequest(app)