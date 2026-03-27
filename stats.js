const { getCollection } = require('./db');

async function getUserStats(discordId) {
  if (!discordId) return null;

  try {
    const users = await getCollection('users');
    return users.findOne({ discordId });
  } catch (err) {
    console.warn('Unable to fetch user stats:', err?.message || err);
    return null;
  }
}

async function getRecentSessions(discordId, limit = 7) {
  if (!discordId) return [];

  try {
    const sessions = await getCollection('sessions');
    return sessions.find({ discordId }).sort({ start: -1 }).limit(limit).toArray();
  } catch (err) {
    console.warn('Unable to fetch recent sessions:', err?.message || err);
    return [];
  }
}

async function getCommandUsage(discordId) {
  if (!discordId) return [];

  try {
    const commands = await getCollection('command_usage');
    return commands.find({ discordId }).sort({ count: -1 }).toArray();
  } catch (err) {
    console.warn('Unable to fetch command usage:', err?.message || err);
    return [];
  }
}

module.exports = {
  getUserStats,
  getRecentSessions,
  getCommandUsage
};
