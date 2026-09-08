require('dotenv').config();

const express = require('express');

const cors = require('cors');

const mysql = require('mysql2/promise');


const app = express();

const port =
  Number(process.env.PORT || 5000);


/*
==================================================
MYSQL CONNECTION POOL
==================================================
*/

const pool =
  mysql.createPool({

    host: process.env.DB_HOST,

    port: Number(
      process.env.DB_PORT || 3306
    ),

    database: process.env.DB_NAME,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

  });


/*
==================================================
MIDDLEWARE
==================================================
*/

app.use(cors());

app.use(express.json());


/*
==================================================
HEALTH CHECK
==================================================
*/

app.get('/health', async (req, res) => {

  try {

    await pool.query('SELECT 1');

    res.json({

      status: 'UP',

      database: 'UP'

    });

  } catch (error) {

    console.error(
      'Database health check failed:',
      error.message
    );

    res.status(503).json({

      status: 'DEGRADED',

      database: 'DOWN'

    });

  }

});


/*
==================================================
GET ALL PRODUCTS
==================================================
*/

app.get(
  '/api/products',
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(`

          SELECT

            id,

            name,

            category,

            price,

            stock,

            image

          FROM products

          ORDER BY id;

        `);


      res.json(rows);


    } catch (error) {

      console.error(
        'Products query failed:',
        error.message
      );

      res.status(500).json({

        error:
          'Unable to load products'

      });

    }

  }
);


/*
==================================================
GET SINGLE PRODUCT
==================================================
*/

app.get(
  '/api/products/:id',
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(`

          SELECT

            id,

            name,

            category,

            price,

            stock,

            image

          FROM products

          WHERE id = ?

        `, [req.params.id]);


      if (rows.length === 0) {

        return res.status(404).json({

          error:
            'Product not found'

        });

      }


      res.json(rows[0]);


    } catch (error) {

      console.error(
        'Product query failed:',
        error.message
      );

      res.status(500).json({

        error:
          'Unable to load product'

      });

    }

  }
);


/*
==================================================
START SERVER
==================================================
*/

app.listen(
  port,
  () => {

    console.log(
      `ShopKart backend listening on port ${port}`
    );

  }
);