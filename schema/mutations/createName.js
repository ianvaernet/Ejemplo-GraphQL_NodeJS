const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");
const pgdb = require("../../database/pgdb");
const Name = require("../queries/name");

const NameInputType = new GraphQLInputObjectType({
  name: "NameInput",
  fields: {
    apiKey: { type: new GraphQLNonNull(GraphQLString) },
    contestId: { type: GraphQLID },
    label: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
  },
});

module.exports = {
  type: Name,
  args: {
    input: { type: new GraphQLNonNull(NameInputType) },
  },
  resolve: (obj, args, context) => {
    return pgdb(context.pgPool).createName(args.input);
  },
};
