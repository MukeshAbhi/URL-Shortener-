import { Url } from './model/url';
import { Counter } from './model/counter';
import { connect } from 'mongoose';

async function connectToDB(url: string) {
    try {
        await connect(url);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

export { Url, connectToDB, Counter };
