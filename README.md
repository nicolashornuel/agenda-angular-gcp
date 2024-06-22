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

// Use 'postCreateCommand' to run commands after the container is created.
"postCreateCommand": "npm install",
"postCreateCommand": "bash scripts/install-dev-tools.sh"
"postCreateCommand": "bash -i -c 'nvm install --lts'"


  // Configure tool-specific properties.
  "customizations": {
    // Configure properties specific to VS Code.
    "vscode": {
      // Add the IDs of extensions you want installed when the container is created.
      "extensions": [
        "streetsidesoftware.code-spell-checker"
      ]
    }

CTRL + SHIFT + P : Dev Containers: Rebuild Container

https://medium.com/dev-jam/5-tips-best-practices-to-organize-your-angular-project-e900db08702e

"start": "ng serve --host 0.0.0.0 --public-host nicolashornuel-urban-winner-q5965x96xr34xp5-4200.preview.app.github.dev"

"start": "ng serve --disable-host-check"
  
  https://firebase.google.com/docs/functions/config-env?hl=fr

## @angular/fire
https://firebaseopensource.com/projects/angular/angularfire2
https://www.npmjs.com/package/@angular/fire
https://github.com/angular/angularfire
https://firebase.google.com/docs/auth/web/firebaseui?hl=fr&authuser=0

# MyStation

`npm uninstall -g @angular/cli`
`npm install -g @angular/cli@latest`
`ng new my-station`
`nvm install v..`
`nvm use v..`

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
