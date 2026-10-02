import { getPayload } from 'payload'
import config from '../payload.config'
import { FALLBACK_CONNECTS } from '../lib/constants/connect-fallbacks'
import 'dotenv/config'

async function seed() {
  console.log('🌱 Starting JMBGM database seeding...')

  if (!process.env.DATABASE_URI) {
    console.error('❌ Error: DATABASE_URI is missing in environment variables.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  // 1. Seed Admin User
  console.log('👤 Checking admin user...')
  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'admin@jmbgm.org',
      },
    },
  })

  if (existingUsers.totalDocs === 0) {
    console.log('➕ Creating default admin user: admin@jmbgm.org')
    await payload.create({
      collection: 'users',
      data: {
        name: 'JMBGM Administrator',
        email: 'admin@jmbgm.org',
        password: 'password123',
        role: 'admin',
      },
    })
    console.log('✅ Admin user created. (Email: admin@jmbgm.org, Password: password123)')
  } else {
    console.log('ℹ️ Admin user already exists.')
  }

  // 2. Seed Pages
  console.log('📄 Checking default pages...')
  const existingPages = await payload.find({
    collection: 'pages',
    limit: 1,
  })

  if (existingPages.totalDocs === 0) {
    console.log('➕ Creating initial Pages...')
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Welcome to JMBGM',
        slug: 'home',
        heroSubtitle: 'Proclaiming truth, building community, and transforming lives through faith.',
        _status: 'published',
        publishedAt: new Date().toISOString(),
      },
    })

    await payload.create({
      collection: 'pages',
      data: {
        title: 'About Our Ministry',
        slug: 'about',
        heroSubtitle: 'Rooted in Christ, devoted to truth, and dedicated to transforming our community.',
        _status: 'published',
        publishedAt: new Date().toISOString(),
      },
    })
    console.log('✅ Default pages created.')
  } else {
    console.log('ℹ️ Pages collection already contains records.')
  }

  // 3. Seed Church Branches (Planted Churches Network)
  console.log('🏛️ Checking Outreaches / Planted Church Campuses...')
  const existingBranches = await payload.find({
    collection: 'outreaches',
    limit: 1,
  })

  let manilaBranchId: string | number | undefined
  let cebuBranchId: string | number | undefined
  let davaoBranchId: string | number | undefined

  if (existingBranches.totalDocs === 0) {
    console.log('➕ Seeding 5 canonical church branches...')
    const branches = [
      {
        name: 'JMBGM - Metro Manila Main Sanctuary',
        slug: 'metro-manila-main',
        branchType: 'Main Sanctuary',
        leadPastor: 'Senior Pastor David & Sarah Santos',
        address: '128 Epifanio de los Santos Ave, Quezon City',
        city: 'Quezon City',
        country: 'Philippines',
        latitude: 14.5995,
        longitude: 120.9842,
        serviceTimes: [
          { day: 'Sunday', time: '10:00 AM', serviceName: 'Main Worship & Word Celebration' },
          { day: 'Wednesday', time: '7:00 PM', serviceName: 'Midweek Word & Corporate Prayer' },
        ],
        contactPhone: '+63 (02) 8123-4567',
        contactEmail: 'manila@jmbgm.org',
        featured: true,
        _status: 'published',
      },
      {
        name: 'JMBGM - Cebu City Campus',
        slug: 'cebu-city-campus',
        branchType: 'Planted Campus',
        leadPastor: 'Pastor Joshua & Grace Mendoza',
        address: 'Gorordo Ave, Cebu Business Park, Cebu City',
        city: 'Cebu City',
        country: 'Philippines',
        latitude: 10.3157,
        longitude: 123.8854,
        serviceTimes: [
          { day: 'Sunday', time: '9:30 AM', serviceName: 'Worship & Word Celebration' },
          { day: 'Friday', time: '6:30 PM', serviceName: 'Visayas Prayer & Revival Gathering' },
        ],
        contactPhone: '+63 (32) 412-8890',
        contactEmail: 'cebu@jmbgm.org',
        featured: true,
        _status: 'published',
      },
      {
        name: 'JMBGM - Davao City Campus',
        slug: 'davao-city-campus',
        branchType: 'Planted Campus',
        leadPastor: 'Pastor Emmanuel & Ruth Dela Cruz',
        address: 'J.P. Laurel Ave, Bajada, Davao City',
        city: 'Davao City',
        country: 'Philippines',
        latitude: 7.1907,
        longitude: 125.4578,
        serviceTimes: [
          { day: 'Sunday', time: '10:00 AM', serviceName: 'Kingdom Harvest Celebration' },
          { day: 'Thursday', time: '7:00 PM', serviceName: 'Mindanao Corporate Intercession' },
        ],
        contactPhone: '+63 (82) 298-7711',
        contactEmail: 'davao@jmbgm.org',
        featured: true,
        _status: 'published',
      },
      {
        name: 'JMBGM - Pampanga Campus',
        slug: 'pampanga-campus',
        branchType: 'Planted Campus',
        leadPastor: 'Pastor Timothy & Faith Navarro',
        address: 'MacArthur Highway, City of San Fernando, Pampanga',
        city: 'San Fernando',
        country: 'Philippines',
        latitude: 15.0794,
        longitude: 120.6200,
        serviceTimes: [
          { day: 'Sunday', time: '9:00 AM', serviceName: 'Sunday Morning Miracle Service' },
          { day: 'Wednesday', time: '6:30 PM', serviceName: 'Luzon Apostolic Prayer Night' },
        ],
        contactPhone: '+63 (45) 961-3420',
        contactEmail: 'pampanga@jmbgm.org',
        featured: true,
        _status: 'published',
      },
      {
        name: 'JMBGM - Singapore International Outreach',
        slug: 'singapore-international',
        branchType: 'Pioneering Outreach',
        leadPastor: 'Missionary Pastor Caleb & Joy Tan',
        address: '10 Anson Road, International Plaza, Downtown',
        city: 'Singapore',
        country: 'Singapore',
        latitude: 1.3521,
        longitude: 103.8198,
        serviceTimes: [
          { day: 'Sunday', time: '3:00 PM', serviceName: 'International Diaspora Fellowship' },
          { day: 'Saturday', time: '7:00 PM', serviceName: 'Apostolic Missions Discipleship' },
        ],
        contactPhone: '+65 6712 3456',
        contactEmail: 'singapore@jmbgm.org',
        featured: true,
        _status: 'published',
      },
    ]

    for (const branch of branches) {
      const created = await payload.create({
        collection: 'outreaches',
        data: branch as any,
      })
      console.log(`  ✨ Created Church Branch: ${branch.name}`)
      if (branch.slug === 'metro-manila-main') manilaBranchId = created.id
      if (branch.slug === 'cebu-city-campus') cebuBranchId = created.id
      if (branch.slug === 'davao-city-campus') davaoBranchId = created.id
    }
    console.log('✅ 5 canonical church branches seeded.')
  } else {
    console.log('ℹ️ Outreaches collection already contains branches.')
    const all = await payload.find({ collection: 'outreaches', limit: 10 })
    for (const b of all.docs as any[]) {
      if (b.slug === 'metro-manila-main') manilaBranchId = b.id
      if (b.slug === 'cebu-city-campus') cebuBranchId = b.id
      if (b.slug === 'davao-city-campus') davaoBranchId = b.id
    }
  }

  // 4. Seed Announcements (Tagged to branches)
  console.log('📢 Checking announcements...')
  const existingAnnouncements = await payload.find({
    collection: 'announcements',
    limit: 1,
  })

  if (existingAnnouncements.totalDocs === 0) {
    console.log('➕ Creating sample announcements with branch tags...')
    
    await payload.create({
      collection: 'announcements',
      data: {
        title: 'Sunday Miracle & Worship Celebration',
        category: 'Sunday Service',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'All Sanctuary Campuses & Global Livestream',
        featured: true,
        branch: null, // All Campuses
        summary:
          'Join us across all church branches for our weekly celebration with dynamic praise, heartfelt prayer, and life-changing ministry of the Word. All are welcome!',
        _status: 'published',
      },
    })

    await payload.create({
      collection: 'announcements',
      data: {
        title: 'Metro Manila Youth & NextGen Elevation Gathering',
        category: 'Event',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Main Sanctuary, Metro Manila',
        featured: true,
        branch: manilaBranchId as any,
        summary:
          'Empowering the rising generation of kingdom leaders, worshippers, and creatives. Food, worship, and inspiring youth breakout sessions.',
        _status: 'published',
      },
    })

    await payload.create({
      collection: 'announcements',
      data: {
        title: 'Visayas Regional Leadership & Discipleship Summit',
        category: 'Ministry Update',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Cebu City Campus & Online Stream',
        featured: true,
        branch: cebuBranchId as any,
        summary:
          'Equipping church planters, cell leaders, and ministry coordinators across the Visayas region for spiritual expansion and community outreach.',
        _status: 'published',
      },
    })

    await payload.create({
      collection: 'announcements',
      data: {
        title: 'Mindanao Apostolic Harvest & Prayer Vigil',
        category: 'Sunday Service',
        date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Davao City Campus Sanctuary',
        featured: false,
        branch: davaoBranchId as any,
        summary:
          'Corporate intercession night focusing on peace, spiritual awakening, and pioneer church planting expeditions across Mindanao provinces.',
        _status: 'published',
      },
    })

    console.log('✅ Sample announcements created.')
  } else {
    console.log('ℹ️ Announcements collection already contains records.')
  }

  // 4. Seed Story Chapters (5-Act Cinematic Narrative)
  console.log('🎬 Checking Story Chapters (5-Act Narrative)...')
  const existingChapters = await payload.find({
    collection: 'story-chapters',
    limit: 1,
  })

  if (existingChapters.totalDocs === 0) {
    console.log('➕ Seeding 5-Act Cinematic Narrative Story Chapters...')

    const chapters = [
      {
        order: 0,
        chapterKey: 'prologue',
        pillarName: 'Prologue • The Sovereign Architect',
        headline: 'Jesus the Master Builder Global Ministry',
        subheadline:
          "Everything begins in God's sovereign hands. Before the foundations of the cosmos were laid, the divine master builder set every destiny in motion.",
        scriptureRef: 'Hebrews 3:4',
        scriptureText: 'For every house is built by someone, but God is the builder of everything.',
        _status: 'published',
      },
      {
        order: 1,
        chapterKey: 'evangelism',
        pillarName: 'Pillar I • Evangelism',
        headline: 'The True Vine & The Fruit',
        subheadline:
          'Reaching souls by abiding in Christ. Evangelism is not merely human striving, but the living, overflowing fruit of eternal intimacy with the True Vine.',
        scriptureRef: 'John 15:5',
        scriptureText:
          'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.',
        _status: 'published',
      },
      {
        order: 2,
        chapterKey: 'discipleship',
        pillarName: 'Pillar II • Discipleship',
        headline: 'The Seed & Deep Good Soil',
        subheadline:
          'Internalizing the Word through sacred formation. Sown in pure, fertile, unobstructed good soil, the seed takes deep root to produce an enduring spiritual harvest.',
        scriptureRef: 'Matthew 13:8 & Colossians 2:7',
        scriptureText:
          'Still other seed fell on good soil, where it produced a crop—a hundred, sixty or thirty times what was sown... Rooted and built up in Him, strengthened in the faith as you were taught.',
        _status: 'published',
      },
      {
        order: 3,
        chapterKey: 'leadership',
        pillarName: 'Pillar III • Leadership',
        headline: 'The Holy Fire',
        subheadline:
          'Equipped by the flame of the Holy Spirit. Servant leaders are forged in the refiner’s fire—burning as guiding beacons of divine light that illuminate the path for others.',
        scriptureRef: 'Hebrews 1:7 & Acts 2:3–4',
        scriptureText:
          'He makes His ministers a flame of fire... They saw what seemed to be tongues of fire that separated and came to rest on each of them. And all of them were filled with the Holy Spirit.',
        _status: 'published',
      },
      {
        order: 4,
        chapterKey: 'mission',
        pillarName: 'Pillar IV • Mission',
        headline: 'Go therefore and make disciples of all the nations',
        subheadline:
          'Following Jesus into the nations. As the Holy Fire illuminates the shoreline, disciples walk directly in the footsteps of Christ, taking the gospel of peace to the ends of the earth.',
        scriptureRef: 'Romans 10:15 & Matthew 28:19–20',
        scriptureText:
          'How beautiful are the feet of those who bring good news!... Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.',
        _status: 'published',
      },
    ]

    for (const chapter of chapters) {
      await payload.create({
        collection: 'story-chapters',
        data: chapter as any,
      })
      console.log(`  ✨ Created Act ${chapter.order}: ${chapter.headline}`)
    }

    console.log('✅ 5-Act Narrative chapters successfully seeded.')
  } else {
    console.log('ℹ️ StoryChapters collection already contains records.')
  }

  // 5. Seed Connect ministries directory
  console.log('🤝 Checking Connects / ministries directory...')
  const existingConnects = await payload.find({
    collection: 'connects',
    limit: 1,
  })

  if (existingConnects.totalDocs === 0) {
    console.log(`➕ Seeding ${FALLBACK_CONNECTS.length} canonical connect ministries...`)
    for (const ministry of FALLBACK_CONNECTS) {
      const { id: _id, image: _image, ...data } = ministry
      await payload.create({
        collection: 'connects',
        data: {
          ...data,
          _status: 'published',
        },
      })
      console.log(`  ✨ Created ${ministry.name}`)
    }
    console.log('✅ Canonical connect ministries seeded.')
  } else {
    console.log('ℹ️ Connects collection already contains records.')
  }

  console.log('🎉 Seeding completed successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
