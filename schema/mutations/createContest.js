const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } = require("graphql");
const pgdb = require("../../database/pgdb");
const Contest = require("../queries/contest");

const ContestInputType = new GraphQLInputObjectType({
  name: "ContestInput",
  fields: {
    apiKey: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
  },
});

module.exports = {
  type: Contest,
  args: {
    input: { type: new GraphQLNonNull(ContestInputType) },
  },
  resolve: (obj, args, context) => {
    return pgdb(context.pgPool).createContest(args.input);
  },
};
