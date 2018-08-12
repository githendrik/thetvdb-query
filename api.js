const request = require("request");

const search = (show = "", authToken = "") =>
  new Promise((resolve, reject) => {
    if (show.length === 0 || authToken.length === 0) {
      reject("Show and Token params required");
    } else {
      request(
        {
          url: `https://api.thetvdb.com/search/series?name=${show}`,
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        },
        (err, response, body) => {
          const r = JSON.parse(body);
          if (err) {
            reject(err);
          } else if (r.Error) {
            reject(r.Error);
          } else {
            resolve(JSON.parse(body).data[0]);
          }
        }
      );
    }
  });

const getEpisodes = (showId = "", authToken = "") =>
  new Promise((resolve, reject) => {
    if (showId.length === 0 || authToken.length === 0) {
      reject("ShowId and Token params required");
    } else {
      request(
        {
          url: `https://api.thetvdb.com/series/${showId}/episodes/query?airedEpisode=1`,
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        },
        (err, response, body) => {
          if (err) {
            reject(err);
          } else {
            const results = JSON.parse(body);

            if (results.Error) {
              // No hits
            } else {
              resolve(
                results.data.filter(ep => ep.airedSeason > 0).map(ep => ({
                  title: ep.episodeName,
                  season: ep.airedSeason,
                  episode: ep.airedEpisodeNumber,
                  aired: ep.firstAired
                }))
              );
            }
          }
        }
      );
    }
  });

module.exports = {
  search,
  getEpisodes
};
