TRUNCATE noteful_notes, noteful_folders RESTART IDENTITY CASCADE;

INSERT INTO noteful_folders (folder_name, date_created)
VALUES
    ('Important', '2019-01-03T00:00:00.000Z'),
    ('Super', '2019-06-28T00:00:00.000Z'),
    ('Spangley', '2019-06-29T00:00:00.000Z');

INSERT INTO noteful_notes (note_name, folder_id, content, date_modified)
VALUES
    ('Dogs', 1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?', '2019-08-15T23:00:00.000Z'),
    ('Cats', 1, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.', '2019-08-16T23:00:00.000Z'),
    ('Tigers', 1, NULL, '2019-08-15T23:00:00.000Z'),
    ('Elephants', 2, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.', '2020-01-15T00:00:00.000Z');
