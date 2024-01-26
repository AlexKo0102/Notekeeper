/**
 * @copyright codewithsadee 2023
 */

'use strict';


import { generateID, findNotebook, findNotebookIndex, findNote, findNoteIndex } from "./utils.js";



let notekeeperDB = {};

const initDB = function () {
    const db = localStorage.getItem('notekeeperDB');

    if (db) {
        notekeeperDB = JSON.parse(db);
    } else {
        notekeeperDB.notebooks = [];
        localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
    }
}

initDB();


const readDB = function () {
    notekeeperDB = JSON.parse(localStorage.getItem('notekeeperDB'));
}


const writeDB = function () {
    localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
}
/**
 * @namespace
 * @property {Object} get - Functions for retrieving data from the database.
 * @property {Object} post - Functions for adding data to the database.
 * @property {Object} update - Functions for updating data in the database.
 * @property {Object} delete - Functions for deleting data from the database.
 */
export const db = {

    post: {

        /**
         * @function
         * @param {string} name
         * @returns {Object} 
         */
        notebook(name) {
            readDB();

            const notebookData = {
                id: generateID(),
                name,
                notes: []
            }

            notekeeperDB.notebooks.push(notebookData);

            writeDB();

            return notebookData;
        },

        /**
         * @function
         * @param {string} notebookId 
         * @param {Object} object
         * @returns {Object}
         */
        note(notebookId, object) {
            readDB();

            const notebook = findNotebook(notekeeperDB, notebookId);

            const noteData = {
                id: generateID(),
                notebookId,
                ... object,
                postedOn: new Date().getTime()
            }

            
            notebook.notes.unshift(noteData);
            writeDB();

            return noteData;
        }

    },

    get: {

        /**
         * @function
         * @returns {Array<Object>}
         */
        notebook() {
          readDB();

          return notekeeperDB.notebooks;
        },

        /**
         * @function
         * @param {string} noteboookId 
         * @returns {Array<Object>}
         */
        note(noteboookId) {
            readDB();

            const notebook = findNotebook(notekeeperDB, noteboookId);
            return notebook.notes;
        }


    },

    update: {

        /**
         * @function
         * @param {string} notebookId 
         * @param {string} name 
         * @returns {Object}
         */
        notebook(notebookId, name) {
            readDB();

            const notebook = findNotebook(notekeeperDB, notebookId);
            notebook.name = name;

            writeDB();

            return notebook;
        },

        /**
         * @function
         * @param {string} noteId 
         * @param {Object} object 
         * @returns {Object}
         */
        note(noteId, object) {
            readDB();

            const oldNote = findNote(notekeeperDB, noteId);
            const newNote = Object.assign(oldNote, object);

            writeDB();

            return newNote;
        }

    },

    delete: {

        /**
         * @function
         * @param {string} notebookId 
         */
        notebook(notebookId) {
            readDB();

            const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
            notekeeperDB.notebooks.splice(notebookIndex, 1);

            writeDB();
        },

        /**
         * @function
         * @param {string} notebookId 
         * @param {string} noteId 
         * @returns {Array<Object>}
         */
        note(notebookId, noteId) {
            readDB();

            const notebook = findNotebook(notekeeperDB, notebookId);
            const noteIndex = findNoteIndex(notebook, noteId);

            notebook.notes.splice(noteIndex, 1);

            writeDB();

            return notebook.notes;
        }

    }

}