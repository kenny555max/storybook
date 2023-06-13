const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/user.js');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            //console.log(profile);
            const { id, displayName, name, photos } = profile;

            const newUser = {
                googleId: id,
                displayName: displayName,
                firstName: name.givenName,
                lastName: name.familyName,
                profileImage: photos[0].value
            };

            try {
                let user = await User.findOne({ googleId: id });

                if (user) {
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (error) {
                console.log(error);
            }
        }
    ));

    passport.serializeUser(function (user, done) { done(null, user) });
    passport.deserializeUser(function (user, done) { done(null, user) });
}