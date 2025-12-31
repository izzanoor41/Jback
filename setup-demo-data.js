#!/usr/bin/env node

/**
 * SETUP DEMO DATA FOR HACKATHON
 * Membuat data demo yang diperlukan untuk testing
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupDemoData() {
  console.log('🚀 Setting up demo data for hackathon...');
  
  try {
    // 1. Create demo user
    console.log('👤 Creating demo user...');
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@hackathon.com' },
      update: {},
      create: {
        id: 'demo-user',
        email: 'demo@hackathon.com',
        name: 'Demo User',
        emailVerified: new Date(),
      }
    });
    console.log('✅ Demo user created:', demoUser.email);

    // 2. Create demo team
    console.log('🏢 Creating demo team...');
    const demoTeam = await prisma.team.upsert({
      where: { id: 'demo-team' },
      update: {},
      create: {
        id: 'demo-team',
        name: 'Hackathon Demo Team',
        description: 'Demo team for Confluent + Google Cloud Hackathon',
      }
    });
    console.log('✅ Demo team created:', demoTeam.name);

    // 3. Add user to team
    console.log('👥 Adding user to team...');
    await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: demoUser.id,
          teamId: demoTeam.id
        }
      },
      update: {},
      create: {
        teamId: demoTeam.id,
        userId: demoUser.id,
        role: 'OWNER'
      }
    });
    console.log('✅ User added to team');

    // 4. Create demo feedback data
    console.log('📝 Creating demo feedback...');
    
    const demoFeedbacks = [
      {
        id: 'demo-feedback-1',
        originalText: '素晴らしいサービスでした！スタッフの対応がとても丁寧で感動しました。',
        rate: 5,
        detectedLanguage: 'ja',
        translatedText: 'It was a wonderful service! I was impressed by the very polite response of the staff.',
        sentiment: 'positive',
        culturalNotes: 'Japanese customers use indirect communication and high praise indicates genuine satisfaction',
        summary: 'Highly satisfied Japanese customer praising service quality and staff politeness',
        streamSource: 'demo'
      },
      {
        id: 'demo-feedback-2',
        originalText: 'Der Service war akzeptabel, aber die Lieferzeit könnte verbessert werden. Ich erwarte präzisere Informationen.',
        rate: 3,
        detectedLanguage: 'de',
        translatedText: 'The service was acceptable, but the delivery time could be improved. I expect more precise information.',
        sentiment: 'neutral',
        culturalNotes: 'German customers are direct and precise - moderate rating with detailed feedback indicates engagement',
        summary: 'German customer providing constructive feedback on delivery and communication',
        streamSource: 'demo'
      },
      {
        id: 'demo-feedback-3',
        originalText: 'الخدمة ممتازة والفريق محترف جداً. شكراً لكم على الاهتمام الكبير!',
        rate: 5,
        detectedLanguage: 'ar',
        translatedText: 'The service is excellent and the team is very professional. Thank you for your great attention!',
        sentiment: 'positive',
        culturalNotes: 'Arabic speakers show high appreciation when satisfied - relationship-building opportunity',
        summary: 'Very satisfied Arabic customer expressing gratitude and appreciation',
        streamSource: 'demo'
      },
      {
        id: 'demo-feedback-4',
        originalText: 'Pelayanannya lumayan sih, tapi mungkin bisa lebih cepat lagi ya. Terima kasih.',
        rate: 4,
        detectedLanguage: 'id',
        translatedText: 'The service is pretty good, but maybe it could be faster. Thank you.',
        sentiment: 'positive',
        culturalNotes: 'Indonesian customers avoid direct criticism - "lumayan" may indicate areas for improvement',
        summary: 'Indonesian customer providing polite feedback with subtle improvement suggestions',
        streamSource: 'demo'
      }
    ];

    for (const feedback of demoFeedbacks) {
      await prisma.feedback.upsert({
        where: { id: feedback.id },
        update: {},
        create: {
          ...feedback,
          teamId: demoTeam.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
    console.log(`✅ Created ${demoFeedbacks.length} demo feedback entries`);

    // 5. Create cultural insights
    console.log('🧠 Creating cultural insights...');
    
    const culturalInsights = [
      {
        id: 'insight-1',
        teamId: demoTeam.id,
        language: 'ja',
        region: 'Japan',
        insightType: 'communication_style',
        insight: 'Japanese customers use indirect communication and high praise indicates genuine satisfaction',
        confidence: 0.95,
        createdAt: new Date()
      },
      {
        id: 'insight-2',
        teamId: demoTeam.id,
        language: 'de',
        region: 'Germany',
        insightType: 'communication_style',
        insight: 'German customers are direct and precise - moderate rating with detailed feedback indicates engagement',
        confidence: 0.92,
        createdAt: new Date()
      }
    ];

    for (const insight of culturalInsights) {
      await prisma.culturalInsight.upsert({
        where: { id: insight.id },
        update: {},
        create: insight
      });
    }
    console.log(`✅ Created ${culturalInsights.length} cultural insights`);

    console.log('\n🎉 DEMO DATA SETUP COMPLETE!');
    console.log('📊 Summary:');
    console.log(`   👤 Users: 1`);
    console.log(`   🏢 Teams: 1`);
    console.log(`   📝 Feedback: ${demoFeedbacks.length}`);
    console.log(`   🧠 Cultural Insights: ${culturalInsights.length}`);
    console.log('\n🚀 Ready for hackathon demo!');

  } catch (error) {
    console.error('❌ Error setting up demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDemoData();