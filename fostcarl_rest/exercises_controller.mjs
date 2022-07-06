import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';
import {body, validationResult} from 'express-validator';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
 * Create a new exercise with the name, reps, weight, unit, and date
 */
app.post(
    '/exercises', 
    body('name').isString().isLength({ min: 1 }),
    body('reps').isInt({ min: 1 }),
    body('weight').isInt({ min: 1 }),
    body('unit').isIn(["kgs", "lbs"]),
    body('date').custom(value => {
        const format = /^\d\d-\d\d-\d\d$/;
        if (format.test(value) === false) {
            throw new Error('Invalid date');
        }
        return true;
    }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ Error: "Invalid request" });
        }
        exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            // In case of an error, send back status code 400 in case of an error.
            // A better approach will be to examine the error and send an
            // error status code corresponding to the error.
            res.status(400).json({ Error: 'Request failed' });
        });
});

/**
 * Retrieve exercises. 
 * All exercises are returned.
 */
 app.get('/exercises', (req, res) => {
    exercises.findExercises()
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });
});

/**
 * Retrieve the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => { 
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Not found' });
            }         
         })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });
});

/**
 * Update the exercise whose id is provided in the path parameter and set
 * its name, reps, weight, unit, and date to the values provided in the body.
 */
app.put(
    '/exercises/:_id',
    body('name').isString().isLength({ min: 1 }),
    body('reps').isInt({ min: 1 }),
    body('weight').isInt({ min: 1 }),
    body('unit').isIn(["kgs", "lbs"]),
    body('date').custom(value => {
        const format = /^\d\d-\d\d-\d\d$/;
        if (format.test(value) === false) {
            throw new Error('Invalid date');
        }
        return true;
    }), 
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ Error: "Invalid request" });
        }
        exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
            .then(numUpdated => {
                if (numUpdated === 1) {
                    res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date })
                } else {
                    res.status(404).json({ Error: 'Not found' });
                }
            })
            .catch(error => {
                console.error(error);
                res.status(404).json({ Error: 'Not found' });
            });
});

/**
 * Delete the exercise whose id is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});