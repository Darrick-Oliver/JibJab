import "dotenv/config"
import { useContainer } from 'routing-controllers';
import { Container } from 'typescript-ioc';
const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`;

export const bootstrapDB = () => {
	// Register typescript-ioc
	useContainer(Container);

	// Connect to client
    mongoose.connect(url,  {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connected to MongoDB"))
    .catch((err: string) => console.error(`Error connecting to MongoDB: ${err}`));

    // const db = mongoose.connection;

	// Create a client injectable
	// Container.bindName('db').to(db);
}