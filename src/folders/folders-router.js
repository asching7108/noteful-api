const express = require('express');
const xss = require('xss');
const path = require('path');
const FoldersService = require('./folders-service');

const FoldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
    id: folder.id,
    folder_name: xss(folder.folder_name),
    date_created: folder.date_created
});

FoldersRouter
    .route('/')
    .get((req, res, next) => {
        FoldersService.getAllFolders(
            req.app.get('db')
        )
            .then(folders => {
                res.json(folders.map(serializeFolder))
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { folder_name, date_created } = req.body;
        const newFolder = { folder_name };

        for (const [key, value] of Object.entries(newFolder)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }    
        }

        newFolder.date_created = date_created;

        FoldersService.insertFolder(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(folder);
            })
            .catch(next);
    });

FoldersRouter
    .route('/:folder_id')
    .all((req, res, next) => {
        const id = req.params.folder_id;
        FoldersService.getFolderById(req.app.get('db'), id)
            .then(folder => {
                if (!folder) {
                    return res.status(404).json({
                        error: { message: `Folder with id ${id} doesn't exist` }
                    });
                }
                res.folder = folder;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeFolder(res.folder));
    })
    .delete((req, res, next) => {
        FoldersService.deleteFolder(
            req.app.get('db'),
            req.params.folder_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const { folder_name, date_created } = req.body;
        const folderToUpdate = { folder_name, date_created };

        const numOfValues = Object.values(folderToUpdate).filter(Boolean).length;
        if (numOfValues === 0) {
            return res.status(400).json({
                error: { message: `Request body must contain either 'folder_name' or 'date_created'` }
            });
        }

        FoldersService.updateFolder(
            req.app.get('db'),
            req.params.folder_id,
            folderToUpdate
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = FoldersRouter;