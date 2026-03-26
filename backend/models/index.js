const User = require('./User');
const Branch = require('./Branch');
const Token = require('./Token');
const QueueLog = require('./QueueLog');

// Associations
User.hasMany(Token, { foreignKey: 'user_id', as: 'tokens' });
Token.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Branch.hasMany(Token, { foreignKey: 'branch_id', as: 'tokens' });
Token.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

Token.hasOne(QueueLog, { foreignKey: 'token_id', as: 'log' });
QueueLog.belongsTo(Token, { foreignKey: 'token_id', as: 'token' });

Branch.hasMany(QueueLog, { foreignKey: 'branch_id', as: 'logs' });
QueueLog.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

module.exports = { User, Branch, Token, QueueLog };
