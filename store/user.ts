import { create } from "zustand";

// Adjust this based on your actual enums/types
type WalkthroughState = {
  walkthrough: string;
  status: boolean;
};

type MeUserData = {
  _id: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  phone: string;
  profileId?: string | null;
  authType?: string;
  isVerified?: boolean;
  userType?: string;
};

type UserStoreState = {
  meUser: MeUserData | null;
  setMeUser: (data: MeUserData | null) => void;
};

const useUserStore = create<UserStoreState>((set) => ({
  meUser: null,
  setMeUser: (data) => set({ meUser: data }),
}));

export default useUserStore;
