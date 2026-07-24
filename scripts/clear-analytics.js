const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearAnalytics() {
  console.log('Clearing all existing analytics data...');
  
  // Delete in correct order (child tables first due to foreign keys)
  const events = await prisma.analyticsEvent.deleteMany({});
  console.log(`  Deleted ${events.count} events`);
  
  const pageViews = await prisma.analyticsPageView.deleteMany({});
  console.log(`  Deleted ${pageViews.count} page views`);
  
  const sessions = await prisma.analyticsSession.deleteMany({});
  console.log(`  Deleted ${sessions.count} sessions`);
  
  const visitors = await prisma.analyticsVisitor.deleteMany({});
  console.log(`  Deleted ${visitors.count} visitors`);
  
  console.log('\n✅ All analytics data cleared. Dashboard will now show real data only.');
  await prisma.$disconnect();
}

clearAnalytics().catch(console.error);
