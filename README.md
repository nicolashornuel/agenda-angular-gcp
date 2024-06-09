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

