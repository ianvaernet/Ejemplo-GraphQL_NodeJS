const { nodeEnv } = require("./util");
console.log(`Running in ${nodeEnv} mode...`);

const DataLoader = require("dataloader");
const pg = require("pg");
const pgConfig = require("../config/pg")[nodeEnv];
const pgPool = new pg.Pool(pgConfig);
const pgdb = require("../database/pgdb")(pgPool);

const app = require("express")();

const ncSchema = require("../schema");
const graphqlHTTP = require("express-graphql");

const { MongoClient, Logger } = require("mongodb");
const assert = require("assert");
const mConfig = require("../config/mongo")[nodeEnv];

MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);
  const mdb = require("../database/mdb")(mPool);

  app.use("/graphql", (req, res) => {
    const loaders = {
      usersByIds: new DataLoader(pgdb.getUsersByIds),
      usersByApiKeys: new DataLoader(pgdb.getUsersByApiKeys),
      contestsByUsersIds: new DataLoader(pgdb.getContestsByUsersIds),
      namesByContestsIds: new DataLoader(pgdb.getNamesByContestsIds),
      totalVotesByNamesIds: new DataLoader(pgdb.getTotalVotesByNamesIds),
      activitiesByUsersIds: new DataLoader(pgdb.getActivitiesByUsersIds),
      mdb: {
        usersByIds: new DataLoader(mdb.getUsersByIds),
      },
    };
    graphqlHTTP({
      schema: ncSchema,
      graphiql: true,
      context: { pgPool, mPool, loaders },
    })(req, res);
  });

  const PORT = process.env.port || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
