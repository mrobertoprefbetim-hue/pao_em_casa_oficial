const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const knex = require('./db');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors:{ origin: '*' } });
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const uploadDir = path.join(__dirname, '../uploads');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: function (req, file, cb) { cb(null, uploadDir); }, filename: function (req, file, cb) { const ext = path.extname(file.originalname); cb(null, Date.now() + '_' + Math.random().toString(36).substring(2,8) + ext); } });
const upload = multer({ storage: storage, limits: { fileSize: 20 * 1024 * 1024 } });

app.post('/api/register', async (req,res)=>{
  const { name, email, phone, role, pix_key } = req.body;
  const id = uuidv4();
  await knex('users').insert({ id, name, email, phone, role, pix_key, login_email: email, login_phone: phone });
  res.json({ ok:true, id });
});

app.post('/api/users/:id/identity', upload.single('identity'), async (req,res)=>{
  const id = req.params.id;
  if(!req.file) return res.status(400).json({ error:'file required' });
  const url = '/uploads/' + path.basename(req.file.path);
  await knex('users').where('id', id).update({ identity_doc_url: url, identity_status: 'pending' });
  res.json({ ok:true, url });
});

app.post('/api/riders/:id/cnh', upload.fields([{ name: 'cnh_front' }, { name: 'cnh_back' }]), async (req,res)=>{
  const id = req.params.id; const files = req.files; if(!files || (!files.cnh_front && !files.cnh_back)) return res.status(400).json({ error:'files required' }); const front = files.cnh_front ? '/uploads/' + path.basename(files.cnh_front[0].path) : null; const back = files.cnh_back ? '/uploads/' + path.basename(files.cnh_back[0].path) : null; await knex('riders').where('id', id).update({ cnh_front_url: front, cnh_back_url: back, cnh_status: 'pending' }); res.json({ ok:true, front, back });
});

app.post('/api/riders/:id/vehicle', upload.single('vehicle_doc'), async (req,res)=>{
  const id = req.params.id; const { make, model, color, plate } = req.body; const file = req.file; const url = file ? '/uploads/' + path.basename(file.path) : null; await knex('riders').where('id', id).update({ vehicle_make: make, vehicle_model: model, vehicle_color: color, vehicle_plate: plate, vehicle_doc_url: url, vehicle_status: 'pending' }); res.json({ ok:true, url });
});

app.get('/api/admin/documents/pending', async (req,res)=>{ const users = await knex('users').where('identity_status', 'pending').select('*'); const riders = await knex('riders').where('cnh_status', 'pending').select('*'); const vehicles = await knex('riders').where('vehicle_status', 'pending').select('*'); res.json({ users, riders, vehicles }); });

app.post('/api/admin/documents/verify', async (req,res)=>{ const { target, id, status, note, admin_id } = req.body; if(target === 'user'){ await knex('users').where('id', id).update({ identity_status: status }); } else if(target === 'rider'){ await knex('riders').where('id', id).update({ cnh_status: status }); } else if(target === 'vehicle'){ await knex('riders').where('id', id).update({ vehicle_status: status }); } await knex('admin_actions').insert({ id: uuidv4(), admin_id: admin_id || null, action_type: 'verify_doc', target_type: target, target_id: id, details: JSON.stringify({ status, note }) }); res.json({ ok:true }); });

app.get('/api/dashboard/admin', async (req,res)=>{ const totalOrders = await knex('orders').count('id as c').first(); const platformRevenue = await knex('orders').sum('platform_share as s').first(); const totalShops = await knex('shops').count('id as c').first(); const totalRiders = await knex('riders').count('id as c').first(); const totalUsers = await knex('users').count('id as c').first(); res.json({ totalOrders: totalOrders.c||0, platformRevenue: platformRevenue.s||0, totalShops: totalShops.c||0, totalRiders: totalRiders.c||0, totalUsers: totalUsers.c||0 }); });

app.get('/api/dashboard/shop/:shopId', async (req,res)=>{ const shopId = req.params.shopId; const products_sold = await knex('order_items').join('orders','order_items.order_id','orders.id').where('orders.shop_id', shopId).sum('order_items.quantity as q').first(); const orders_received = await knex('orders').where('shop_id', shopId).count('id as c').first(); const shop_earnings = await knex('orders').where('shop_id', shopId).sum('shop_share as s').first(); res.json({ products_sold: products_sold.q||0, orders_received: orders_received.c||0, shop_earnings: shop_earnings.s||0 }); });

app.get('/api/dashboard/rider/:riderId', async (req,res)=>{ const riderId = req.params.riderId; const deliveries_assigned = await knex('orders').where('rider_id', riderId).count('id as c').first(); const deliveries_completed = await knex('orders').where('rider_id', riderId).andWhereNotNull('delivered_at').count('id as c').first(); const rider_earnings = await knex('riders').where('id', riderId).sum('earnings as e').first(); res.json({ deliveries_assigned: deliveries_assigned.c||0, deliveries_completed: deliveries_completed.c||0, rider_earnings: rider_earnings.e||0 }); });

app.get('/api/dashboard/client/:clientId', async (req,res)=>{ const clientId = req.params.clientId; const orders_placed = await knex('orders').where('client_id', clientId).count('id as c').first(); const orders_completed = await knex('orders').where('client_id', clientId).andWhereNotNull('delivered_at').count('id as c').first(); const total_spent = await knex('orders').where('client_id', clientId).sum('total as s').first(); res.json({ orders_placed: orders_placed.c||0, orders_completed: orders_completed.c||0, total_spent: total_spent.s||0 }); });

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

server.listen(PORT, ()=> console.log('Server running on', PORT));
