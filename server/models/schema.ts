import mongoose from './index.js';

const Schema = mongoose.Schema;

const UserMarkersSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  trail_id: { type: String, required: true },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  hotel: { type: String },
  prevDist: {
    dist: { type: Number, required: true },
    time: { type: Number, required: true },
  },
  nextDist: {
    dist: { type: Number, required: true },
    time: { type: Number, required: true },
  },
  order: { type: Number },
  walkingSpeed: { type: Number, required: true },
  distanceMeasure: { type: String, required: true },
});

const TrailSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
});

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
const UserMarkers = mongoose.model('UserMarkers', UserMarkersSchema);
const Trail = mongoose.model('Trail', TrailSchema);
export { User, UserMarkers, Trail };
