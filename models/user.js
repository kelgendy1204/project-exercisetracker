const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track');

const schema = new Schema({ username: { type: String, required: true, unique: true } }, { versionKey: false });
schema.set('toJSON', { getters: true, virtuals: false });
const User = mongoose.model('User', schema);

module.exports = User;