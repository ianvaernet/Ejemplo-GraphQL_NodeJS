const { GraphQLUnionType } = require("graphql");
const Contest = require("./contest");
const Name = require("./name");

module.exports = new GraphQLUnionType({
  name: "Activity",
  types: [Contest, Name],
  resolveType: (value) => (value.activityType === "Contest" ? Contest : Name),
});
