# JibJab

![Backend Node.js Workflow] (https://github.com/Darrick-Oliver/JibJab/actions/workflows/node.js.yml/badge.svg?branch=integ)


307 Project
JibJab is a social media app created to allow users to communicate in their local geolocation. Users can make a profile, login to their account securely, see messages from other jabbers, adjust a distance slider, react to posts and much more. This app creates a community in your area allowing you to effectively communicate with your peers.

## UI Prototype

Figma(10/17): https://www.figma.com/file/YJzhS3b0bL3EnkYT3zyEEh/Young-Socialites?node-id=0%3A1&t=O7XmaNbuMUJaYVU8-0

## Dev Environment Setup

### Clone Project

### npm i

### Setting up ESLint:

npm init @eslint/config --save-dev


### Setting up Prettier:

npm i prettier --save-dev
npm i prettierrc --save-dev
npm install eslint-config-prettier eslint-plugin-prettier prettier --save-dev

#### add plugin:prettier/recommended to extends:
    "plugin:prettier/recommended"

#### Add this to package.json scripts:
	"format": "prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc"

#### Command to run prettier format:
	npm run format
