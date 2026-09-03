// backend/seed-simple.js
const pool = require('./config/database');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if services table exists and has data
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'services'
      );
    `);

    if (!checkTable.rows[0].exists) {
      console.log('❌ Services table does not exist. Please run the database schema first.');
      process.exit(1);
    }

    // Get current count
    const countResult = await pool.query('SELECT COUNT(*) FROM services');
    const currentCount = parseInt(countResult.rows[0].count);
    
    if (currentCount > 0) {
      console.log(`ℹ️ Services table already has ${currentCount} records.`);
      console.log('To re-seed, please truncate the table first:');
      console.log('TRUNCATE TABLE services RESTART IDENTITY;');
      console.log('Or delete specific services you want to replace.');
    }

    const services = [
      // Grooming Services
      { name: 'Basic Grooming', category: 'grooming', description: 'Bath, brush, nail trim, and ear cleaning for your pet', price: 35.00, duration_minutes: 60 },
      { name: 'Full Grooming', category: 'grooming', description: 'Complete grooming package including bath, brush, haircut, nail trim, ear cleaning, and teeth brushing', price: 55.00, duration_minutes: 90 },
      { name: 'Deluxe Grooming', category: 'grooming', description: 'Premium grooming with spa treatment, de-shedding, and premium products', price: 75.00, duration_minutes: 120 },
      { name: 'Mobile Grooming', category: 'grooming', description: 'Full grooming service at your home - we come to you!', price: 85.00, duration_minutes: 90 },
      { name: 'Pet Bath & Brush', category: 'grooming', description: 'Professional bath and brush service with premium shampoos', price: 30.00, duration_minutes: 45 },
      { name: 'Nail Trimming', category: 'grooming', description: 'Professional nail trimming and filing service', price: 15.00, duration_minutes: 20 },
      { name: 'Ear Cleaning', category: 'grooming', description: 'Professional ear cleaning and inspection', price: 20.00, duration_minutes: 15 },
      { name: 'Teeth Brushing', category: 'grooming', description: 'Professional teeth brushing and dental care', price: 25.00, duration_minutes: 20 },
      { name: 'De-shedding Treatment', category: 'grooming', description: 'Specialized treatment to reduce shedding and remove loose fur', price: 40.00, duration_minutes: 60 },
      { name: 'Puppy/Kitten First Groom', category: 'grooming', description: 'Gentle first grooming experience for young pets', price: 30.00, duration_minutes: 45 },
      
      // General Services
      { name: 'Wellness Exam', category: 'general', description: 'Comprehensive physical examination and health assessment', price: 50.00, duration_minutes: 30 },
      { name: 'Vaccinations', category: 'general', description: 'Core and optional vaccinations for pets', price: 75.00, duration_minutes: 20 },
      { name: 'Dental Care', category: 'general', description: 'Professional dental cleaning and care', price: 200.00, duration_minutes: 60 },
      
      // Specialized Services
      { name: 'Cardiology Consultation', category: 'specialized', description: 'Advanced cardiac evaluation and treatment', price: 250.00, duration_minutes: 60 },
      { name: 'Surgery', category: 'specialized', description: 'Specialized surgical procedures', price: 500.00, duration_minutes: 120 },
      { name: 'Dermatology', category: 'specialized', description: 'Skin and allergy treatment', price: 150.00, duration_minutes: 45 },
      { name: 'Ophthalmology', category: 'specialized', description: 'Eye examinations and treatment', price: 180.00, duration_minutes: 45 },
      { name: 'Oncology', category: 'specialized', description: 'Cancer diagnosis and treatment', price: 300.00, duration_minutes: 60 },
      
      // Diagnostics
      { name: 'CT Scan', category: 'diagnostics', description: 'Advanced imaging and diagnostics', price: 350.00, duration_minutes: 45 },
      
      // Emergency
      { name: 'Emergency Care', category: 'emergency', description: '24/7 emergency medical services', price: 400.00, duration_minutes: 60 }
    ];

    let addedCount = 0;
    let skippedCount = 0;

    for (const service of services) {
      try {
        // Check if service already exists
        const checkResult = await pool.query(
          'SELECT id FROM services WHERE name = $1',
          [service.name]
        );

        if (checkResult.rows.length > 0) {
          console.log(`⏭️ Skipped (already exists): ${service.name}`);
          skippedCount++;
          continue;
        }

        // Insert new service
        await pool.query(
          `INSERT INTO services (name, category, description, price, duration_minutes, is_active) 
           VALUES ($1, $2, $3, $4, $5, true)`,
          [service.name, service.category, service.description, service.price, service.duration_minutes]
        );
        
        console.log(`✅ Added: ${service.name}`);
        addedCount++;
      } catch (error) {
        console.error(`❌ Error adding ${service.name}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Added: ${addedCount} services`);
    console.log(`⏭️ Skipped: ${skippedCount} services (already exist)`);
    console.log(`📈 Total services in database: ${addedCount + skippedCount}`);
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();