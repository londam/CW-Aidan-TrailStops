import mongoose from "./index.js";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  trails: [TrailSchema],
});

const TrailSchema = new Schema({
  name: { type: String, required: true },
  user_id: { type: String, required: true },
  userMarkers: [UserMarkersSchema],
});

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
const User = mongoose.model("User", userSchema);
const UserMarkers = mongoose.model("UserMarkers", UserMarkersSchema);
export { User, UserMarkers };
