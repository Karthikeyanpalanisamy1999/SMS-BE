// src\models\utils\customIdGenerator.js
const mongoose = require('mongoose')
const config = require('../config/mongoose')

async function connectToMongoDB() {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(config.mongoDbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        throw error
    }
}

async function generateCustomIDs(prefix, model, seqFieldName) {
    try {
        await connectToMongoDB()
        const countersCollection = mongoose.connection.collection('counters')

        const counter = await countersCollection.findOneAndUpdate(
            { id: seqFieldName },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        )

        if (counter) {
            const sequenceNumber = counter.seq
            const customIDNumber = sequenceNumber
            const customIDReference = `${prefix}${sequenceNumber}`
            return { customIDNumber, customIDReference }
        } else {
            throw new Error('Failed to update or insert counter document.')
        }
    } catch (error) {
        console.error(`Error generating custom IDs for ${model}:`, error)
        throw error
    }
}

module.exports = {
    connectToMongoDB,
    generateCustomIDs,
}
