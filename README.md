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
