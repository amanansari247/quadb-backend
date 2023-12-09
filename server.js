const express = require('express');
const { Client } = require('pg');
const cors = require('cors');


const app = express();
const port = 3001; // You can use any port you prefer
app.use(cors());

const connectionUrl = 'postgres://amanquadbtech_user:AI7h4d2wfZFxbsPzugZAyFhvSOXonR2b@dpg-clq0tj0gqk6s738njuf0-a.oregon-postgres.render.com/amanquadbtech';

app.get('/api/ticker', async (req, res) => {
  const client = new Client({
    connectionString: connectionUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    const firstCurrency = req.query.firstCurrency; // Assuming you send firstCurrency as a query parameter

    // Fetch data based on the firstCurrency
    const query = {
      text: 'SELECT * FROM ticker_data WHERE base_unit = $1',
      values: [firstCurrency],
    };

    const result = await client.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
});
app.get('/api/baseunit', async (req, res) => {
    const client = new Client({
      connectionString: connectionUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  
    try {
      await client.connect();
  
      // Fetch distinct base_unit values from the ticker_data table
      const query = {
        text: 'SELECT DISTINCT base_unit FROM ticker_data ORDER BY base_unit',
      };
  
      const result = await client.query(query);
  
      // Extract the base_unit values from the result rows
      const baseUnits = result.rows.map(row => row.base_unit);
  
      res.json(baseUnits);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.end();
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
