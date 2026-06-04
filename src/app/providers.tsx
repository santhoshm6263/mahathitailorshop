'use client';

// src/app/providers.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../shared/api/supabase';
import { BoutiqueDB } from '../shared/api/db';
import { 
  Profile, Product, Order, Appointment, Staff, 
  GalleryItem, Notification, CartItem 
} from '../shared/types';

interface BoutiqueContextType {
  currentUser: Profile | null;
  setCurrentUser: (user: Profile | null) => void;
  products: Product[];
  orders: Order[];
  appointments: Appointment[];
  staff: Staff[];
  gallery: GalleryItem[];
  notifications: Notification[];
  cart: CartItem[];
  wishlist: string[]; // array of product IDs
  loading: boolean;
  refreshData: () => Promise<void>;
  
  // Data actions
  addProduct: (product: Partial<Product>) => Promise<Product>;
  addOrder: (order: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<boolean>;
  updateOrderStaff: (orderId: string, staffName: string) => Promise<boolean>;
  updateOrderStitching: (orderId: string, fields: Partial<Order>) => Promise<boolean>;
  
  addAppointment: (apt: Partial<Appointment>) => Promise<Appointment>;
  updateAppointmentStatus: (aptId: string, status: Appointment['status']) => Promise<boolean>;
  
  addCustomer: (customer: Partial<Profile>) => Promise<Profile>;
  updateCustomerMeasurements: (customerId: string, measurements: any) => Promise<boolean>;
  
  addNotification: (notif: Partial<Notification>) => Promise<Notification>;
  markNotificationRead: (notifId: string) => Promise<boolean>;
  likeGalleryItem: (itemId: string) => Promise<boolean>;
  addGalleryItem: (item: Partial<GalleryItem>) => Promise<GalleryItem>;
  
  // Cart Actions
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
}

const BoutiqueContext = createContext<BoutiqueContextType | undefined>(undefined);

export const BoutiqueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all initial data
  const refreshData = async () => {
    try {
      const [prodData, ordData, aptData, stfData, galData, notData] = await Promise.all([
        BoutiqueDB.getProducts(),
        BoutiqueDB.getOrders(),
        BoutiqueDB.getAppointments(),
        BoutiqueDB.getStaff(),
        BoutiqueDB.getGallery(),
        BoutiqueDB.getNotifications(),
      ]);

      setProducts(prodData);
      setOrders(ordData);
      setAppointments(aptData);
      setStaff(stfData);
      setGallery(galData);
      setNotifications(notData);
    } catch (err) {
      console.error('Error fetching data from BoutiqueDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Sync Cart & Wishlist from localStorage
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('mahathi_cart');
      if (storedCart) {
        try { setCart(JSON.parse(storedCart)); } catch (e) {}
      }
      const storedWishlist = localStorage.getItem('mahathi_wishlist');
      if (storedWishlist) {
        try { setWishlist(JSON.parse(storedWishlist)); } catch (e) {}
      }
      const storedUser = localStorage.getItem('mahathi_user');
      if (storedUser) {
        try { setCurrentUser(JSON.parse(storedUser)); } catch (e) {}
      }
    }

    // Supabase Auth state listener
    const client = supabase;
    if (client) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          // Fetch corresponding profile
          client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                const profileUser: Profile = {
                  id: data.id,
                  name: data.name,
                  email: data.email,
                  phone: data.phone,
                  role: data.role,
                  joined_date: data.joined_date,
                  notes: data.notes,
                  measurements: {
                    chest: data.chest || 0,
                    waist: data.waist || 0,
                    blouse_length: data.blouse_length || 0,
                    shoulder: data.shoulder || 0,
                    front_neck: data.front_neck || 0,
                    back_neck: data.back_neck || 0,
                    sleeve_length: data.sleeve_length || 0,
                    sleeve_round: data.sleeve_round || 0,
                    arm_hole: data.arm_hole || 0,
                  }
                };
                setCurrentUser(profileUser);
                localStorage.setItem('mahathi_user', JSON.stringify(profileUser));
              }
            });
        }
      });

      const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session && session.user) {
          const { data } = await client.from('profiles').select('*').eq('id', session.user.id).single();
          if (data) {
            const profileUser: Profile = {
              id: data.id, name: data.name, email: data.email, phone: data.phone, role: data.role, joined_date: data.joined_date, notes: data.notes,
              measurements: {
                chest: data.chest || 0, waist: data.waist || 0, blouse_length: data.blouse_length || 0, shoulder: data.shoulder || 0,
                front_neck: data.front_neck || 0, back_neck: data.back_neck || 0, sleeve_length: data.sleeve_length || 0, sleeve_round: data.sleeve_round || 0, arm_hole: data.arm_hole || 0
              }
            };
            setCurrentUser(profileUser);
            localStorage.setItem('mahathi_user', JSON.stringify(profileUser));
          }
        } else {
          setCurrentUser(null);
          localStorage.removeItem('mahathi_user');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Save Cart to local storage when it updates
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('mahathi_cart', JSON.stringify(newCart));
  };

  // Save Wishlist to local storage when it updates
  const saveWishlist = (newWish: string[]) => {
    setWishlist(newWish);
    localStorage.setItem('mahathi_wishlist', JSON.stringify(newWish));
  };

  // --- ACTIONS ---
  const addProduct = async (product: Partial<Product>) => {
    const res = await BoutiqueDB.addProduct(product);
    await refreshData();
    return res;
  };

  const addOrder = async (order: Partial<Order>) => {
    const res = await BoutiqueDB.addOrder(order);
    await refreshData();
    return res;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const res = await BoutiqueDB.updateOrderStatus(orderId, status);
    await refreshData();
    return res;
  };

  const updateOrderStaff = async (orderId: string, staffName: string) => {
    const res = await BoutiqueDB.updateOrderStaff(orderId, staffName);
    await refreshData();
    return res;
  };

  const updateOrderStitching = async (orderId: string, fields: Partial<Order>) => {
    const res = await BoutiqueDB.updateOrderStitching(orderId, fields);
    await refreshData();
    return res;
  };

  const addAppointment = async (apt: Partial<Appointment>) => {
    const res = await BoutiqueDB.addAppointment(apt);
    await refreshData();
    return res;
  };

  const updateAppointmentStatus = async (aptId: string, status: Appointment['status']) => {
    const res = await BoutiqueDB.updateAppointmentStatus(aptId, status);
    await refreshData();
    return res;
  };

  const addCustomer = async (customer: Partial<Profile>) => {
    const res = await BoutiqueDB.addCustomer(customer);
    await refreshData();
    return res;
  };

  const updateCustomerMeasurements = async (customerId: string, measurements: any) => {
    const res = await BoutiqueDB.updateCustomerMeasurements(customerId, measurements);
    if (currentUser && currentUser.id === customerId) {
      const updatedUser = { ...currentUser, measurements: { ...currentUser.measurements, ...measurements } };
      setCurrentUser(updatedUser as Profile);
      localStorage.setItem('mahathi_user', JSON.stringify(updatedUser));
    }
    await refreshData();
    return res;
  };

  const addNotification = async (notif: Partial<Notification>) => {
    const res = await BoutiqueDB.addNotification(notif);
    await refreshData();
    return res;
  };

  const markNotificationRead = async (notifId: string) => {
    const res = await BoutiqueDB.markNotificationAsRead(notifId);
    await refreshData();
    return res;
  };

  const likeGalleryItem = async (itemId: string) => {
    const res = await BoutiqueDB.likeGalleryItem(itemId);
    await refreshData();
    return res;
  };

  const addGalleryItem = async (item: Partial<GalleryItem>) => {
    const res = await BoutiqueDB.addGalleryItem(item);
    await refreshData();
    return res;
  };

  // --- CART OPERATIONS ---
  const addToCart = (product: Product, qty: number = 1) => {
    const newCart = [...cart];
    const existing = newCart.find(item => item.product.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      newCart.push({ product, qty });
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    saveCart(newCart);
  };

  const updateCartQty = (productId: string, qty: number) => {
    const newCart = cart.map(item => 
      item.product.id === productId 
        ? { ...item, qty: Math.max(1, qty) } 
        : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // --- WISHLIST OPERATIONS ---
  const toggleWishlist = (productId: string) => {
    let newWish = [...wishlist];
    if (newWish.includes(productId)) {
      newWish = newWish.filter(id => id !== productId);
    } else {
      newWish.push(productId);
    }
    saveWishlist(newWish);
  };

  const handleSetCurrentUser = (user: Profile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('mahathi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mahathi_user');
      if (supabase) supabase.auth.signOut();
    }
  };

  return (
    <BoutiqueContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        products,
        orders,
        appointments,
        staff,
        gallery,
        notifications,
        cart,
        wishlist,
        loading,
        refreshData,
        addProduct,
        addOrder,
        updateOrderStatus,
        updateOrderStaff,
        updateOrderStitching,
        addAppointment,
        updateAppointmentStatus,
        addCustomer,
        updateCustomerMeasurements,
        addNotification,
        markNotificationRead,
        likeGalleryItem,
        addGalleryItem,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
      }}
    >
      {children}
    </BoutiqueContext.Provider>
  );
};

export const useBoutique = () => {
  const context = useContext(BoutiqueContext);
  if (context === undefined) {
    throw new Error('useBoutique must be used within a BoutiqueProvider');
  }
  return context;
};
