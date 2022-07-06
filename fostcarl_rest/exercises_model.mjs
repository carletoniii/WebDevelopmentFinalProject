import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

// Tell mongoose to create indexes, which help with faster querying
// mongoose.set("useCreateIndex", true);

/**
 * Define the schema
 */
const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: String, required: true }
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Exercise = mongoose.model("Exercise", exerciseSchema);

/**
 * Create an exercise
 * @param {String} name
 * @param {Number} reps 
 * @param {Number} weight
 * @param {String} unit 
 * @param {String} date
 * @returns a promise. Resolves to the JavaScript object for the document created by calling save
 */
 const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({name: name, reps: reps, weight: weight, unit: unit, date: date});
    return exercise.save();
};

const findExerciseById = async (_id) => {
    const query = Exercise.findById(_id);
    return query.exec();
}

const findExercises = async () => {
    const query = Exercise.find();
    return query.exec();
};

/**
 * Replace the name, reps, weight, unit, and date properties of the exercise with the id value provided
 * @param {String} _id
 * @param {String} name
 * @param {Number} reps 
 * @param {Number} weight
 * @param {String} unit 
 * @param {String} date
 * @returns A promise. Resolves to the number of documents modified
 */
const replaceExercise = async (_id, name, reps, weight, unit, date) => {
    const result = await Exercise.replaceOne({ _id: _id }, { name: name, reps: reps, weight: weight, unit: unit, date: date });
    return result.modifiedCount;
}

/**
 * Delete the exercise with provided id value
 * @param {String} _id
 * @returns A promise. Resolves to the count of deleted documents
 */
const deleteById = async (_id) => {
    const remove = await Exercise.deleteOne({ _id: _id });
    return remove.deletedCount;
}

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export { createExercise, findExerciseById, findExercises, replaceExercise, deleteById };