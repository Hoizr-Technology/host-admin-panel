import { create } from "zustand";

type AuthStates = {
  userId: string;
  profileId: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  phone: string;

  setUserId: (e: string) => void;
  setprofileId: (e: string) => void;
  setFirstName: (e: string) => void;
  setLastName: (e: string) => void;
  setStatus: (e: string) => void;
  setEmail: (e: string) => void;
  setPhone: (e: string) => void;
};

const useAuthStore = create<AuthStates>((set) => ({
  userId: "",
  profileId: "",
  firstName: "",
  lastName: "",
  status: "",
  email: "",
  phone: "",

  setUserId: (e: string) => set({ userId: e }),
  setprofileId: (e: string) => set({ profileId: e }),
  setFirstName: (e: string) => set({ firstName: e }),
  setLastName: (e: string) => set({ lastName: e }),
  setStatus: (e: string) => set({ status: e }),
  setEmail: (e: string) => set({ email: e }),
  setPhone: (e: string) => set({ phone: e }),
}));

export default useAuthStore;
