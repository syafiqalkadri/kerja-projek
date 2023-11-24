
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://syafiqalkadri28:sapikalkadri123@cluster0.hjnnumo.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
}
});

async function connectDB() {
    try {
        await client.connect();
        console.log('Terhubung ke database');
    } catch (error) {
        console.error('Gagal terhubung ke database:', error);
    }
}

async function closeDB() {
    try {
        await client.close();
        console.log('Koneksi ke database ditutup');
    } catch (error) {
        console.error('Gagal menutup koneksi ke database:', error);
    }
}

module.exports = { connectDB, closeDB, client };