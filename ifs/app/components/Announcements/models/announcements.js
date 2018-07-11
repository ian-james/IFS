var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');

module.exports = {
  getAnnouncements: (callback) => {
    const q = 'select * from ' + dbcfg.announcements_table + ' ORDER BY updatedAt DESC';
    db.query(q, [], callback); 
  },
  getAnnouncement: (id, callback) => {
    const q = 'select * from ' + dbcfg.announcements_table + ' where id = ?';
    db.query(q, [id], callback);
  },
  createAnnouncement: (fields = [], callback) => {
    const q = 'INSERT INTO ' + dbcfg.announcements_table + ' (title, body, expiryDate) VALUES (?,?,?);'
    db.query(q, fields, callback);
  },
};
