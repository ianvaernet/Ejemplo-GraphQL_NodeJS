const { GraphQLObjectType } = require("graphql");
const createContest = require("./createContest");
const createName = require("./createName");

module.exports = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    createContest,
    createName,
  },
});
