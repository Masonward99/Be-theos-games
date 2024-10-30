import passport from "passport";
import { Strategy  as LocalStrategy } from 'passport-local'
import bcrypt from "bcryptjs";
import db from "./db";

passport.use(
    new LocalStrategy(async (username, password, done) => {
    try {
      const result = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      if (result.rows.length === 0)
        return done(null, false, { message: "Incorrect username" });

      const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
      if (match) return done(null, user);

      return done(null, false, { message: "Incorrect password" });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user:any, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

export default passport
