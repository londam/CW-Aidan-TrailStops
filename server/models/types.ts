export type UserMarkersType = {
  _id: String;
  user_id: String;
  trail_id: String;
  position: {
    lat: Number;
    lng: Number;
  };
  hotel: String;
  prevDist: {
    dist: Number;
    time: Number;
  };
  nextDist: {
    dist: Number;
    time: Number;
  };
  order: Number;
  walkingSpeed: Number;
  distanceMeasure: String;
};

export type TrailType = {
  _id: String;
  name: String;
};

export type UserType = {
  name: String;
  email: String;
  password: String;
};
