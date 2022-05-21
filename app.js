const express = require ('express');
const app = express();
const path = require ('path')

app.use(express.static('./'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});


app.listen(8080, function() {
    console.log("Example app is listening port 8080")
});