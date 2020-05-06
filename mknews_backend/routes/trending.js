import express from 'express';
import axios from 'axios';
import googleTrends from 'google-trends-api';

const router = express.Router();

module.exports = () => {
  router.get('/:keyword', (req, res) => {
    googleTrends
      .interestOverTime({ keyword: req.params.keyword, startTime: new Date('2019-06-01') })
      .then(response => {
        let resArr = [];
        let trendArr = JSON.parse(response).default.timelineData;
        for (let item of trendArr) {
          if (item.hasOwnProperty('value')) {
            resArr.push(item.value[0]);
          }
        }
        res.json(resArr);
      })
      .catch(err => {
        console.log(err);
      });
  });
  return router;
};
