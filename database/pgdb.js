const humps = require("humps");
const { orderedFor, slug } = require("../lib/util");

module.exports = (pgPool) => {
  return {
    getUsersByIds(ids) {
      return pgPool
        .query(
          `SELECT * FROM users
            WHERE id = ANY($1)`,
          [ids]
        )
        .then((res) => {
          return orderedFor(humps.camelizeKeys(res.rows), ids, "id", true);
        });
    },

    getUsersByApiKeys(apiKeys) {
      return pgPool
        .query(
          `SELECT * FROM users
            WHERE api_key = ANY($1)`,
          [apiKeys]
        )
        .then((res) => {
          return orderedFor(humps.camelizeKeys(res.rows), apiKeys, "apiKey", true);
        });
    },

    getContestsByUsersIds(usersIds) {
      return pgPool
        .query(
          `SELECT * FROM contests
              WHERE created_by = ANY($1)`,
          [usersIds]
        )
        .then((res) => {
          return orderedFor(humps.camelizeKeys(res.rows), usersIds, "createdBy", false);
        });
    },

    getNamesByContestsIds(contestsIds) {
      return pgPool
        .query(
          `SELECT * FROM names
              WHERE contest_id = ANY($1)`,
          [contestsIds]
        )
        .then((res) => {
          return orderedFor(humps.camelizeKeys(res.rows), contestsIds, "contestId", false);
        });
    },

    getTotalVotesByNamesIds(namesIds) {
      return pgPool
        .query(
          `SELECT * FROM total_votes_by_name
              WHERE name_id = ANY($1)`,
          [namesIds]
        )
        .then((res) => {
          return orderedFor(humps.camelizeKeys(res.rows), namesIds, "nameId", true);
        });
    },

    createContest({ apiKey, title, description }) {
      return pgPool
        .query(
          `INSERT INTO contests (code, title, description, created_by)
          VALUES ($1, $2, $3, (SELECT id FROM users WHERE api_key = $4))
          RETURNING *`,
          [slug(title), title, description, apiKey]
        )
        .then((res) => humps.camelizeKeys(res.rows[0]));
    },

    createName({ apiKey, contestId, label, description }) {
      return pgPool
        .query(
          `INSERT INTO names (contest_id, label, normalized_label, description, created_by)
          VALUES ($1, $2, $3, $4, (SELECT id FROM users WHERE api_key = $5))
          RETURNING *`,
          [contestId, label, slug(label), description, apiKey]
        )
        .then((res) => humps.camelizeKeys(res.rows[0]));
    },

    getActivitiesByUsersIds(usersIds) {
      return pgPool
        .query(
          `SELECT created_by, created_at, label, '' AS title, 'Name' as activity_type
        FROM names
        WHERE created_by = ANY($1)
        UNION
        SELECT created_by, created_at, '' AS label, title, 'Contest' as activity_type
        FROM contests
        WHERE created_by = ANY($1)`,
          [usersIds]
        )
        .then((res) => orderedFor(humps.camelizeKeys(res.rows), usersIds, "createdBy", false));
    },
  };
};
