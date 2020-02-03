const express = require('express');
const xss = require('xss');
const path = require('path');
const NotesService = require('./notes-service');

const NotesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = note => ({
    id: note.id,
    note_name: xss(note.note_name),
    folder_id: note.folder_id,
    content: note.content,
    date_modified: note.date_modified
});

NotesRouter
    .route('/')
    .get((req, res, next) => {
        NotesService.getAllNotes(
            req.app.get('db')
        )
            .then(notes => {
                res.json(notes.map(serializeNote))
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { note_name, folder_id, content, date_modified } = req.body;
        const newNote = { note_name, folder_id };

        for (const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }    
        }

        newNote.content = content;
        newNote.date_modified = date_modified;

        NotesService.insertNote(
            req.app.get('db'),
            newNote
        )
            .then(note => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${note.id}`))
                    .json(note);
            })
            .catch(next);
    });

NotesRouter
    .route('/:note_id')
    .all((req, res, next) => {
        const id = req.params.note_id;
        NotesService.getNoteById(req.app.get('db'), id)
            .then(note => {
                if (!note) {
                    return res.status(404).json({
                        error: { message: `Note with id ${id} doesn't exist` }
                    });
                }
                res.note = note;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeNote(res.note));
    })
    .delete((req, res, next) => {
        NotesService.deleteNote(
            req.app.get('db'),
            req.params.note_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const { note_name, folder_id, content, date_modified } = req.body;
        const noteToUpdate = { note_name, folder_id, content, date_modified };

        const numOfValues = Object.values(noteToUpdate).filter(Boolean).length;
        if (numOfValues === 0) {
            return res.status(400).json({
                error: { message: `Request body must contain either 'note_name', 'folder_id', 'content' or 'date_created'` }
            });
        }

        NotesService.updateNote(
            req.app.get('db'),
            req.params.note_id,
            noteToUpdate
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = NotesRouter;