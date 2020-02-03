const NotesService = {
    getAllNotes(knex) {
        return knex
            .select('*')
            .from('noteful_notes');
    },

    insertNote(knex, newData) {
        return knex
            .insert(newData)
            .into('noteful_notes')
            .returning('*')
            .then(rows => rows[0]);
    },

    getNoteById(knex, id) {
        return knex
            .select('*')
            .from('noteful_notes')
            .where({ id })
            .first();
    },

    deleteNote(knex, id) {
        return knex
            .delete()
            .from('noteful_notes')
            .where({ id })
    },

    updateNote(knex, id, updateData) {
        return knex
            .update(updateData)
            .from('noteful_notes')
            .where({ id })
    }
};

module.exports = NotesService;