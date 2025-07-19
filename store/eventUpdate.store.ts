import { create } from "zustand";
import { EventType, MusicGenre } from "@/generated/graphql";

type EventUpdateStates = {
  // Step 1
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  eventDate: string;
  setEventDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  eventType: EventType | null;
  setEventType: (type: EventType) => void;

  // Step 2
  location: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: { id: string; value: string } | null;
    zipcode: string;
    place: { displayName: string; placeId: string } | null;
    cords: [number, number];
  };
  setLocation: (location: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: { id: string; value: string } | null;
    zipcode: string;
    place: { displayName: string; placeId: string } | null;
    cords: [number, number];
  }) => void;

  // Step 3
  genres: MusicGenre[];
  setGenres: (genres: MusicGenre[]) => void;

  // Step 4
  expectedAudience: number;
  setExpectedAudience: (audience: number) => void;
  budget: { min: number; max: number };
  setBudget: (min: number, max: number) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  pictures: string[];
  setPictures: (pictures: string[]) => void;
  addPicture: (picture: string) => void;
  removePicture: (index: number) => void;

  // Reset
  reset: () => void;
};

export const useEventUpdateStore = create<EventUpdateStates>((set) => ({
  // Step 1
  title: "",
  setTitle: (title) => set({ title }),
  description: "",
  setDescription: (description) => set({ description }),
  eventDate: "",
  setEventDate: (eventDate) => set({ eventDate }),
  endDate: "",
  setEndDate: (endDate) => set({ endDate }),
  eventType: null,
  setEventType: (eventType) => set({ eventType }),

  // Step 2
  location: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: null,
    zipcode: "",
    place: null,
    cords: [0, 0],
  },
  setLocation: (location) => set({ location }),

  // Step 3
  genres: [],
  setGenres: (genres) => set({ genres }),

  // Step 4
  expectedAudience: 0,
  setExpectedAudience: (expectedAudience) => set({ expectedAudience }),
  budget: { min: 0, max: 0 },
  setBudget: (min, max) => set({ budget: { min, max } }),
  currency: "USD",
  setCurrency: (currency) => set({ currency }),
  pictures: [],
  setPictures: (pictures) => set({ pictures }),
  addPicture: (picture) =>
    set((state) => ({ pictures: [...state.pictures, picture] })),
  removePicture: (index) =>
    set((state) => ({
      pictures: state.pictures.filter((_, i) => i !== index),
    })),

  reset: () =>
    set({
      title: "",
      description: "",
      eventDate: "",
      endDate: "",
      eventType: null,
      location: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: null,
        zipcode: "",
        place: null,
        cords: [0, 0],
      },
      genres: [],
      expectedAudience: 0,
      budget: { min: 0, max: 0 },
      currency: "USD",
      pictures: [],
    }),
}));
