const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
const { sendMail } = require('./public/mailer');
const { generateOTP, storeOTP, verifyOTP } = require('./public/otpUtils'); // Your OTP utility file
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Add this line to handle JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
connectToMongoDB();
// Function to get the next ID for a collection
async function getLastSeqValue(semester) {
    const db = client.db(semester);
    const countersCollection = db.collection('counters');

    try {
        // Find all documents in the counters collection, sorted by insertion order
        const cursor = countersCollection.find().sort({ $natural: -1 }).limit(1);
        const result = await cursor.next();

        if (result) {
            const seqValue = result.seq;
            return seqValue;
        } else {
            // If no documents exist in the collection or seq is not defined, return null
            return 0;
        }
    } catch (error) {
        return null;
    }
}
async function searchData(collectionName, searchData, dbName) {
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Search for the data
        const result = await collection.findOne(searchData);

        if (result) {
            return true; // Data found
        } else {
            return false; // Data not found
        }
    } finally {
        await client.close();
    }
}
app.post('/addBookInLibr', async (req, res) => {
    try {
        const bookId = req.body.bookCode;
        const authorName = req.body.authorName;
        const subjectName = req.body.subjectName;
        const price = req.body.price;
        const db = client.db('allBook');
        const bookCollection = db.collection('counters');
        const found = await searchData('counters', { bookId: bookId, }, 'allBook');
        if (found) {
            await bookCollection.deleteOne({ bookId: bookId });
            res.send(`book ${bookId} deleted from library!`);
        }
        else {
            getLastSeqValue('allBook')
                .then(async seq => {
                    seq++;
                    // You can store seqValue in a variable or perform further operations with it
                    await bookCollection.insertOne({ seq, bookId, authorName, subjectName, price, availble: 'yes' });
                })
                .catch(error => {
                });
            res.send(`Book ${bookId} add in library successfully!`);
        }
    }
    catch (error) {
        res.status(500).send('An error occurred while processing the request.');
    }

});
app.post('/issuebook', async (req, res) => {
    try {
        const semestr = req.body.add_semester;
        const db = client.db(semestr);
        const studentName = req.body.studentName;
        const bookId = req.body.bookId;
        // const authorName = req.body.authorName;
        // const subjectName = req.body.subjectName;
        const mycollection = db.collection(studentName);
        if (!studentName || !bookId) {
            res.status(400).send('Student name and book ID are required.');
            return;
        }
        const found = await searchData(studentName, { bookId: bookId }, semestr);
        if (found) {
            await mycollection.deleteOne({ bookId: bookId });
            const book = client.db('allBook');
            const bookCollection = book.collection('counters');
            await bookCollection.updateOne({ bookId: bookId }, { $set: { availble: 'yes' } });
            res.send(`Book ${bookId} submitted successfully by ${studentName} for semester ${semestr}`);
        } else {
            const bookInLibrary = await searchData('counters', { bookId: bookId }, 'allBook');
            if (!bookInLibrary) {
                res.send(`Book ${bookId} is not present in the library.`);
                return;
            } else {
                // const status = await searchData('counters', { bookId: bookId }, 'allBook');
                // if (status) {
                if (await searchData('counters', { bookId: bookId, availble: 'yes' }, 'allBook')) {
                    const date = new Date();
                    const bookdata = client.db('allBook');
                    const bookDataCollection = bookdata.collection('counters');
                    const result = await bookDataCollection.findOne({ bookId: bookId });
                    const { authorName, subjectName } = result;
                    
                    if ( await searchData('counters', { _id: studentName },semestr)) {
                        await mycollection.insertOne({ bookId, authorName, subjectName, date });
                        // Update the "counters" collection to mark the book as unavailable
                        const book = client.db('allBook');
                        const bookCollection = book.collection('counters');
                        await bookCollection.updateOne({ bookId: bookId }, { $set: { availble: 'no' } });
                        res.send(`Book ${bookId} issued successfully to ${studentName} for semester ${semestr}`);
                    }
                    else{
                        res.send(`student ${studentName} is not present in ${semestr}`);
                    }
                } else {
                    res.send(`Book ${bookId} are busy`);
                }
            }
        }
    } catch (error) {
        res.status(500).send('An error occurred while processing the request.');
    }
});


// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const semester = req.body.semester; // Add this line to get the selected semester
        const dbName = semester; // Create database name based on semester
        const collectionName = name; // Using name as collection name, you can modify this as needed
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const up = database.collection('counters');
        const found = await searchData('counters', { _id: name }, semester);
        if (found) {
            await up.deleteOne({ _id: name });
            await database.dropCollection(collectionName);
            res.send(` Semester ${dbName} student: ${name} deleted from library management system successfully!`);
        }
        else {
            getLastSeqValue(semester)
                .then(async seqValue => {
                    var value = seqValue;
                    // You can store seqValue in a variable or perform further operations with it
                    value = value + 1;
                    await up.insertOne({ _id: collectionName, seq: value });
                    // Insert the document with the next ID
                    await collection.insertOne({ idee: value, name, email });
                })
                .catch(error => {
                });
            res.send(` Semester ${dbName} student:${name} add in library management system successfully!`);
        }
    } catch (error) {
        res.status(500).send('An error occurred while submitting data.');
    }
});
app.get('/data/:semester', async (req, res) => {
    try {
        const semester = req.params.semester;
        const dbName = semester; // Use semester as database name
        const db = client.db(dbName);
        const collection = db.collection('counters'); // Use semester as collection name

        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
app.get('/data', async (req, res) => {
    try {
        const db = client.db('allBook');
        const collection = db.collection('counters'); // Use semester as collection name

        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
app.get('/details/:name', async (req, res) => {
    try {
        const semester = req.query.semester; // Get the selected semester from the query parameters
        const dbName = semester; // Use the selected semester as the database name
        const db = client.db(dbName);
        const name = req.params.name;
        const collection = db.collection(name);
        const data = await collection.find({}).skip(1).toArray();
        res.json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
app.get('/find', async (req, res) => {
    try {
        const bookId = req.query.bookId; // Get the book ID from the query parameters
        // Check if bookId is provided
        if (!bookId) {
            res.status(400).send('Book ID is required');
            return;
        }
        const databases = await client.db().admin().listDatabases();
        const results = [];
        let bookFound = false; // Flag to track if the book is found in any collection
        const found = await searchData('counters', { bookId: bookId, availble: 'yes', }, 'allBook');
        // Iterate over each database
        for (const dbInfo of databases.databases) {
            const dbName = dbInfo.name;
            // Skip admin and local databases
            if ((dbName === 'admin' || dbName === 'local') && found) {
                bookFound = true;
                results.push({
                    database: 'allBook',
                    availble: true
                });
                continue;
            }
            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            // Iterate over each collection
            for (const collection of collections) {
                const collectionName = collection.name;
                const collectionData = await db.collection(collectionName).find({ bookId }).toArray();
                // Check if data is present in the collection
                if (collectionData.length > 0 && ! await searchData('counters', { bookId: bookId, availble: 'yes' }, 'allBook')) {
                    bookFound = true;
                    results.push({
                        database: dbName,
                        collection: collectionName,
                        data: collectionData,
                        availble: false
                    });
                    console.log('false part');
                    // break;
                }
                if (bookFound) {
                    break;
                }
            }
            if (bookFound) {
                break;
            }
        }
        // Send the results as a JSON response
        res.json(results);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
