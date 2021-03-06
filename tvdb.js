const api = require("./api");
const fs = require("./fs-io");
const subWeeks = require("date-fns/sub_weeks");

const authToken = fs.getToken();

if (!authToken) {
  console.error(
    "No authToken found. Please login to thetvdb first by running npm run login"
  );
  process.exit(1);
}

async function getShow(showName) {
  try {
    const cachedShow = fs.read().find(cache => cache.searchTerm == showName);
    if (cachedShow) {
      console.log(`${showName} => already in cache, skipping`);
      return cachedShow;
    } else {
      const show = await api.search(showName, authToken);
      console.log(
        `Found show for query "${showName}": "${
          show.seriesName
        }", getting episodes`
      );
      const episodes = await api.getEpisodes(show.id, authToken);

      const mappedEpisodes = episodes.map(e => ({
        season: e.airedSeason,
        episode: e.airedEpisodeNumber,
        title: e.episodeName,
        aired: new Date(e.firstAired),
        buzzStart: subWeeks(new Date(e.firstAired), 1)
      }));

      return {
        show: show.seriesName,
        episodes: mappedEpisodes,
        searchTerm: showName
      };
    }
  } catch (e) {
    console.error(`Error while getting Show "${showName}". Error was: ${e}`);
    process.exit(1);
  }
}

async function run() {
  const series = ["Weeds"];

  const promises = [];
  await series.forEach(async function(serie) {
    promises.push(getShow(serie));
  });

  Promise.all(promises).then((...results) => {
    results.forEach(r => {
      fs.write(r);
    });
  });
}

run();
