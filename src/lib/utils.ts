import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
const bcrypt = require("bcryptjs")

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
};

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function comparePasswords(password: string | undefined, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword);
}

export function cleanSpace(data: any){
  if (typeof data !== 'object' || data === null) {
    throw new Error('Input must be a non-null object');
  }

  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      data[key] = data[key].trim();
    }
  });

  return data;
}



export type Action = "create" | "update" | "delete";

export type OptimisticAction<T> = {
  action: Action;
  data: T;
};
