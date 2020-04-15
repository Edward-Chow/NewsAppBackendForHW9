/* eslint-disable no-restricted-syntax */
import express from 'express';
import axios from 'axios';

const GUARDIAN_API = 'd02e6690-9ed2-40a4-92b7-6eab52868bbf';
const router = express.Router();

function filterData(articles, search) {
  const toJsonArr = [];
  for (const article of articles) {
    const newArticle = {};
    newArticle.title = article.webTitle;
    try {
      const { assets } = article.blocks.main.elements['0'];
      newArticle.image = assets[assets.length - 1].file;
    } catch (err) {
      newArticle.image = '';
    }
    newArticle.id = article.id;
    newArticle.url = article.webUrl;
    newArticle.section = article.sectionName;
    newArticle.date = article.webPublicationDate;
    toJsonArr.push(newArticle);
    if (search && toJsonArr.length === 10) break;
  }
  return toJsonArr;
}

module.exports = () => {
  router.get('/', (req, res) => {
    axios
      .get(
        `https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key=${GUARDIAN_API}`
      )
      .then(response => {
        const newsCards = [];
        const articleList = response.data.response.results;
        for (const article of articleList) {
          const card = {};
          try {
            card.image = article.fields.thumbnail;
          } catch (err) {
            card.image = '';
          }
          card.id = article.id;
          card.title = article.webTitle;
          card.url = article.webUrl;
          card.date = article.webPublicationDate;
          card.section = article.sectionName;
          newsCards.push(card);
        }
        res.json(newsCards);
      })
      .catch(err => {
        console.log(err);
      });
  });

  router.get('/:section', (req, res) => {
    axios
      .get(
        `https://content.guardianapis.com/${req.params.section}?api-key=${GUARDIAN_API}&show-blocks=all`
      )
      .then(response => {
        res.json(filterData(response.data.response.results, false));
      })
      .catch(err => {
        console.log(err);
      });
  });

  router.get('/articles/:articleId(*)', (req, res) => {
    axios
      .get(
        `https://content.guardianapis.com/${req.params.articleId}?api-key=${GUARDIAN_API}&show-blocks=all`
      )
      .then(response => {
        const articleDetails = {};
        const articleContent = response.data.response.content;
        articleDetails.id = req.params.articleId;
        articleDetails.title = articleContent.webTitle;
        try {
          const { assets } = articleContent.blocks.main.elements['0'];
          articleDetails.image = assets[assets.length - 1].file;
        } catch (err) {
          articleDetails.image = '';
        }
        articleDetails.section = articleContent.sectionName;
        articleDetails.url = articleContent.webUrl;
        articleDetails.date = articleContent.webPublicationDate;
        try {
          for (const b of articleContent.blocks.body) {
            articleDetails.description += b.bodyHtml;
          }
        } catch (err) {
          articleDetails.description = '';
        }
        res.json(articleDetails);
      })
      .catch(err => {
        console.log(err);
      });
  });

  router.get('/search/:keyword', (req, res) => {
    axios
      .get(
        `https://content.guardianapis.com/search?q=${req.params.keyword}&api-key=${GUARDIAN_API}&show-blocks=all`
      )
      .then(response => {
        res.json(filterData(response.data.response.results, true));
      })
      .catch(err => {
        console.log(err);
      });
  });

  return router;
};
