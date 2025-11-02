/**
 * Migrations completas para Pão em Casa
 */
exports.up = async function(knex) {
  await knex.schema.hasTable('users').then(async exists => {
    if(!exists){
      await knex.schema.createTable('users', t=>{
        t.string('id').primary();
        t.string('name');
        t.string('email').unique();
        t.string('phone');
        t.string('role');
        t.string('pix_key');
        t.string('login_email');
        t.string('login_phone');
        t.string('identity_doc_url');
        t.string('identity_status').defaultTo('pending');
        t.timestamp('created_at').defaultTo(knex.fn.now());
      });
    } else {
      const cols = await knex('users').columnInfo();
      if(!cols.get('identity_doc_url')) await knex.schema.table('users', t=> t.string('identity_doc_url'));
    }
  });

  await knex.schema.hasTable('addresses').then(async exists => {
    if(!exists){
      await knex.schema.createTable('addresses', t=>{
        t.string('id').primary();
        t.string('user_id');
        t.string('label');
        t.string('street');
        t.string('number');
        t.string('complement');
        t.string('neighborhood');
        t.string('city');
        t.string('state');
        t.string('zip');
        t.decimal('lat',10,7);
        t.decimal('lng',10,7);
      });
    }
  });

  await knex.schema.hasTable('shops').then(async exists => {
    if(!exists){
      await knex.schema.createTable('shops', t=>{
        t.string('id').primary();
        t.string('user_id');
        t.string('name');
        t.string('address_id');
        t.boolean('open').defaultTo(true);
        t.string('phone');
        t.string('email');
        t.string('website');
        t.string('social_instagram');
        t.string('social_facebook');
        t.string('social_whatsapp');
        t.string('payout_pix_key');
        t.timestamp('created_at').defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable('riders').then(async exists => {
    if(!exists){
      await knex.schema.createTable('riders', t=>{
        t.string('id').primary();
        t.string('user_id');
        t.string('vehicle');
        t.boolean('available').defaultTo(true);
        t.decimal('lat',10,7);
        t.decimal('lng',10,7);
        t.boolean('suspicious').defaultTo(false);
        t.decimal('earnings').defaultTo(0);
        t.string('cnh_front_url');
        t.string('cnh_back_url');
        t.string('cnh_status').defaultTo('pending');
        t.string('vehicle_make');
        t.string('vehicle_model');
        t.string('vehicle_color');
        t.string('vehicle_plate');
        t.string('vehicle_doc_url');
        t.string('vehicle_status').defaultTo('pending');
        t.string('pix_key');
      });
    }
  });

  await knex.schema.hasTable('products').then(async exists => {
    if(!exists){
      await knex.schema.createTable('products', t=>{
        t.string('id').primary();
        t.string('shop_id');
        t.string('name');
        t.decimal('price',10,2);
        t.integer('stock').defaultTo(0);
      });
    }
  });

  await knex.schema.hasTable('orders').then(async exists => {
    if(!exists){
      await knex.schema.createTable('orders', t=>{
        t.string('id').primary();
        t.string('client_id');
        t.string('shop_id');
        t.string('rider_id');
        t.string('address_id');
        t.decimal('total',10,2);
        t.decimal('freight',10,2);
        t.decimal('platform_share',10,2);
        t.decimal('shop_share',10,2);
        t.decimal('rider_share',10,2);
        t.string('status');
        t.boolean('is_flagged').defaultTo(false);
        t.timestamp('picked_up_at').nullable();
        t.timestamp('delivered_at').nullable();
        t.timestamp('created_at').defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable('order_items').then(async exists => {
    if(!exists){
      await knex.schema.createTable('order_items', t=>{
        t.string('id').primary();
        t.string('order_id');
        t.string('product_id');
        t.integer('quantity');
        t.decimal('unit_price',10,2);
      });
    }
  });

  await knex.schema.hasTable('payments').then(async exists => {
    if(!exists){
      await knex.schema.createTable('payments', t=>{
        t.string('id').primary();
        t.string('order_id');
        t.string('provider');
        t.string('provider_payment_id');
        t.decimal('amount',10,2);
        t.string('status');
        t.timestamp('created_at').defaultTo(knex.fn.now());
      });
    }
  });

  await knex.schema.hasTable('admin_actions').then(async exists => {
    if(!exists){
      await knex.schema.createTable('admin_actions', t=>{
        t.string('id').primary();
        t.string('admin_id');
        t.string('action_type');
        t.string('target_type');
        t.string('target_id');
        t.text('details');
        t.timestamp('created_at').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = async function(knex) {
  // drop tables if needed
};