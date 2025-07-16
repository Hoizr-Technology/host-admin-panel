import { create } from "zustand";

// Zustand Store Changes
type OnboardingStates = {
  // STEP 2 - Venue Type (changed)
  venueType: string;
  setVenueType: (e: string) => void;

  // STEP 3 - Host Info (new)
  hostName: string;
  setHostName: (e: string) => void;
  description: string;
  setDescription: (e: string) => void;
  logoUrl: string;
  setLogoUrl: (e: string) => void;
  contactEmail: string;
  setContactEmail: (e: string) => void;
  contactPhone: string;
  setContactPhone: (e: string) => void;

  // STEP 4 - Business Info (new)
  businessRegistrationNumber: string;
  setBusinessRegistrationNumber: (e: string) => void;
  averageEventSize: number;
  setAverageEventSize: (e: number) => void;
  gstNumber: string;
  setGstNumber: (e: string) => void;

  // Address (same)
  addressLine1: string;
  setAddressLine1: (address: string) => void;
  addressLine2: string;
  setAddressLine2: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  zipcode: string;
  setZipcode: (zipcode: string) => void;
  state: { id: string; value: string } | null;
  setState: (state: { id: string; value: string } | null) => void;
  place: { displayName: string; placeId: string } | null;
  setPlace: (place: { displayName: string; placeId: string } | null) => void;
  cords: [number, number];
  setCords: (coords: [number, number]) => void;

  // Other data
  user: { firstName: string; lastName: string } | null;
  setUser: (e: { firstName: string; lastName: string } | null) => void;
  websiteUrl: string;
  setWebsiteUrl: (e: string) => void;
  socialLinks: {
    instagram: string;
    soundcloud: string;
    spotify: string;
    youtube: string;
    mixcloud: string;
    bandcamp: string;
  };
  setSocialLinks: (e: {
    instagram: string;
    soundcloud: string;
    spotify: string;
    youtube: string;
    mixcloud: string;
    bandcamp: string;
  }) => void;
};

export const useOnboardingStore = create<OnboardingStates>((set) => ({
  // STEP 2 - Venue Type (changed)
  venueType: "",
  setVenueType: (e: string) => set({ venueType: e }),

  // STEP 3 - Host Info (new)
  hostName: "",
  setHostName: (e: string) => set({ hostName: e }),
  description: "",
  setDescription: (e: string) => set({ description: e }),
  logoUrl: "",
  setLogoUrl: (e: string) => set({ logoUrl: e }),
  contactEmail: "",
  setContactEmail: (e: string) => set({ contactEmail: e }),
  contactPhone: "",
  setContactPhone: (e: string) => set({ contactPhone: e }),

  // STEP 4 - Business Info (new)
  businessRegistrationNumber: "",
  setBusinessRegistrationNumber: (e: string) =>
    set({ businessRegistrationNumber: e }),
  averageEventSize: 0,
  setAverageEventSize: (e: number) => set({ averageEventSize: e }),
  gstNumber: "",
  setGstNumber: (e: string) => set({ gstNumber: e }),

  // Address (same)
  addressLine1: "",
  setAddressLine1: (address) => set({ addressLine1: address }),
  addressLine2: "",
  setAddressLine2: (address) => set({ addressLine2: address }),
  city: "",
  setCity: (city) => set({ city }),
  state: null,
  setState: (state) => set({ state }),
  zipcode: "",
  setZipcode: (zipcode) => set({ zipcode }),

  place: null,
  setPlace: (place) => set({ place }),
  cords: [0, 0],
  setCords: (cords) => set({ cords }),

  // Other data
  user: null,
  setUser: (e: { firstName: string; lastName: string } | null) =>
    set({ user: e }),
  websiteUrl: "",
  setWebsiteUrl: (e: string) => set({ websiteUrl: e }),
  socialLinks: {
    instagram: "",
    soundcloud: "",
    spotify: "",
    youtube: "",
    mixcloud: "",
    bandcamp: "",
  },
  setSocialLinks: (e) => set({ socialLinks: e }),
}));
