const { Db } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

class MongoUtil {
    /**
     * 
     * @param {string} uri 
     * @param {string} db 
     */
    constructor(uri, db) {
        this._uri = uri;
        this._db = db;
        this._client = null;
    }
    /**
     * Get DB object.
     * @returns {Promise<Db>}
     */
    async GetDb() {
        if (!this._client){
            this._client = new MongoClient(this._uri, { useNewUrlParser: true });
            await this._client.connect();
        }
        return this._client.db('credit');
    }
    /**
     * Close the connection
     */
    async Close() {
        if (this._client)
            this._client.close();
    }
}
module.exports = MongoUtil;