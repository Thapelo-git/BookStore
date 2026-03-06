import React, { createContext, useContext, useState, useCallback } from 'react';
import { Address } from '../types/book';
import { toast } from '../hooks/use-toast';
import { addressService } from '../services/api';

export interface SavedAddress extends Address {
  id: string;
  label: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  updateAddress: (id: string, address: Partial<SavedAddress>) => void;
  setDefaultAddress: (id: string) => void;
  defaultAddress: SavedAddress | undefined;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  const addAddress = useCallback(async (address: Omit<SavedAddress, 'id'>) => {
  try {
    const res = await addressService.create(address);

    const newAddress: SavedAddress = res.data.data;

    setAddresses((prev) => {
      if (newAddress.isDefault) {
        return [...prev.map((a) => ({ ...a, isDefault: false })), newAddress];
      }
      return [...prev, newAddress];
    });

    toast({
      title: 'Address added',
      description: `"${address.label}" has been saved.`,
    });
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to save address',
      variant: 'destructive',
    });
  }
}, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    toast({ title: 'Address removed' });
  }, []);

  const updateAddress = useCallback((id: string, updates: Partial<SavedAddress>) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    toast({ title: 'Address updated' });
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast({ title: 'Default address updated' });
  }, []);

  const defaultAddress = addresses.find((a) => a.isDefault);

  return (
    <AddressContext.Provider value={{ addresses, addAddress, removeAddress, updateAddress, setDefaultAddress, defaultAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) throw new Error('useAddress must be used within an AddressProvider');
  return context;
}
