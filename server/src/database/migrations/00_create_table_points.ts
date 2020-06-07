import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema
        .createTable('points', function (table) {
            table.increments('id');
            table.string('image', 255).notNullable();
            table.string('name', 100).notNullable();
            table.string('email', 50).notNullable();
            table.string('whatsapp', 25).notNullable();
            table.decimal('latitude').notNullable();
            table.decimal('longitude').notNullable();
            table.string('city', 255).notNullable();
            table.string('number', 255).notNullable();
            table.string('uf', 2).notNullable();
        });
}

export async function down(knex: Knex) {
    return knex.schema
        .dropTable("points");
}