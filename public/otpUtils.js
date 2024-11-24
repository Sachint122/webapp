const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const generateOTP = () => {
    return crypto.randomBytes(3).toString('hex'); // Generates a 6-digit OTP
};

const storeOTP = async (email, otp) => {
    const db = client.db('otpDB');
    const otpCollection = db.collection('otps');
    const expirationTime = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    await otpCollection.updateOne(
        { email },
        { $set: { otp, expirationTime } },
        { upsert: true }
    );
};

const verifyOTP = async (email, otp) => {
    const db = client.db('otpDB');
    const otpCollection = db.collection('otps');
    const record = await otpCollection.findOne({ email });

    if (record && record.otp === otp && record.expirationTime > new Date()) {
        return true;
    }

    return false;
};

module.exports = { generateOTP, storeOTP, verifyOTP };
