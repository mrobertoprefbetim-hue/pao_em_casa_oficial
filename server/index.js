const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.static(__dirname + '/../frontend'));
app.get('/api/ping', (req,res)=>res.json({ok:true}));
app.listen(PORT, ()=>console.log('Server running on', PORT));
