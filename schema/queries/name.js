const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull } = require("graphql");

module.exports = new GraphQLObjectType({
  name: "Name",
  fields: () => {
    //Se usa una función para evitar dependencia cíclica
    const UserType = require("./user");
    const TotalVotesType = require("./totalVotes");
    return {
      id: { type: GraphQLID },
      label: { type: new GraphQLNonNull(GraphQLString) },
      normalizedLabel: { type: GraphQLString },
      description: { type: GraphQLString },
      createdAt: { type: new GraphQLNonNull(GraphQLString) },
      createdBy: {
        type: new GraphQLNonNull(UserType),
        resolve: (name, args, context) => {
          return context.loaders.usersByIds.load(name.createdBy);
        },
      },
      totalVotes: {
        type: TotalVotesType,
        resolve: (name, args, context) => context.loaders.totalVotesByNamesIds.load(name.id),
      },
    };
  },
});
