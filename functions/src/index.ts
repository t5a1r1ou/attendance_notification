import * as functions from "firebase-functions";
import * as express from "express";
import * as line from "@line/bot-sdk";


const firebaseConfig = functions.config();

const config = {
  channelSecret: firebaseConfig.config.channelsecret,
  channelAccessToken: firebaseConfig.config.channelaccesstoken,
};

const app = express();

app.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);
  Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

const handleEvent = async (event: any) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: event.message.text, // 実際に返信の言葉を入れる箇所
  });
};

exports.app = functions.https.onRequest(app);
