// src/shared/api/db.ts
import { supabase } from './supabase';
import { 
  Profile, Product, Order, Appointment, Staff, 
  GalleryItem, Notification, SizingMeasurements 
} from '../types';

const STORAGE_KEY = 'mahathi_tailor_db';

// Rich mock/seed data matching BoutiqueDB.js exactly
export const seedData = {
  config: {
    phone: '+91 93470 01303',
    whatsapp: '919347001303',
    instagram: 'https://instagram.com/mahathitailors',
    facebook: 'https://facebook.com/mahathitailors',
    address: 'Beside of MMP Primary School, Ponnangur, Adavibhudhugur Road, Mallanur, Kuppam, Chittoor, Andhra Pradesh - 517425',
    email: 'mahathitailorshop@gmail.com',
    hours: 'Welcoming you full week, Monday to Sunday, (9am - 9pm) Sunup to Sundown'
  },
  customers: [
    {
      id: 'cust-1',
      name: 'Priya Dharshini',
      phone: '9840123456',
      email: 'priya.d@gmail.com',
      joined_date: '2026-02-14',
      notes: 'Bridal customer, prefers heavy zari work and stone settings. Extremely particular about neck fit.',
      measurements: {
        chest: 36, waist: 30, blouse_length: 14.5, shoulder: 14.25,
        front_neck: 7.5, back_neck: 9.5, sleeve_length: 11.0, sleeve_round: 11.5, arm_hole: 16.5
      }
    },
    {
      id: 'cust-2',
      name: 'Ananya Krishnan',
      phone: '9790987654',
      email: 'ananya.k@hotmail.com',
      joined_date: '2026-03-01',
      notes: 'Likes minimalist design. Requested high-neck designer cuts.',
      measurements: {
        chest: 34, waist: 28, blouse_length: 14.0, shoulder: 13.75,
        front_neck: 6.5, back_neck: 8.0, sleeve_length: 10.5, sleeve_round: 10.75, arm_hole: 15.5
      }
    },
    {
      id: 'cust-3',
      name: 'Dr. Meera Radhakrishnan',
      phone: '9444556677',
      email: 'meera.r@meduniv.edu',
      joined_date: '2026-04-10',
      notes: 'Regular ethnic-wear customer. Prefers comfortable armholes and traditional cotton linings.',
      measurements: {
        chest: 40, waist: 35, blouse_length: 15.0, shoulder: 15.0,
        front_neck: 7.0, back_neck: 8.5, sleeve_length: 9.5, sleeve_round: 13.0, arm_hole: 18.0
      }
    },
    {
      id: 'cust-4',
      name: 'Sushmitha Sen',
      phone: '9566234981',
      email: 'sushmitha.sen@gmail.com',
      joined_date: '2026-05-01',
      notes: 'Ordering lehenga and blouse for wedding reception. Wants full custom designer trial.',
      measurements: {
        chest: 32, waist: 26, blouse_length: 13.5, shoulder: 13.5,
        front_neck: 8.0, back_neck: 10.5, sleeve_length: 12.0, sleeve_round: 10.0, arm_hole: 14.5
      }
    }
  ],
  orders: [
    {
      id: 'ord-101',
      customer_id: 'cust-1',
      customer_name: 'Priya Dharshini',
      phone: '9840123456',
      stitching_item: 'Bridal Blouse',
      neck_style: 'Royal Pot Neck',
      sleeve_style: 'Elbow Sleeve',
      embroidery_style: 'Heavy Aari & Zardosi Work',
      fabric_notes: 'Deep Maroon raw silk, gold zari threads with red Kundan stone accents.',
      cost: 8500,
      advance_paid: 3000,
      status: 'Embroidery' as const,
      order_date: '2026-05-10',
      due_date: '2026-06-05',
      staff_assigned: 'Kalyan (Aari Master)',
      inspiration_image: '/assets/designer-blouse.png',
      created_at: new Date().toISOString()
    },
    {
      id: 'ord-102',
      customer_id: 'cust-2',
      customer_name: 'Ananya Krishnan',
      phone: '9790987654',
      stitching_item: 'Designer Boat Blouse',
      neck_style: 'Boat Neck',
      sleeve_style: 'Cap Sleeve',
      embroidery_style: 'Minimalist Floral Border',
      fabric_notes: 'Mustard yellow tussar silk, light beads and spring work.',
      cost: 3200,
      advance_paid: 1500,
      status: 'Cutting' as const,
      order_date: '2026-05-18',
      due_date: '2026-05-30',
      staff_assigned: 'Ramu (Master Cutter)',
      inspiration_image: null,
      created_at: new Date().toISOString()
    },
    {
      id: 'ord-103',
      customer_id: 'cust-3',
      customer_name: 'Dr. Meera Radhakrishnan',
      phone: '9444556677',
      stitching_item: 'Kanchipuram Silk Blouse',
      neck_style: 'Round Neck with Piping',
      sleeve_style: 'Short Sleeve',
      embroidery_style: 'Classic Pearl Border',
      fabric_notes: 'Forest green silk with traditional gold border. Cotton lining requested.',
      cost: 2500,
      advance_paid: 2500,
      status: 'Stitching' as const,
      order_date: '2026-05-19',
      due_date: '2026-05-28',
      staff_assigned: 'Selvam (Senior Tailor)',
      inspiration_image: null,
      created_at: new Date().toISOString()
    },
    {
      id: 'ord-104',
      customer_id: 'cust-4',
      customer_name: 'Sushmitha Sen',
      phone: '9566234981',
      stitching_item: 'Designer Lehenga Choli',
      neck_style: 'Sweetheart Neck',
      sleeve_style: 'Elbow with Puff',
      embroidery_style: 'Elegant Stone & Sequins All-Over',
      fabric_notes: 'Pastel pink Georgette, heavy glass stones, gold threads, sequins details.',
      cost: 16500,
      advance_paid: 8000,
      status: 'Measuring' as const,
      order_date: '2026-05-22',
      due_date: '2026-06-18',
      staff_assigned: 'Selvi (Embroidery Expert)',
      inspiration_image: '/assets/hero-bridal.png',
      created_at: new Date().toISOString()
    }
  ],
  appointments: [
    {
      id: 'apt-201',
      user_id: 'cust-1',
      name: 'Priya Dharshini',
      phone: '9840123456',
      email: 'priya.d@gmail.com',
      date: '2026-05-25',
      time: '11:00 AM',
      type: 'Trial Appointment' as const,
      notes: 'Trial for bridal blouse back pattern. Gold threads check.',
      status: 'Confirmed' as const,
      created_at: new Date().toISOString()
    },
    {
      id: 'apt-202',
      user_id: null,
      name: 'Harini Sundar',
      phone: '9600128374',
      email: 'harini.s@yahoo.com',
      date: '2026-05-26',
      time: '03:30 PM',
      type: 'Bridal Consultation' as const,
      notes: 'Wedding planned for Sept 2026. Needs Aari work quote for 4 sarees.',
      status: 'Confirmed' as const,
      created_at: new Date().toISOString()
    },
    {
      id: 'apt-203',
      user_id: null,
      name: 'Divya Rajesh',
      phone: '9003456712',
      email: 'divya.rajesh@gmail.com',
      date: '2026-05-27',
      time: '05:00 PM',
      type: 'Home Measurement' as const,
      notes: 'Address: Block 4A, Shanthi Apartments, Adyar. 3 designer blouses.',
      status: 'Pending' as const,
      created_at: new Date().toISOString()
    },
    {
      id: 'apt-204',
      user_id: null,
      name: 'Anjana Nair',
      phone: '9176543210',
      email: 'anjana.n@gmail.com',
      date: '2026-05-24',
      time: '12:00 PM',
      type: 'Boutique Visit' as const,
      notes: 'Alteration of designer lehenga waistline.',
      status: 'Completed' as const,
      created_at: new Date().toISOString()
    }
  ],
  staff: [
    { id: 'stf-1', name: 'Ramu', role: 'Master Cutter', orders_count: 1, active: true },
    { id: 'stf-2', name: 'Kalyan', role: 'Aari Master', orders_count: 1, active: true },
    { id: 'stf-3', name: 'Selvam', role: 'Senior Tailor', orders_count: 1, active: true },
    { id: 'stf-4', name: 'Selvi', role: 'Embroidery Expert', orders_count: 1, active: true },
    { id: 'stf-5', name: 'Mohan', role: 'Stitching Expert', orders_count: 0, active: true }
  ],
  gallery: [
    { id: 'gal-1', title: 'Royal Crimson Peacock Back', category: 'Bridal Blouses', image: '/assets/designer-blouse.png', likes: 124, created_at: new Date().toISOString() },
    { id: 'gal-2', title: 'Intricate Lotus Zardosi Neck', category: 'Aari Work', image: '/assets/aari-detail.png', likes: 218, created_at: new Date().toISOString() },
    { id: 'gal-3', title: 'Gold Zari Lehenga Choli', category: 'Wedding Collection', image: '/assets/hero-bridal.png', likes: 345, created_at: new Date().toISOString() },
    { id: 'gal-4', title: 'Classic Kundan Elbow Pattern', category: 'Maggam Work', image: '/assets/designer-blouse.png', likes: 98, created_at: new Date().toISOString() },
    { id: 'gal-5', title: 'Ethnic Girls Silk Pattu Pavadai', category: 'Kids Fashion', image: '/assets/hero-bridal.png', likes: 76, created_at: new Date().toISOString() },
    { id: 'gal-6', title: 'Floral Stone Mesh Border', category: 'Party Wear', image: '/assets/aari-detail.png', likes: 153, created_at: new Date().toISOString() }
  ],
  notifications: [
    { id: 'not-1', title: 'New Custom Blouse Design Submitted', message: 'Sushmitha Sen submitted a Sweetheart neck design with heavy embroidery intensity.', created_at: '2026-05-22T00:00:00Z', read: false },
    { id: 'not-2', title: 'Appointment Booking Pending Review', message: 'Divya Rajesh requested a Home Measurement booking for May 27th.', created_at: '2026-05-22T00:00:00Z', read: false },
    { id: 'not-3', title: 'Order Target Delivery Approaching', message: 'Classic Kanchipuram Silk Blouse (ord-103) is due in 4 days.', created_at: '2026-05-24T00:00:00Z', read: true }
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Royal Peacock Aari Blouse',
      category: 'aari-work-blouses' as const,
      price: 8500,
      discount: 15,
      rating: 4.9,
      description: 'Deep crimson raw silk base blouse with heavy Zari peacock embroidery, Kundan stone highlights, and elegant back drapes.',
      image: '/assets/aari-detail.png',
      images: ['/assets/aari-detail.png', '/assets/designer-blouse.png', '/assets/hero-bridal.png'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Royal Crimson', 'Forest Green', 'Midnight Black'],
      fabric: 'Raw Silk base, Premium Metallic Gold Thread spools',
      delivery_days: 7,
      stock: 4,
      reviews: [
        { user: 'Harini S.', rating: 5, text: 'Exquisite bridal stitching, the peacock outlines look stunning!' },
        { user: 'Priya M.', rating: 5, text: 'Fit is perfect. Highly recommend the Maggam sleeves.' }
      ],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-2',
      name: 'Queen Sweetheart Maggam Blouse',
      category: 'maggam-work-collections' as const,
      price: 7200,
      discount: 10,
      rating: 4.8,
      description: 'A classic sweetheart neckline designer blouse featuring heavy stone settings and spring tube bead border details.',
      image: '/assets/designer-blouse.png',
      images: ['/assets/designer-blouse.png', '/assets/aari-detail.png'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Maroon Gold', 'Royal Blue', 'Champagne Pink'],
      fabric: 'Tussar Silk with Cotton Lining padding',
      delivery_days: 6,
      stock: 6,
      reviews: [
        { user: 'Divya R.', rating: 5, text: 'Beautiful beads. The sweetheart neck fits like a dream.' }
      ],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-3',
      name: 'Mughal Royal Silk Anarkali Set',
      category: 'ready-made-dresses' as const,
      price: 9800,
      discount: 12,
      rating: 4.7,
      description: 'Heritage banarasi silk flare suit with hand-woven borders, comfortable cotton lining, and a georgette floral dupatta.',
      image: '/assets/hero-bridal.png',
      images: ['/assets/hero-bridal.png', '/assets/designer-blouse.png'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Deep Wine', 'Emerald Green', 'Mustard Yellow'],
      fabric: 'Banarasi Brocade Silk, 100% fine cotton backing',
      delivery_days: 5,
      stock: 5,
      reviews: [
        { user: 'Ananya K.', rating: 4, text: 'Heavy and elegant, wore it for a reception and received compliments!' }
      ],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-4',
      name: 'Emperor Brocade Bridal Lehenga',
      category: 'bridal-collections' as const,
      price: 24500,
      discount: 20,
      rating: 5.0,
      description: 'An absolute masterpiece. Deep royal maroon lehenga skirt featuring 24 dynamic panels, gold border zardozi, and matching choli with twin dupattas.',
      image: '/assets/hero-bridal.png',
      images: ['/assets/hero-bridal.png', '/assets/aari-detail.png', '/assets/designer-blouse.png'],
      sizes: ['S', 'M', 'L'],
      colors: ['Royal Maroon', 'Crimson Gold', 'Classic Ivory'],
      fabric: 'Premium Kanchipuram Brocade Silk, Net dupattas',
      delivery_days: 14,
      stock: 2,
      reviews: [
        { user: 'Sushmitha S.', rating: 5, text: 'Perfect bridal silhouette. Absolute masterpiece of craftsmanship.' }
      ],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-5',
      name: 'Pastel Mesh Reception Gown',
      category: 'party-wear-dresses' as const,
      price: 14500,
      discount: 15,
      rating: 4.8,
      description: 'Pastel pink flowy georgette gown decorated with elegant sequins, glass crystal drops, and a modern side slit overlay.',
      image: '/assets/hero-bridal.png',
      images: ['/assets/hero-bridal.png', '/assets/designer-blouse.png'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blush Pink', 'Lilac Mist', 'Sky Blue'],
      fabric: 'Georgette, Premium tulle overlay, Silk underskirt',
      delivery_days: 8,
      stock: 3,
      reviews: [
        { user: 'Meera R.', rating: 5, text: 'Extremely elegant. Fits perfectly and flows beautifully.' }
      ],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-6',
      name: 'Heritage Kids Pattu Pavadai Set',
      category: 'kids-dresses' as const,
      price: 4200,
      discount: 0,
      rating: 4.7,
      description: 'Pure silk traditional skirt and puff-sleeve top set for young girls, styled with premium gold zari borders and standard linings.',
      image: '/assets/hero-bridal.png',
      images: ['/assets/hero-bridal.png', '/assets/aari-detail.png'],
      sizes: ['24 (Age 3-4)', '28 (Age 5-6)', '32 (Age 7-8)'],
      colors: ['Turquoise Pink', 'Yellow Maroon', 'Green Orange'],
      fabric: 'Traditional Southern Kanchi Silk base',
      delivery_days: 4,
      stock: 8,
      reviews: [
        { user: 'Radha N.', rating: 5, text: 'Super soft inside! No stitching itchiness for my daughter.' }
      ],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-7',
      name: 'Banarasi Golden Kaftan Suit',
      category: 'ethnic-wear' as const,
      price: 6800,
      discount: 10,
      rating: 4.6,
      description: 'Relaxed yet majestic ethnic kaftan suit crafted from Banarasi silk with a customized neck drawstring and matching pants.',
      image: '/assets/designer-blouse.png',
      images: ['/assets/designer-blouse.png', '/assets/hero-bridal.png'],
      sizes: ['Free Size (Fits S-XXL)'],
      colors: ['Antique Gold', 'Burgundy Red', 'Teal Blue'],
      fabric: 'Art Silk with fine metallic brocade stitch',
      delivery_days: 5,
      stock: 6,
      reviews: [
        { user: 'Kalyani S.', rating: 4, text: 'Comfortable and looks rich. Ideal for festive family dinners.' }
      ],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-8',
      name: 'Kanchipuram Brocade Saree',
      category: 'sarees' as const,
      price: 18500,
      discount: 10,
      rating: 4.9,
      description: 'Handloom Kanchipuram silk saree with classic temple border designs and full gold zari rich pallu. Blouse piece is unstitched.',
      image: '/assets/hero-bridal.png',
      images: ['/assets/hero-bridal.png', '/assets/aari-detail.png'],
      sizes: ['Standard 5.5m Saree + 0.8m Blouse'],
      colors: ['Emerald Green', 'Temple Crimson', 'Golden Mustard'],
      fabric: '100% Pure Southern Handloom Silk',
      delivery_days: 6,
      stock: 4,
      reviews: [
        { user: 'Uma M.', rating: 5, text: 'Authentic feel, the brocade zari glows beautifully under light.' }
      ],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-9',
      name: 'Hand-Stitched Zardozi Clutch',
      category: 'boutique-accessories' as const,
      price: 2800,
      discount: 0,
      rating: 4.7,
      description: 'Premium raw silk hard-case clutch decorated with handmade Zardozi motifs, pearl borders, and a removable gold chain strap.',
      image: '/assets/aari-detail.png',
      images: ['/assets/aari-detail.png', '/assets/designer-blouse.png'],
      sizes: ['One Size (7.5" x 4.5")'],
      colors: ['Deep Maroon', 'Dull Gold', 'Emerald Green'],
      fabric: 'Raw Silk fabric wrapping, Velvet lining',
      delivery_days: 3,
      stock: 12,
      reviews: [
        { user: 'Srilekha V.', rating: 5, text: 'Fits my phone and cards. Absolute luxury accessory!' }
      ],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-10',
      name: 'Pearl Silk Potli Bag',
      category: 'boutique-accessories' as const,
      price: 1500,
      discount: 10,
      rating: 4.5,
      description: 'Charming draw-string potli bag decorated with pearls and golden bead tassels, matches bridal ensembles perfectly.',
      image: '/assets/designer-blouse.png',
      images: ['/assets/designer-blouse.png'],
      sizes: ['One Size'],
      colors: ['Gold Cream', 'Crimson Red', 'Mint Green'],
      fabric: 'Raw Silk base, Pearl tassels',
      delivery_days: 3,
      stock: 15,
      reviews: [],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-11',
      name: 'Designer Zari Outline Blouse',
      category: 'designer-blouses' as const,
      price: 3500,
      discount: 5,
      rating: 4.6,
      description: 'A custom-stitched designer blouse featuring solid piping borders and double-stitch padded lining templates.',
      image: '/assets/designer-blouse.png',
      images: ['/assets/designer-blouse.png', '/assets/aari-detail.png'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Bright Red', 'Classic Black', 'Forest Green'],
      fabric: 'Raw Silk with standard cotton base linings',
      delivery_days: 5,
      stock: 10,
      reviews: [],
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-12',
      name: 'Lotus Outline Maggam Border Base',
      category: 'maggam-work-collections' as const,
      price: 5400,
      discount: 15,
      rating: 4.8,
      description: 'A stunning Maggam embroidery template showcasing intricate hand-stitched lotus borders, beads, and gold piping threads.',
      image: '/assets/aari-detail.png',
      images: ['/assets/aari-detail.png', '/assets/designer-blouse.png'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Magenta Gold', 'Teal Green', 'Deep Plum'],
      fabric: 'Mulberry silk fabric with frames backing',
      delivery_days: 7,
      stock: 5,
      reviews: [],
      created_at: new Date().toISOString()
    }
  ]
};

// Safe wrapper class to query local storage or Supabase database
class BoutiqueDatabaseService {
  isSupabaseActive(): boolean {
    return supabase !== null;
  }

  // Generic state loading for localStorage simulation
  getLocalState() {
    if (typeof window === 'undefined') return seedData;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
    try {
      const parsed = JSON.parse(data);
      // Seed missing collections if any
      let modified = false;
      Object.keys(seedData).forEach((key) => {
        if (!parsed[key]) {
          parsed[key] = seedData[key as keyof typeof seedData];
          modified = true;
        }
      });
      if (modified) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    } catch (e) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
  }

  saveLocalState(state: any) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    if (this.isSupabaseActive() && supabase) {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Product[];
      console.error('Supabase getProducts error:', error);
    }
    return this.getLocalState().products;
  }

  async addProduct(product: Partial<Product>): Promise<Product> {
    const newId = `prod-${Math.floor(Math.random() * 900) + 1}`;
    const newProd: Product = {
      id: newId,
      name: product.name || 'Bespoke Couture Design',
      category: product.category || 'designer-blouses',
      price: product.price || 0,
      discount: product.discount || 0,
      rating: 5.0,
      description: product.description || '',
      image: product.image || '/assets/designer-blouse.png',
      images: product.images || ['/assets/designer-blouse.png'],
      sizes: product.sizes || ['XS', 'S', 'M', 'L', 'XL'],
      colors: product.colors || ['Gold', 'Crimson Maroon'],
      fabric: product.fabric || 'Raw Silk',
      delivery_days: product.delivery_days || 7,
      stock: product.stock || 5,
      reviews: [],
      created_at: new Date().toISOString()
    };

    if (this.isSupabaseActive() && supabase) {
      const { data, error } = await supabase.from('products').insert([newProd]).select();
      if (!error && data && data[0]) return data[0] as Product;
      console.error('Supabase addProduct error:', error);
    }

    const state = this.getLocalState();
    state.products.unshift(newProd);
    this.saveLocalState(state);
    return newProd;
  }

  // --- ORDERS ---
  async getOrders(customerId?: string): Promise<Order[]> {
    if (this.isSupabaseActive() && supabase) {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (customerId) {
        query = query.eq('customer_id', customerId);
      }
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Order[];
      console.error('Supabase getOrders error:', error);
    }
    const orders = this.getLocalState().orders;
    if (customerId) {
      return orders.filter((o: any) => o.customer_id === customerId);
    }
    return orders;
  }

  async addOrder(order: Partial<Order>): Promise<Order> {
    const newId = `ord-${100 + Math.floor(Math.random() * 900) + 1}`;
    const newOrder: Order = {
      id: newId,
      order_date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      customer_name: order.customer_name || 'Client',
      phone: order.phone || '',
      stitching_item: order.stitching_item || 'Bespoke Item',
      neck_style: order.neck_style || null,
      sleeve_style: order.sleeve_style || null,
      embroidery_style: order.embroidery_style || null,
      fabric_notes: order.fabric_notes || null,
      cost: order.cost || 0,
      advance_paid: order.advance_paid || 0,
      staff_assigned: order.staff_assigned || 'Pending Assignment',
      inspiration_image: order.inspiration_image || null,
      customer_id: order.customer_id || null,
      due_date: order.due_date || null,
      created_at: new Date().toISOString(),
    };

    if (this.isSupabaseActive() && supabase) {
      // Ensure we insert into profiles/users if necessary or bypass
      const { data, error } = await supabase.from('orders').insert([newOrder]).select();
      if (!error && data && data[0]) {
        await this.addNotification({
          title: 'New Stitching Order Created',
          message: `Order ${data[0].id} created for ${data[0].customer_name} (${data[0].stitching_item}).`
        });
        return data[0] as Order;
      }
      console.error('Supabase addOrder error:', error);
    }

    const state = this.getLocalState();
    state.orders.unshift(newOrder);
    this.saveLocalState(state);
    
    await this.addNotification({
      title: 'New Stitching Order Created',
      message: `Order ${newId} created for ${newOrder.customer_name} (${newOrder.stitching_item}).`
    });

    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    if (this.isSupabaseActive() && supabase) {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (!error) return true;
      console.error('Supabase updateOrderStatus error:', error);
    }
    const state = this.getLocalState();
    state.orders = state.orders.map((o: any) => o.id === orderId ? { ...o, status } : o);
    this.saveLocalState(state);
    return true;
  }

  async updateOrderStaff(orderId: string, staffName: string): Promise<boolean> {
    if (this.isSupabaseActive() && supabase) {
      const { error } = await supabase.from('orders').update({ staff_assigned: staffName }).eq('id', orderId);
      if (!error) return true;
      console.error('Supabase updateOrderStaff error:', error);
    }
    const state = this.getLocalState();
    state.orders = state.orders.map((o: any) => o.id === orderId ? { ...o, staff_assigned: staffName } : o);
    this.saveLocalState(state);
    return true;
  }

  async updateOrderStitching(orderId: string, fields: Partial<Order>): Promise<boolean> {
    if (this.isSupabaseActive() && supabase) {
      const { error } = await supabase.from('orders').update(fields).eq('id', orderId);
      if (!error) return true;
      console.error('Supabase updateOrderStitching error:', error);
    }
    const state = this.getLocalState();
    state.orders = state.orders.map((o: any) => o.id === orderId ? { ...o, ...fields } : o);
    this.saveLocalState(state);
    return true;
  }

  // --- APPOINTMENTS ---
  async getAppointments(userId?: string): Promise<Appointment[]> {
    if (this.isSupabaseActive() && supabase) {
      let query = supabase.from('appointments').select('*').order('date', { ascending: true });
      if (userId) query = query.eq('user_id', userId);
      const { data, error } = await query;
      if (!error && data) return data as Appointment[];
      console.error('Supabase getAppointments error:', error);
    }
    const appointments = this.getLocalState().appointments;
    if (userId) {
      return appointments.filter((a: any) => a.user_id === userId);
    }
    return appointments;
  }

  async addAppointment(apt: Partial<Appointment>): Promise<Appointment> {
    const newId = `apt-${200 + Math.floor(Math.random() * 800) + 1}`;
    const newApt: Appointment = {
      id: newId,
      status: 'Pending',
      name: apt.name || '',
      phone: apt.phone || '',
      email: apt.email || null,
      date: apt.date || '',
      time: apt.time || '',
      type: apt.type || 'Bridal Consultation',
      notes: apt.notes || null,
      user_id: apt.user_id || null,
      created_at: new Date().toISOString()
    };

    if (this.isSupabaseActive() && supabase) {
      const { data, error } = await supabase.from('appointments').insert([newApt]).select();
      if (!error && data && data[0]) {
        await this.addNotification({
          title: 'New Appointment Scheduled',
          message: `${data[0].name} booked a ${data[0].type} on ${data[0].date} at ${data[0].time}.`
        });
        return data[0] as Appointment;
      }
      console.error('Supabase addAppointment error:', error);
    }

    const state = this.getLocalState();
    state.appointments.unshift(newApt);
    this.saveLocalState(state);

    await this.addNotification({
      title: 'New Appointment Scheduled',
      message: `${newApt.name} booked a ${newApt.type} on ${newApt.date} at ${newApt.time}.`
    });

    return newApt;
  }

  async updateAppointmentStatus(aptId: string, status: Appointment['status']): Promise<boolean> {
    if (this.isSupabaseActive() && supabase) {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', aptId);
      if (!error) return true;
      console.error('Supabase updateAppointmentStatus error:', error);
    }
    const state = this.getLocalState();
    state.appointments = state.appointments.map((a: any) => a.id === aptId ? { ...a, status } : a);
    this.saveLocalState(state);
    return true;
  }

  // --- CUSTOMERS & PROFILES ---
  async getCustomers(): Promise<Profile[]> {
    if (this.isSupabaseActive() && supabase) {
      const { data, error } = await supabase.from('profiles').select('*').order('joined_date', { ascending: false });
      if (!error && data) {
        // Map columns to our measurements sub-object structure
        return data.map((p: any) => ({
          id: p.id, name: p.name, email: p.email, phone: p.phone, role: p.role, joined_date: p.joined_date, notes: p.notes,
          measurements: {
            chest: p.chest || 0, waist: p.waist || 0, blouse_length: p.blouse_length || 0, shoulder: p.shoulder || 0,
            front_neck: p.front_neck || 0, back_neck: p.back_neck || 0, sleeve_length: p.sleeve_length || 0, sleeve_round: p.sleeve_round || 0, arm_hole: p.arm_hole || 0
          }
        })) as Profile[];
      }
      console.error('Supabase getCustomers error:', error);
    }
    return this.getLocalState().customers;
  }

  async addCustomer(customer: Partial<Profile>): Promise<Profile> {
    const newId = customer.id || `cust-${Math.floor(Math.random() * 900) + 1}`;
    const newCustomer: Profile = {
      id: newId,
      name: customer.name || 'Client',
      phone: customer.phone || '',
      email: customer.email || `${newId}@example.com`,
      role: customer.role || 'customer',
      joined_date: new Date().toISOString().split('T')[0],
      notes: customer.notes || '',
      measurements: customer.measurements || {
        chest: 0, waist: 0, blouse_length: 0, shoulder: 0,
        front_neck: 0, back_neck: 0, sleeve_length: 0, sleeve_round: 0, arm_hole: 0
      }
    };

    if (this.isSupabaseActive() && supabase) {
      // Map properties back to flat Supabase columns
      const flatProfile = {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        role: newCustomer.role,
        notes: newCustomer.notes,
        ...newCustomer.measurements
      };
      const { data, error } = await supabase.from('profiles').insert([flatProfile]).select();
      if (!error && data && data[0]) return newCustomer;
      console.error('Supabase addCustomer error:', error);
    }

    const state = this.getLocalState();
    state.customers.push(newCustomer);
    this.saveLocalState(state);
    return newCustomer;
  }

  async updateCustomerMeasurements(customerId: string, measurements: Partial<SizingMeasurements>): Promise<boolean> {
    if (this.isSupabaseActive() && supabase) {
      const { error } = await supabase.from('profiles').update(measurements).eq('id', customerId);
      if (!error) return true;
      console.error('Supabase updateCustomerMeasurements error:', error);
    }
    const state = this.getLocalState();
    state.customers = state.customers.map((c: any) => {
      if (c.id === customerId) {
        return { ...c, measurements: { ...c.measurements, ...measurements } };
      }
      return c;
    });
    this.saveLocalState(state);
    return true;
  }

  // --- NOTIFICATIONS ---
  async getNotifications(): Promise<Notification[]> {
    if (this.isSupabaseActive() && supabase) {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Notification[];
      console.error('Supabase getNotifications error:', error);
    }
    return this.getLocalState().notifications;
  }

  async addNotification(notif: Partial<Notification>): Promise<Notification> {
    const newNotif: Notification = {
      id: `not-${Math.floor(Math.random() * 900) + 1}`,
      created_at: new Date().toISOString(),
      read: false,
      title: notif.title || 'Notification',
      message: notif.message || '',
    };

    if (this.isSupabaseActive() && supabase) {
      const { data, error } = await supabase.from('notifications').insert([newNotif]).select();
      if (!error && data && data[0]) return data[0] as Notification;
      console.error('Supabase addNotification error:', error);
    }

    const state = this.getLocalState();
    state.notifications.unshift(newNotif);
    this.saveLocalState(state);
    return newNotif;
  }

  async markNotificationAsRead(notifId: string): Promise<boolean> {
    if (this.isSupabaseActive() && supabase) {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notifId);
      if (!error) return true;
      console.error('Supabase markNotificationAsRead error:', error);
    }
    const state = this.getLocalState();
    state.notifications = state.notifications.map((n: any) => n.id === notifId ? { ...n, read: true } : n);
    this.saveLocalState(state);
    return true;
  }

  // --- GALLERY ---
  async getGallery(): Promise<GalleryItem[]> {
    if (this.isSupabaseActive() && supabase) {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as GalleryItem[];
      console.error('Supabase getGallery error:', error);
    }
    return this.getLocalState().gallery;
  }

  async addGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      id: `gal-${Math.floor(Math.random() * 900) + 1}`,
      likes: 0,
      title: item.title || '',
      category: item.category || '',
      image: item.image || '',
      created_at: new Date().toISOString(),
    };

    if (this.isSupabaseActive() && supabase) {
      const { data, error } = await supabase.from('gallery').insert([newItem]).select();
      if (!error && data && data[0]) return data[0] as GalleryItem;
      console.error('Supabase addGalleryItem error:', error);
    }

    const state = this.getLocalState();
    state.gallery.unshift(newItem);
    this.saveLocalState(state);
    return newItem;
  }

  async likeGalleryItem(itemId: string): Promise<boolean> {
    if (this.isSupabaseActive() && supabase) {
      // In Supabase we use the RPC function likes = likes + 1
      const { error } = await supabase.rpc('like_gallery_item', { item_id: itemId });
      if (!error) return true;
      console.error('Supabase likeGalleryItem RPC error:', error);
    }
    const state = this.getLocalState();
    state.gallery = state.gallery.map((g: any) => g.id === itemId ? { ...g, likes: g.likes + 1 } : g);
    this.saveLocalState(state);
    return true;
  }

  // --- STAFF ---
  async getStaff(): Promise<Staff[]> {
    if (this.isSupabaseActive() && supabase) {
      const { data, error } = await supabase.from('staff').select('*').order('name', { ascending: true });
      if (!error && data) return data as Staff[];
      console.error('Supabase getStaff error:', error);
    }
    return this.getLocalState().staff || [];
  }

  // --- STATIC CONFIG ---
  getConfig() {
    return this.getLocalState().config;
  }
}

export const BoutiqueDB = new BoutiqueDatabaseService();
