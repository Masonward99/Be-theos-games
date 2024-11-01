import { NextFunction, Request, Response } from "express";
import { addAddress, addUser, findAddresses, removeAddress } from "../models/UsersModels";
import bcrypt from "bcryptjs";
import passport from "../passportConfig";

export async function postUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { username, password, email, dob, title, first_name, last_name } =
    req.body;
  try {
    if (!password) return res.status(400).send("password is required");
    password = await bcrypt.hash(password, 10);
    const user = await addUser(
      username,
      password,
      email,
      dob,
      title,
      first_name,
      last_name
    );
    return res.status(201).send({ user });
  } catch (error) {
    next(error);
  }
}

export function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return res.status(500).send({ msg: "Server error" });
    if (!user)
      return res.status(401).send({ msg: "Invalid username or password" });
    req.logIn(user, (err) => {
      if (err) return res.status(500).send({ msg: "Server error" });
      //user data without password field
      const userData = {
        username: user.username,
        title: user.title,
        first_name: user.first_name,
        last_name: user.last_name,
        dob: user.dob,
        email: user.email,
      };
      res.status(200).send({ userData });
    });
  })(req, res, next);
}

export async function postAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { username } = req.params;
  let { postcode, address_line1, city } = req.body;
  try {
    let address = await addAddress(username, address_line1, postcode, city);
    res.status(201).send({ address });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send("Logout succesful");
  });
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
  let { username, review_id } = req.params;
  try {
    await removeAddress(review_id, username)
    res.status(204).send()
  }
  catch (err) {
    next(err)
  }
}

export async function getAddresses(req:Request, res:Response, next:NextFunction) {
  let { username } = req.params;
  try {
    let addresses = await findAddresses(username)
    res.status(200).send({addresses})
  }
  catch (err){next(err)}
}

export async function isUserAuthenticated(req: Request, res: Response, next: NextFunction) {
  //midleware function to check that user is authenticated and is the same as the user in request
  let { username } = req.params;
  if (!req.isAuthenticated()) {
    return res.status(401).send("Need to login to use this endpoint");
  }
  const authUser: any = req.user;
  if (!(username == authUser.username)) {
    return res.status(403).send("Access denied");
  }
  next()
}