# Agenda

[![Deploy to Firebase Hosting](https://github.com/nicolashornuel/agenda/actions/workflows/manual.yml/badge.svg)](https://github.com/nicolashornuel/agenda/actions/workflows/manual.yml)

https://agenda-bf245.web.app/

# Compatibility

If you want to see what versions are available to install:

```sh
nvm ls-remote
```

To install a specific version of node:

```sh
nvm install 16.13
```

If you want to see what versions are installed

```sh
nvm ls
```

```sh
nvm use v16.13.2
```

firebase functions:config:set <key>=<value>
firebase deploy --only functions
firebase functions:config:get
firebase functions:secrets:set SECRET_NAME=value
https://firebase.google.com/docs/functions/config-env?hl=fr

## @angular/fire

https://firebaseopensource.com/projects/angular/angularfire2
https://www.npmjs.com/package/@angular/fire
https://github.com/angular/angularfire
https://firebase.google.com/docs/auth/web/firebaseui?hl=fr&authuser=0

## https://console.firebase.google.com/u/0/

`firebase init`
`npm i firebase --save`

## https://the-guild.dev/graphql/apollo-angular/docs/get-started

`npm i apollo-angular @apollo/client graphql`

## https://mattlewis-github.com/angular-calendar/#/kitchen-sink

`npm i angular-calendar`

## Cloud Function

https://firebase.google.com/docs/functions/manage-functions?hl=fr&gen=2nd
fetch fourni nativement avec node.js v18 :
https://nodejs.org/en/blog/announcements/v18-release-announce

Dépendances

```sh
npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools
```

Déploiement

```sh
firebase deploy --only functions
firebase deploy --only functions:onCallGetJson,functions:onCallGetText
firebase functions:delete myFunction myOtherFunction
```

```sh
cd functions && npm run build:watch (tsc --watch)
```

```sh
cd functions && npm run serve (npm run build && firebase emulators:start --only functions)
```

to test with postman and codespace github :

```sh
gcloud auth application-default login
gcloud auth print-identity-token
```

and get token into /home/node/.config/firebase
https://googleapis.dev/nodejs/firestore/latest/index.html

https://glowing-sniffle-p6j57p657qqcrg99-5001.app.github.dev/agenda-bf245/us-central1/onRequest
https://docs.github.com/en/codespaces/developing-in-codespaces/forwarding-ports-in-your-codespace
echo $GITHUB_TOKEN

## Dev Container

go to :
[https://effective-guacamole-p6j57p6qv4qf7w64.github.dev](https://effective-guacamole-p6j57p6qv4qf7w64.github.dev)

and start :

```sh
npm run start
```

check or add OAuth Domaine :
[https://console.firebase.google.com/u/0/project/agenda-bf245/authentication/settings](https://console.firebase.google.com/u/0/project/agenda-bf245/authentication/settings)
like this : 'https://effective-guacamole-p6j57p6qv4qf7w64-4200.app.github.dev/'

# Leaflet

```sh
npm install leaflet @asymmetrik/ngx-leaflet@15
npm i --s @types\leaflet
```

1 - Add Leaflet style into application, inside angular.json add leaflet.css file:

```sh
{
    ...
    "styles": [
        "styles.scss",
        "./node_modules/leaflet/dist/leaflet.css"
    ],
    ...
}
```

2 - Before you are starting to use Leaflet inside application, you must import Leaflet module inside app.module.ts or inside module you want to use it:

```sh
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
...
imports: [
    ...
    LeafletModule
]
...
```
