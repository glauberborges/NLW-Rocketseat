import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema
        .createTable('items', function (table) {
            table.increments('id');
            table.string('image', 255).notNullable();
            table.string('title', 255).notNullable();
        });
}

export async function down(knex: Knex) {
    return knex.schema
        .dropTable("items");
}