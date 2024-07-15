var sessions = require("express-session");
const cookieParser = require('cookie-parser');

module.exports = {
    init: () => {
        return sessions({
            secret: process.env.SESSION_SECRET,
            saveUninitialized: true,
            cookie: { secure: false, maxAge: 1800 * 1000 }, // 30 minutes
            resave: false,
            httpOnly: true,  // dont let browser javascript access cookie ever
        });
    },
    creatSession: function (session, mail, role, id) {
        console.log("mail", mail)
        console.log("session", session)
        session.user_mail = mail;
        session.user_role = role;
        session.user_id = id;
        session.save(function (err) {
            console.log(err);
        });
        return session;
    },
    isConnected: (session, role) => {
        if (!session.user_mail || session.user_mail === undefined) return false;
        if (role && session.user_role !== role) return false;
        return true;
    },
    deleteSession: function (session) {
        session.destroy();
    },
};
