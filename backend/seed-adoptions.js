// backend/seed-adoptions.js
const { query } = require('./config/db-helper');

async function seedAdoptions() {
  console.log('🌱 Seeding adoption data...');
  
  try {
    // Check if adoptions table exists, create if not
    await query(`
      CREATE TABLE IF NOT EXISTS adoptions (
        id SERIAL PRIMARY KEY,
        pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        message TEXT,
        contact_email VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Adoptions table ready');

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_adoptions_pet_id ON adoptions(pet_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_adoptions_user_id ON adoptions(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_adoptions_status ON adoptions(status)`);
    console.log('✅ Indexes created');

    // Get a user
    const userResult = await query('SELECT id FROM users LIMIT 1');
    if (userResult.rows.length === 0) {
      console.log('⚠️ No users found. Please create a user first.');
      process.exit(1);
    }
    const userId = userResult.rows[0].id;

    // Get a pet
    const petResult = await query('SELECT id FROM pets LIMIT 1');
    if (petResult.rows.length === 0) {
      console.log('⚠️ No pets found. Please create a pet first.');
      process.exit(1);
    }
    const petId = petResult.rows[0].id;

    // Insert sample adoption data (without description column)
    const adoptions = [
      {
        pet_id: petId,
        user_id: userId,
        status: 'pending',
        message: 'I would love to adopt this pet. I have a loving home and plenty of space.',
        contact_email: 'adopter1@email.com'
      },
      {
        pet_id: petId,
        user_id: userId,
        status: 'approved',
        message: 'This pet would be perfect for our family. We are very excited!',
        contact_email: 'adopter2@email.com'
      },
      {
        pet_id: petId,
        user_id: userId,
        status: 'completed',
        message: 'Adoption completed successfully. The pet is now part of our family!',
        contact_email: 'adopter3@email.com'
      }
    ];

    for (const data of adoptions) {
      try {
        const result = await query(
          `INSERT INTO adoptions (pet_id, user_id, status, message, contact_email, created_at) 
           VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
          [data.pet_id, data.user_id, data.status, data.message, data.contact_email]
        );
        console.log(`✅ Added adoption: ${data.status}`);
      } catch (error) {
        console.error(`❌ Error adding adoption:`, error.message);
      }
    }

    // Show summary
    const summary = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM adoptions
    `);
    
    console.log('\n📊 Adoption Summary:');
    console.log(`   Total: ${summary.rows[0].total || 0}`);
    console.log(`   Pending: ${summary.rows[0].pending || 0}`);
    console.log(`   Approved: ${summary.rows[0].approved || 0}`);
    console.log(`   Completed: ${summary.rows[0].completed || 0}`);

    // Show all adoptions
    const allAdoptions = await query(`
      SELECT a.*, p.name as pet_name, u.email as user_email
      FROM adoptions a
      LEFT JOIN pets p ON a.pet_id = p.id
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `);
    
    if (allAdoptions.rows.length > 0) {
      console.log('\n📋 All Adoptions:');
      allAdoptions.rows.forEach(adoption => {
        console.log(`   ID: ${adoption.id} - Pet: ${adoption.pet_name} - Status: ${adoption.status} - User: ${adoption.user_email}`);
      });
    }

    console.log('\n✅ Adoption data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding adoption data:', error);
    process.exit(1);
  }
}

seedAdoptions();