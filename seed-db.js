require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Please set MONGODB_URI in your .env file.');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db();
  const users = db.collection('users');
  const dailyStats = db.collection('daily_stats');
  const sessions = db.collection('sessions');
  const commandUsage = db.collection('command_usage');

  const discordId = '123456789012345678';
  const sampleUser = {
    discordId,
    username: 'ExampleUser',
    avatar: '123abc456def789ghi',
    premium: true,
    email: 'user@example.com',
    roles: ['Student', 'Premium Member'],
    plan_expiry: '2026-04-15',
    goal_hours: 120,
    total_sessions: 28,
    total_hours: 84.5,
    streak: 5,
    longest_streak: 12
  };

  const sampleDailyStats = [
    { discordId, date: '2026-03-14', hours: 1.5 },
    { discordId, date: '2026-03-15', hours: 2 },
    { discordId, date: '2026-03-16', hours: 2.75 },
    { discordId, date: '2026-03-17', hours: 1.25 },
    { discordId, date: '2026-03-18', hours: 3 },
    { discordId, date: '2026-03-19', hours: 2.5 },
    { discordId, date: '2026-03-20', hours: 2 },
    { discordId, date: '2026-03-21', hours: 3.5 },
    { discordId, date: '2026-03-22', hours: 4 },
    { discordId, date: '2026-03-23', hours: 1.5 },
    { discordId, date: '2026-03-24', hours: 2.25 },
    { discordId, date: '2026-03-25', hours: 3 },
    { discordId, date: '2026-03-26', hours: 2.75 },
    { discordId, date: '2026-03-27', hours: 4.25 }
  ];

  const sampleSessions = [
    {
      discordId,
      start: new Date('2026-03-27T18:30:00Z'),
      durationMinutes: 55,
      activity: 'Focus study',
      notes: 'Completed chapter 3 review'
    },
    {
      discordId,
      start: new Date('2026-03-26T16:15:00Z'),
      durationMinutes: 40,
      activity: 'Quiz practice',
      notes: 'Worked on flashcards'
    },
    {
      discordId,
      start: new Date('2026-03-25T14:00:00Z'),
      durationMinutes: 65,
      activity: 'Group session',
      notes: 'Team review and notes'
    },
    {
      discordId,
      start: new Date('2026-03-24T19:20:00Z'),
      durationMinutes: 30,
      activity: 'Quick recap',
      notes: 'Vocabulary drills'
    },
    {
      discordId,
      start: new Date('2026-03-23T09:45:00Z'),
      durationMinutes: 70,
      activity: 'Deep work',
      notes: 'Problem solving practice'
    },
    {
      discordId,
      start: new Date('2026-03-22T20:00:00Z'),
      durationMinutes: 50,
      activity: 'Planning',
      notes: 'Goal setting and review'
    },
    {
      discordId,
      start: new Date('2026-03-21T17:10:00Z'),
      durationMinutes: 45,
      activity: 'Active recall',
      notes: 'Memorized formulas'
    }
  ];

  const sampleCommandUsage = [
    { discordId, command: 'study', count: 84, successRate: 0.97 },
    { discordId, command: 'timer', count: 68, successRate: 0.99 },
    { discordId, command: 'quiz', count: 42, successRate: 0.93 },
    { discordId, command: 'stats', count: 34, successRate: 0.96 },
    { discordId, command: 'help', count: 18, successRate: 0.88 }
  ];

  await users.updateOne(
    { discordId },
    { $set: sampleUser },
    { upsert: true }
  );

  for (const entry of sampleDailyStats) {
    await dailyStats.updateOne(
      { discordId: entry.discordId, date: entry.date },
      { $set: entry },
      { upsert: true }
    );
  }

  for (const session of sampleSessions) {
    await sessions.updateOne(
      { discordId: session.discordId, start: session.start },
      { $set: session },
      { upsert: true }
    );
  }

  for (const command of sampleCommandUsage) {
    await commandUsage.updateOne(
      { discordId: command.discordId, command: command.command },
      { $set: command },
      { upsert: true }
    );
  }

  console.log('Seed data inserted/updated successfully.');
  await client.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
