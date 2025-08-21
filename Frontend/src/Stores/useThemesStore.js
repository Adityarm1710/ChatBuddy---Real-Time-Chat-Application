import {create} from "zustand";

export const useThemesStore = create((set)=>({
    theme: localStorage.getItem("App-Theme")||"cupcake",
    setTheme: (newTheme)=>{
      localStorage.setItem("App-Theme",newTheme);
      set({theme:newTheme});
}}));
  