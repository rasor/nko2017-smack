"use strict";

import * as async from "async";
import * as request from "request";
import * as graph from "fbgraph";
import * as graphObjs from "facebook";
import { Response, Request, NextFunction } from "express";


/**
 * GET /api
 * List of API examples.
 */
export let getApi = (req: Request, res: Response) => {
  res.render("api/index", {
    title: "API Examples"
  });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
export let getFacebook = (req: Request, res: Response, next: NextFunction) => {
  const token = req.user.tokens.find((token: any) => token.kind === "facebook");
  graph.setAccessToken(token.accessToken);
  graph.get(`${req.user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err: Error, results: graphObjs.IFacebookAPIUserResponse) => {
    if (err) { return next(err); }
    res.render("api/facebook", {
      title: "Facebook API",
      profile: results
    });
  });
};

/**
 * GET /api/facebook/fbresp
 * testing data from FB.
 */
export let getFbResp = (req: Request, res: Response, next: NextFunction) => {
  const token = req.user.tokens.find((token: any) => token.kind === "facebook");
  graph.setAccessToken(token.accessToken);
  const reqMe = `${req.user.facebook}?fields=id,name,location,friends,gender`;
  graph.get(reqMe, (err: Error, respMe: graphObjs.IFacebookAPIUserResponse) => {
    if (err) { return next(err); }

    const respFriends: graphObjs.IFacebookAPIUserResponse[] = [];
    // any friends use this app?
    // if (respMe.friends && respMe.friends.data.length > 0) {
    //   respMe.friends.data.forEach(f => {
    //     const reqFr = `${f.id}?location`;
    //     graph.get(reqFr, (err: Error, respFr: graphObjs.IFacebookAPIUserResponse) => {
    //       if (err) { return next(err); }

    //       respFriends.push(respFr);
    //     });
    //   });
    // }

    res.render("api/facebook/fbresp", {
      title: "Facebook Data",
      reqMe: reqMe,
      respMe: respMe,
      respFriends: respFriends
    });
  });
};

