const _ = require("lodash");

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",

  orderedFor: (data, collection, field, singleObject) => {
    const inGroupsOfField = _.groupBy(data, field);
    return collection.map((element) =>
      singleObject ? inGroupsOfField[element][0] || {} : inGroupsOfField[element] || []
    );
  },

  slug: (str) => str.toLowerCase().replace(/[\s\W-]+/, "-"),
};
