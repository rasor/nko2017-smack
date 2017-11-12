import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  res.redirect("/api/facebook");
  // res.render("home", {
  //   title: "Home"
  // });
};
