
import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID || 'mock',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'mock',
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile'],
}, (accessToken: string, refreshToken: string, profile: any, done: any) => {
    return done(null, profile);
}));

export default passport;
