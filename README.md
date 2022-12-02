# JibJab
![Backend Node.js Workflow](https://github.com/Darrick-Oliver/JibJab/actions/workflows/node.js.yml/badge.svg?branch=integ)

![Build and Deploy Node.js to Azure](https://github.com/Darrick-Oliver/JibJab/actions/workflows/main_jibjab.yml/badge.svg?branch=main)


307 Project
JibJab is a social media app created to allow users to communicate in their local geolocation. Users can make a profile, login to their account securely, see messages from other jabbers, adjust a distance slider, react to posts and much more. This app creates a community in your area allowing you to effectively communicate with your peers.

### wiki:  https://github.com/Darrick-Oliver/JibJab/wiki

### CI deployment: https://github.com/Darrick-Oliver/JibJab/actions/workflows/node.js.yml

## UI Prototype

Figma(10/17): https://www.figma.com/file/YJzhS3b0bL3EnkYT3zyEEh/Young-Socialites?node-id=0%3A1&t=O7XmaNbuMUJaYVU8-0

## Dev Environment Setup

### Clone Project
```
git clone https://github.com/Darrick-Oliver/JibJab.git
```

### Installing all libraries (from main folder):
```
cd frontend && npm i && cd ..
cd backend && npm i && cd ..
```

### Setting up Prettier/ESLint:
#### Add prettier plugin to VSCode (optional):
https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

#### Command to run prettier format:
	npm run format
