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
  const reqMe = `${req.user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone,location,friends`;
  graph.get(reqMe, (err: Error, respMe: graphObjs.IFacebookAPIUserResponse) => {
    if (err) { return next(err); }

    const respFriends: graphObjs.IFacebookAPIUserResponse[] = [];
    // any friends use this app?
    let friendsCounter = 0;
    if (respMe.friends && respMe.friends.data.length > 0) {
      respMe.friends.data.forEach(f => {
        friendsCounter ++;
        const reqFr = `${f.id}?fields=id,name,location`;
        graph.get(reqFr, (err: Error, respFr: graphObjs.IFacebookAPIUserResponse) => {
          if (err) { return next(err); }

          respFriends.push(respFr);

          // if done fetching users then render
          if (friendsCounter === respMe.friends.data.length) {
            res.render("api/facebook", {
              title: "Facebook API",
              reqMe: reqMe,
              profile: respMe,
              reqFr: reqFr,
              respFriends: respFriends,
              noOfFriends: respMe.friends.data.length
            });
          }
        });
      });
    }
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
    let friendsCounter = 0;
    if (respMe.friends && respMe.friends.data.length > 0) {
      respMe.friends.data.forEach(f => {
        friendsCounter ++;
        const reqFr = `${f.id}?fields=id,name,location`;
        graph.get(reqFr, (err: Error, respFr: graphObjs.IFacebookAPIUserResponse) => {
          if (err) { return next(err); }

          respFriends.push(respFr);

          // if done fetching users then render
          if (friendsCounter === respMe.friends.data.length) {
            res.render("api/facebook/fbresp", {
              title: "Facebook Data",
              reqMe: reqMe,
              respMe: respMe,
              reqFr: reqFr,
              respFriends: respFriends
            });
          }
        });
      });
    }
  });
};

