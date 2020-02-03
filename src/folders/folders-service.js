const FoldersService = {
    getAllFolders(knex) {
        return knex
            .select('*')
            .from('noteful_folders');
    },

    insertFolder(knex, newData) {
        return knex
            .insert(newData)
            .into('noteful_folders')
            .returning('*')
            .then(rows => rows[0]);
    },

    getFolderById(knex, id) {
        return knex
            .select('*')
            .from('noteful_folders')
            .where({ id })
            .first();
    },

    deleteFolder(knex, id) {
        return knex
            .delete()
            .from('noteful_folders')
            .where({ id })
    },

    updateFolder(knex, id, updateData) {
        return knex
            .update(updateData)
            .from('noteful_folders')
            .where({ id })
    }
};

module.exports = FoldersService;