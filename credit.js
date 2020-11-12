const { Db } = require("mongodb");

class Credit {
    
    /**
     * Add credit
     * @param {Db} db 
     * @param {string} refId 
     * @param {number} credit 
     */
    static async Add(db, refId, credit) {
        try {
            await db.collection('credits').updateOne({ id: refId }, { $inc: { credit: credit } });
            await this._addAuditLog(db, new Date(), refId, "ADD", credit);
        }
        catch (ex) {
            throw ex;
        }
    }
    /**
     * Substract credit
     * @param {Db} db 
     * @param {string} refId 
     * @param {number} credit 
     */
    static async Substract(db, refId, credit) {
        credit = -1 * credit;
        try {
            await db.collection('credits').updateOne({ id: refId }, { $inc: { credit: credit } });
            await this._addAuditLog(db, new Date(), refId, "SUBSTRACT", credit);
        }
        catch (ex) {
            throw ex;
        }
    }

    /**
     * Add audit info.
     * @param {Db} db 
     * @param {Date} date 
     * @param {string} refId 
     * @param {string} type 
     * @param {number} credit 
     */
    static async _addAuditLog(db, date, refId, type, credit) {
        try {
            await db.collection('audit').insertOne({ date: date, refId: refId, type: type, credit: credit });
        }
        catch (ex) {
            throw ex;
        }
    }
}

module.exports = Credit;