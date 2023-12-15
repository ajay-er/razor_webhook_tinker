import 'dotenv/config'
import app from './app';
import mongoConnect from './config/mongo';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

(async () => {
    try {
        if (!RAZORPAY_WEBHOOK_SECRET) throw new Error('Please provide RAZORPAY_WEBHOOK_SECRET');
        if (!MONGO_URI) throw new Error('Please provide MONGO_URI');
        console.clear();		
        await mongoConnect(MONGO_URI);
        
        app.listen(PORT, async () => {
            console.log(`Server is Listening on port ${PORT}`);
        })
            .on('error', async () => {
                console.log('oops something goes wrong');
            })
            .on('close', async () => {});
    } catch (error) {
        console.error('Unable to connect.');
        console.error(error);
    }
})();
