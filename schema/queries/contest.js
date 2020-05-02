const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLList,
} = require("graphql");
const Name = require("./name");

module.exports = new GraphQLObjectType({
  name: "Contest",
  fields: {
    id: { type: GraphQLID },
    code: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    status: {
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: "ContestStatusType",
          values: {
            DRAFT: { value: "draft" },
            PUBLISHED: { value: "published" },
            ARCHIVED: { value: "archived" },
          },
        })
      ),
    },
    names: {
      type: new GraphQLList(Name),
      resolve: (contest, args, context) => {
        return context.loaders.namesByContestsIds.load(contest.id);
      },
    },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
  },
});
