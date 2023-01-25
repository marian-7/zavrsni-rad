import { createContext } from "react";
import { UserAddress } from "domain/types/Location";

type UserContextType = {
  userAddresses?: UserAddress[];
  userLocation?: UserAddress;
  setUserDefaultLocation: (address: UserAddress) => void;
};

export const UserContext = createContext<UserContextType>({} as UserContextType);
