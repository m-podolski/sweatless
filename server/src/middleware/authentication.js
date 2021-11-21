import passportJWT from "passport-jwt";
import config from "../config/main.js";
import { AuthenticationError } from "../config/errors.js";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

export default function jwt(passport) {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.auth.jwtSecret,
        jsonWebTokenOptions: {
          maxAge: config.auth.jwtExpS,
        },
      },
      (jwtPayload, done) => {
        const user = jwtPayload;
        const expDate = new Date(jwtPayload.exp * 1000);
        if (expDate < new Date()) {
          return done(new AuthenticationError("USER", ["token"]), false);
        }
        return done(null, user);
      },
    ),
  );
}
