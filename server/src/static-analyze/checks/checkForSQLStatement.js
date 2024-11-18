const sqlExpressionRegex = /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE)\b[\s\S]+?;/g;

module.exports = function findSQLStatements(javaCode) {
	const matches = javaCode.match(sqlExpressionRegex);
	return { sqlQueries: matches ? Array.from(new Set(matches)) : [] };
};
