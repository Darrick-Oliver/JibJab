# JibJab
307 Project


## Setting up ESLint:

npm init @eslint/config --save-dev


## Setting up Prettier:

npm i prettier --save-dev
npm i prettierrc --save-dev
npm install eslint-config-prettier eslint-plugin-prettier prettier --save-dev

### add plugin:prettier/recommended to extends:
    "plugin:prettier/recommended"

### Add this to package.json scripts:
	"format": "prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc"

### Command to run prettier format:
	npm run format
