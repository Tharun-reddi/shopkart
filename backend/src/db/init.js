require('dotenv').config();

const mysql = require('mysql2/promise');

async function init() {

  let connection;

  try {

    connection = await mysql.createConnection({

      host: process.env.DB_HOST,

      port: Number(
        process.env.DB_PORT || 3306
      ),

      database: process.env.DB_NAME,

      user: process.env.DB_USER,

      password: process.env.DB_PASSWORD

    });


    console.log(
      'Connected to MySQL successfully.'
    );


    /*
    ==============================================
    CREATE PRODUCTS TABLE
    ==============================================
    */

    await connection.query(`

      CREATE TABLE IF NOT EXISTS products (

        id INT AUTO_INCREMENT PRIMARY KEY,

        name VARCHAR(120) NOT NULL,

        category VARCHAR(80) NOT NULL,

        price DECIMAL(10,2) NOT NULL,

        stock INT NOT NULL DEFAULT 0,

        image VARCHAR(255)

      );

    `);


    console.log(
      'Products table is ready.'
    );


    /*
    ==============================================
    CHECK IMAGE COLUMN
    ==============================================
    */

    const [columns] =
      await connection.query(`

        SELECT COLUMN_NAME

        FROM information_schema.columns

        WHERE table_schema = DATABASE()

        AND table_name = 'products'

        AND column_name = 'image';

      `);


    if (columns.length === 0) {

      await connection.query(`

        ALTER TABLE products

        ADD COLUMN image VARCHAR(255);

      `);

      console.log(
        'Image column added.'
      );

    }


    /*
    ==============================================
    CHECK PRODUCTS
    ==============================================
    */

    const [rows] =
      await connection.query(
        'SELECT COUNT(*) AS count FROM products'
      );


    const productCount =
      Number(rows[0].count);


    /*
    ==============================================
    INSERT PRODUCTS
    ==============================================
    */

    if (productCount === 0) {

      await connection.query(`

        INSERT INTO products
          (name, category, price, stock, image)

        VALUES

          (
            'Wireless Headphones',
            'Electronics',
            2999.00,
            42,
            '/images/headphones.jpg'
          ),

          (
            'Mechanical Keyboard',
            'Electronics',
            5499.00,
            18,
            '/images/keyboard.jpg'
          ),

          (
            'Running Shoes',
            'Sports',
            3999.00,
            27,
            '/images/shoes.jpg'
          ),

          (
            'Travel Backpack',
            'Accessories',
            2499.00,
            35,
            '/images/backpack.jpg'
          ),

          (
            'Coffee Mug',
            'Home',
            599.00,
            60,
            '/images/mug.jpg'
          );

      `);


      console.log(
        'Sample products inserted successfully.'
      );

    } else {

      /*
      ============================================
      UPDATE EXISTING PRODUCTS
      ============================================
      */

      await connection.query(`

        UPDATE products

        SET image = CASE name

          WHEN 'Wireless Headphones'
            THEN '/images/headphones.jpg'

          WHEN 'Mechanical Keyboard'
            THEN '/images/keyboard.jpg'

          WHEN 'Running Shoes'
            THEN '/images/shoes.jpg'

          WHEN 'Travel Backpack'
            THEN '/images/backpack.jpg'

          WHEN 'Coffee Mug'
            THEN '/images/mug.jpg'

          ELSE image

        END;

      `);


      console.log(
        'Existing product image paths updated.'
      );

    }


    console.log(
      'Database initialized successfully.'
    );


  } catch (error) {

    console.error(
      'Database initialization failed:',
      error.message
    );

    process.exitCode = 1;


  } finally {

    if (connection) {

      await connection.end();

      console.log(
        'MySQL connection closed.'
      );

    }

  }

}


init();