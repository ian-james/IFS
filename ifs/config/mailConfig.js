/**
 * @file mailConfig.js
 * @brief This file contains basic set-up configurations for nodemailer with a
 *        postfix server running on local host. You may change the
 *        configuration here to use an external STMP server as you choose.
 **/
var nodemailer = require('nodemailer');

// create transporter object for SMTP transport
var transport_cfg = {
    host: 'localhost',
    //port: 25, //465 for SSL (secure) connection
    //secure: false, //default
    // auth : { user: 'user@example.com', pass: 'password' }
}
var transporter = nodemailer.createTransport(transport_cfg);

// create the host for links referrals
var host = 'ifs.example.com';

// set up message template;
// USAGE:
// var mailcfg = require(__configs + 'mailConfig');
// var msg = mailcfg.message
// msg[to] = 'user@email.addr';
// msg[subject] = 'Subject';
// msg[text] = 'plain-text body';
// msg[html] = '<p>html body</p>';
// transporter.sendMail(msg, callback());
var message = {
    from: '"Immediate Feedback System Mailer" <noreply@ifs.example.com>',
}

module.exports.transporter = transporter;
module.exports.message = message;
