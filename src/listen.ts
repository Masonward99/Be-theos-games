import app from './app.js'
import dropTables, { addData, createTables } from './db/Seed/seed.js';
const { PORT = 9090 } = process.env;
dropTables()
    .then(() => createTables())
.then(()=> addData())
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));