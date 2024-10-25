import app from './app.js'
import dropTables from './db/Seed/seed.js';
const { PORT = 9090 } = process.env;
dropTables()
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));