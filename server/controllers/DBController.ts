import { Request, Response } from "express";
import { User, UserMarkers } from "../models/schema.js";

export const getMarkers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.query;
    const { trail_id } = req.query;
    const markers = await UserMarkers.find({ userid: user_id, trail_id: trail_id });
    res.status(200).json(markers);
  } catch (error) {
    res.status(500).send(`Server Error in getMarkers: ${(error as Error).message}`);
  }
};

export const addMarker = async (req: Request, res: Response): Promise<void> => {
  try {
    // const { _id, user_id, trail_id, marker, updatedMarkers, settings } = req.body;
    const { marker, updatedMarkers } = req.body;

    // const position = {
    //   lat: marker.position.lat,
    //   lng: marker.position.lng,
    // };

    const newMarker = new UserMarkers({
      _id: marker._id,
      user_id: marker.user_id,
      position: marker.position,
      trail_id: marker.trail_id,
      hotel: marker.hotel,
      nextDist: marker.nextDist,
      prevDist: marker.prevDist,
      order: marker.order,
      walkingSpeed: marker.walkingSpeed,
      distanceMeasure: marker.distanceMeasure,
    });

    await newMarker.save();

    const updatePromises = Object.keys(updatedMarkers).map(async (key) => {
      return UserMarkers.findOneAndUpdate(
        { _id: key },
        {
          prevDist: updatedMarkers[key].prevDist,
          nextDist: updatedMarkers[key].nextDist,
          order: updatedMarkers[key].order,
        },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
    res.status(200).json(newMarker);
  } catch (error) {
    res.status(500).send(`Server Error in addMarker: ${(error as Error).message}`);
  }
};

export const updateAllMarkers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { markers } = req.body;

    const updatePromises = Object.keys(markers).map(async (key) => {
      return UserMarkers.updateOne({ _id: key }, markers[key]);
    });

    await Promise.all(updatePromises);
    res.status(200).json("Markers updated successfully");
  } catch (error) {
    res.status(500).send(`Server Error in updateAllMarkers: ${(error as Error).message}`);
  }
};

export const removeMarker = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, _id } = req.body;
    const response = await UserMarkers.deleteOne({ user_id, _id });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(`Server Error in removeMarker: ${(error as Error).message}`);
  }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    const response = await newUser.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(`Server Error in addUser: ${(error as Error).message}`);
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).send(`Server Error in getUser: ${(error as Error).message}`);
  }
};

export const getAccommodation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, markerId } = req.query;
    const accommodation = await UserMarkers.findOne({ user_id, _id: markerId });
    if (!accommodation) {
      res.status(404).send("Accommodation not found");
    } else {
      res.status(200).json(accommodation);
    }
  } catch (error) {
    res.status(500).send(`Server Error in getAccommodation: ${(error as Error).message}`);
  }
};

export const addAccommodation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, hotel, markerId } = req.body;
    const response = await UserMarkers.updateOne({ user_id, _id: markerId }, { hotel });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(`Server Error in addAccommodation: ${(error as Error).message}`);
  }
};
