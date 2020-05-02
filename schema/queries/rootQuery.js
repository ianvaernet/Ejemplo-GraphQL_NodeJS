const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require("graphql");
const User = require("./user");

module.exports = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    user: {
      type: User,
      description: "User identified by api key",
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (obj, args, context) => {
        return context.loaders.usersByApiKeys.load(args.key);
      },
    },
  },
});
