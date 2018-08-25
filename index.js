const express = require('express');
const path = require('path');

const app = express();

app.use(express.static( `${__dirname}/build` ));

/* app.get('/interact', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});
 */
app.listen(3000, () => console.log('Listening on port 3000'));