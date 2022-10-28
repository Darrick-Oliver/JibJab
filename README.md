# JibJab
307 Project


## For backend !!!
Setting up ESL Lint:

npm init @eslint/config --save-dev

Terminal commands:
![alt text](https://github.com/Darrick-Oliver/JibJab/blob/main/JibJab_backend_ESLint_commands.png?raw=true)


Setting up Prettier:

npm i prettier --save-dev
npm i prettierrc --save-dev
npm install eslint-config-prettier eslint-plugin-prettier prettier --save-dev

add plugin:prettier/recommended to extends:
    "plugin:prettier/recommended"

Add this to package.json scripts:
	"format": "prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc"

Command to run prettier format:
	npm run format

