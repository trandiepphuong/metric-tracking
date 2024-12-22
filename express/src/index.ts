import mongoose from 'mongoose';
import app from './app';
import { App, Database } from './config/configuration';

const PORT = App.Port || 3000;
const MONGO_URI = Database.MONGO_URI || 'mongodb://localhost:27017/metrics';

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    });
