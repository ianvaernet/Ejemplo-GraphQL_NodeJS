const { GraphQLSchema } = require("graphql");
const RootQuery = require("./queries/rootQuery");
const RootMutation = require("./mutations/rootMutation");

const ncSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = ncSchema;
