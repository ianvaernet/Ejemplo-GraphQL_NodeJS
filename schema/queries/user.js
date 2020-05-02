const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
} = require("graphql");
const Contest = require("./contest");
const Activity = require("./activity");

module.exports = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    fullName: { type: GraphQLString, resolve: (obj) => `${obj.lastName}, ${obj.firstName}` },
    createdAt: { type: GraphQLString },
    contests: {
      type: new GraphQLList(Contest),
      resolve: (user, args, context) => {
        return context.loaders.contestsByUsersIds.load(user.id);
      },
    },
    contestsCount: {
      type: GraphQLInt,
      resolve: (user, args, context, { fieldName }) => {
        return context.loaders.mdb.usersByIds.load(user.id).then((res) => res[fieldName]);
      },
    },
    namesCount: {
      type: GraphQLInt,
      resolve: (user, args, context, { fieldName }) => {
        return context.loaders.mdb.usersByIds.load(user.id).then((res) => res[fieldName]);
      },
    },
    votesCount: {
      type: GraphQLInt,
      resolve: (user, args, context, { fieldName }) => {
        return context.loaders.mdb.usersByIds.load(user.id).then((res) => res[fieldName]);
      },
    },
    activities: {
      type: new GraphQLList(Activity),
      resolve: (user, args, context) => context.loaders.activitiesByUsersIds.load(user.id),
    },
  },
});
