import axios from "axios";
import { create } from "zustand";

export type Address = {
  street: string;
  city: string;
};

export type Person = {
  id: number;
  name: string;
  email: string;
  gender: string;
  address: Address;
};

export type AppState = {
  data: Person[];
  fetchData: () => void;
  addPerson: (person: Person) => void;
  updatePerson: (id: number, person: Person) => void;
  deletePerson: (id: number) => void;
};

const useAppStore = create<AppState>((set) => ({
  data: [],
  fetchData: async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/data`);
      set({ data: response.data });
    } catch (error) {
      console.error(error);
    }
  },
  addPerson: async (person) => {
    try {
      await axios.post(`http://localhost:3000/api/data`, person);
      set((state) => ({ data: [...state.data, person] }));
    } catch (error) {
      console.error(error);
    }
  },

  updatePerson: async (id, person) => {
    try {
      await axios.put(`http://localhost:3000/api/data/${id}`, person);
      set((state) => ({
        data: state.data.map((p) => (p.id === id ? person : p)),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deletePerson: async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/data/${id}`);
      set((state) => ({
        data: state.data.filter((person) => person.id !== id),
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useAppStore;
