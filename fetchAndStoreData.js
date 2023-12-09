const axios = require('axios');
const { Client } = require('pg');

// Connection URL
const connectionUrl = 'postgres://amanquadbtech_user:AI7h4d2wfZFxbsPzugZAyFhvSOXonR2b@dpg-clq0tj0gqk6s738njuf0-a.oregon-postgres.render.com/amanquadbtech';

const client = new Client({
  connectionString: connectionUrl,
  ssl: {
    rejectUnauthorized: false, // Set to true if your PostgreSQL server has a valid SSL certificate
  },
});

const fetchData = async () => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    
    // Adjust this line based on the structure of the WazirX API response
    const tickers = response.data;

    await client.connect();

    // Get the first 10 entries from the tickers object
    const top10Tickers = Object.entries(tickers).slice(0, 10);

    for (const [name, ticker] of top10Tickers) {
      const { last, buy, sell, volume, base_unit } = ticker;
      const query = {
        text: 'INSERT INTO ticker_data(name, last, buy, sell, volume, base_unit) VALUES($1, $2, $3, $4, $5, $6)',
        values: [name, last, buy, sell, volume, base_unit],
      };
      await client.query(query);
    }

    console.log('Top 10 data inserted into the database.');
  } catch (error) {
    console.error('Error fetching and storing data:', error.message);
  } finally {
    await client.end();
  }
};

fetchData();
