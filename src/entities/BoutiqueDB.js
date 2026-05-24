// src/entities/BoutiqueDB.js

/**
 * BoutiqueDB manages all persistent local storage states for Mahathi Tailor Shop.
 * It contains realistic seed data and implements a simple pub/sub pattern for React reactivity.
 */
class BoutiqueDBClass {
  constructor() {
    this.storageKey = 'mahathi_tailor_db';
    this.listeners = [];
    this.init();
  }

  // Initialize DB from LocalStorage or seed realistic high-end boutique data
  init() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      this.state = this.getSeedData();
      this.save();
    } else {
      try {
        this.state = JSON.parse(data);
        // Ensure all collections exist
        const seeds = this.getSeedData();
        Object.keys(seeds).forEach(key => {
          if (!this.state[key]) {
            this.state[key] = seeds[key];
          }
        });
        // Force upgrade products catalog to the new 12 luxury items if they have the older version
        if (!this.state.products || this.state.products.length < 10) {
          this.state.products = seeds.products;
          this.state.wishlist = seeds.wishlist || [];
          this.state.addresses = seeds.addresses || [];
          this.save();
        }
      } catch (e) {
        console.error('Error parsing BoutiqueDB data, re-seeding...', e);
        this.state = this.getSeedData();
        this.save();
      }
    }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.notify();
  }

  // Reactive listener subscriptions
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify() {
    this.listeners.forEach(callback => callback(this.state));
  }

  // Retrieve current active state
  getState() {
    return this.state;
  }

  // Real, rich luxury fashion-tech seed data
  getSeedData() {
    return {
      config: {
        phone: '+91 98401 23456',
        whatsapp: '919840123456',
        instagram: 'https://instagram.com/mahathitailors',
        facebook: 'https://facebook.com/mahathitailors',
        address: 'No. 14, Pondy Bazaar, T. Nagar, Chennai - 600017',
        email: 'info@mahathitailors.com',
        hours: 'Mon - Sun: 10:00 AM - 09:00 PM'
      },
      customers: [
        {
          id: 'cust-1',
          name: 'Priya Dharshini',
          phone: '9840123456',
          email: 'priya.d@gmail.com',
          joinedDate: '2026-02-14',
          notes: 'Bridal customer, prefers heavy zari work and stone settings. Extremely particular about neck fit.',
          measurements: {
            chest: 36,
            waist: 30,
            blouseLength: 14.5,
            shoulder: 14.25,
            frontNeck: 7.5,
            backNeck: 9.5,
            sleeveLength: 11.0,
            sleeveRound: 11.5,
            armHole: 16.5
          }
        },
        {
          id: 'cust-2',
          name: 'Ananya Krishnan',
          phone: '9790987654',
          email: 'ananya.k@hotmail.com',
          joinedDate: '2026-03-01',
          notes: 'Likes minimalist design. Requested high-neck designer cuts.',
          measurements: {
            chest: 34,
            waist: 28,
            blouseLength: 14.0,
            shoulder: 13.75,
            frontNeck: 6.5,
            backNeck: 8.0,
            sleeveLength: 10.5,
            sleeveRound: 10.75,
            armHole: 15.5
          }
        },
        {
          id: 'cust-3',
          name: 'Dr. Meera Radhakrishnan',
          phone: '9444556677',
          email: 'meera.r@meduniv.edu',
          joinedDate: '2026-04-10',
          notes: 'Regular ethnic-wear customer. Prefers comfortable armholes and traditional cotton linings.',
          measurements: {
            chest: 40,
            waist: 35,
            blouseLength: 15.0,
            shoulder: 15.0,
            frontNeck: 7.0,
            backNeck: 8.5,
            sleeveLength: 9.5,
            sleeveRound: 13.0,
            armHole: 18.0
          }
        },
        {
          id: 'cust-4',
          name: 'Sushmitha Sen',
          phone: '9566234981',
          email: 'sushmitha.sen@gmail.com',
          joinedDate: '2026-05-01',
          notes: 'Ordering lehenga and blouse for wedding reception. Wants full custom designer trial.',
          measurements: {
            chest: 32,
            waist: 26,
            blouseLength: 13.5,
            shoulder: 13.5,
            frontNeck: 8.0,
            backNeck: 10.5,
            sleeveLength: 12.0,
            sleeveRound: 10.0,
            armHole: 14.5
          }
        }
      ],
      orders: [
        {
          id: 'ord-101',
          customerId: 'cust-1',
          customerName: 'Priya Dharshini',
          phone: '9840123456',
          stitchingItem: 'Bridal Blouse',
          neckStyle: 'Royal Pot Neck',
          sleeveStyle: 'Elbow Sleeve',
          embroideryStyle: 'Heavy Aari & Zardosi Work',
          fabricNotes: 'Deep Maroon raw silk, gold zari threads with red Kundan stone accents.',
          cost: 8500,
          advancePaid: 3000,
          status: 'Embroidery', // Pending, Measuring, Cutting, Embroidery, Stitching, Trial, Completed
          orderDate: '2026-05-10',
          dueDate: '2026-06-05',
          staffAssigned: 'Kalyan (Aari Master)',
          inspirationImage: './assets/designer-blouse.png'
        },
        {
          id: 'ord-102',
          customerId: 'cust-2',
          customerName: 'Ananya Krishnan',
          phone: '9790987654',
          stitchingItem: 'Designer Boat Blouse',
          neckStyle: 'Boat Neck',
          sleeveStyle: 'Cap Sleeve',
          embroideryStyle: 'Minimalist Floral Border',
          fabricNotes: 'Mustard yellow tussar silk, light beads and spring work.',
          cost: 3200,
          advancePaid: 1500,
          status: 'Cutting',
          orderDate: '2026-05-18',
          dueDate: '2026-05-30',
          staffAssigned: 'Ramu (Master Cutter)',
          inspirationImage: null
        },
        {
          id: 'ord-103',
          customerId: 'cust-3',
          customerName: 'Dr. Meera Radhakrishnan',
          phone: '9444556677',
          stitchingItem: 'Kanchipuram Silk Blouse',
          neckStyle: 'Round Neck with Piping',
          sleeveStyle: 'Short Sleeve',
          embroideryStyle: 'Classic Pearl Border',
          fabricNotes: 'Forest green silk with traditional gold border. Cotton lining requested.',
          cost: 2500,
          advancePaid: 2500,
          status: 'Stitching',
          orderDate: '2026-05-19',
          dueDate: '2026-05-28',
          staffAssigned: 'Selvam (Senior Tailor)',
          inspirationImage: null
        },
        {
          id: 'ord-104',
          customerId: 'cust-4',
          customerName: 'Sushmitha Sen',
          phone: '9566234981',
          stitchingItem: 'Designer Lehenga Choli',
          neckStyle: 'Sweetheart Neck',
          sleeveStyle: 'Elbow with Puff',
          embroideryStyle: 'Elegant Stone & Sequins All-Over',
          fabricNotes: 'Pastel pink Georgette, heavy glass stones, gold threads, sequins details.',
          cost: 16500,
          advancePaid: 8000,
          status: 'Measuring',
          orderDate: '2026-05-22',
          dueDate: '2026-06-18',
          staffAssigned: 'Selvi (Embroidery Expert)',
          inspirationImage: './assets/hero-bridal.png'
        }
      ],
      appointments: [
        {
          id: 'apt-201',
          name: 'Priya Dharshini',
          phone: '9840123456',
          email: 'priya.d@gmail.com',
          date: '2026-05-25',
          time: '11:00 AM',
          type: 'Trial Appointment', // Boutique Visit, Home Measurement, Bridal Consultation, Trial Appointment
          notes: 'Trial for bridal blouse back pattern. Gold threads check.',
          status: 'Confirmed' // Pending, Confirmed, Completed, Cancelled
        },
        {
          id: 'apt-202',
          name: 'Harini Sundar',
          phone: '9600128374',
          email: 'harini.s@yahoo.com',
          date: '2026-05-26',
          time: '03:30 PM',
          type: 'Bridal Consultation',
          notes: 'Wedding planned for Sept 2026. Needs Aari work quote for 4 sarees.',
          status: 'Confirmed'
        },
        {
          id: 'apt-203',
          name: 'Divya Rajesh',
          phone: '9003456712',
          email: 'divya.rajesh@gmail.com',
          date: '2026-05-27',
          time: '05:00 PM',
          type: 'Home Measurement',
          notes: 'Address: Block 4A, Shanthi Apartments, Adyar. 3 designer blouses.',
          status: 'Pending'
        },
        {
          id: 'apt-204',
          name: 'Anjana Nair',
          phone: '9176543210',
          email: 'anjana.n@gmail.com',
          date: '2026-05-24',
          time: '12:00 PM',
          type: 'Boutique Visit',
          notes: 'Alteration of designer lehenga waistline.',
          status: 'Completed'
        }
      ],
      staff: [
        { id: 'stf-1', name: 'Ramu', role: 'Master Cutter', ordersCount: 1, active: true },
        { id: 'stf-2', name: 'Kalyan', role: 'Aari Master', ordersCount: 1, active: true },
        { id: 'stf-3', name: 'Selvam', role: 'Senior Tailor', ordersCount: 1, active: true },
        { id: 'stf-4', name: 'Selvi', role: 'Embroidery Expert', ordersCount: 1, active: true },
        { id: 'stf-5', name: 'Mohan', role: 'Stitching Expert', ordersCount: 0, active: true }
      ],
      gallery: [
        { id: 'gal-1', title: 'Royal Crimson Peacock Back', category: 'Bridal Blouses', image: './assets/designer-blouse.png', likes: 124 },
        { id: 'gal-2', title: 'Intricate Lotus Zardosi Neck', category: 'Aari Work', image: './assets/aari-detail.png', likes: 218 },
        { id: 'gal-3', title: 'Gold Zari Lehenga Choli', category: 'Wedding Collection', image: './assets/hero-bridal.png', likes: 345 },
        { id: 'gal-4', title: 'Classic Kundan Elbow Pattern', category: 'Maggam Work', image: './assets/designer-blouse.png', likes: 98 },
        { id: 'gal-5', title: 'Ethnic Girls Silk Pattu Pavadai', category: 'Kids Fashion', image: './assets/hero-bridal.png', likes: 76 },
        { id: 'gal-6', title: 'Floral Stone Mesh Border', category: 'Party Wear', image: './assets/aari-detail.png', likes: 153 }
      ],
      notifications: [
        { id: 'not-1', title: 'New Custom Blouse Design Submitted', message: 'Sushmitha Sen submitted a Sweetheart neck design with high embroidery intensity.', date: '2026-05-22', read: false },
        { id: 'not-2', title: 'Appointment Booking Pending Review', message: 'Divya Rajesh requested a Home Measurement booking for May 27th.', date: '2026-05-22', read: false },
        { id: 'not-3', title: 'Order Target Delivery Approaching', message: 'Classic Kanchipuram Silk Blouse (ord-103) is due in 4 days.', date: '2026-05-24', read: true }
      ],
      products: [
        {
          id: 'prod-1',
          name: 'Royal Peacock Aari Blouse',
          category: 'aari-work-blouses',
          price: 8500,
          discount: 15,
          rating: 4.9,
          description: 'Deep crimson raw silk base blouse with heavy Zari peacock embroidery, Kundan stone highlights, and elegant back drapes.',
          image: './assets/aari-detail.png',
          images: ['./assets/aari-detail.png', './assets/designer-blouse.png', './assets/hero-bridal.png'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Royal Crimson', 'Forest Green', 'Midnight Black'],
          fabric: 'Raw Silk base, Premium Metallic Gold Thread spools',
          deliveryDays: 7,
          stock: 4,
          reviews: [
            { user: 'Harini S.', rating: 5, text: 'Exquisite bridal stitching, the peacock outlines look stunning!' },
            { user: 'Priya M.', rating: 5, text: 'Fit is perfect. Highly recommend the Maggam sleeves.' }
          ]
        },
        {
          id: 'prod-2',
          name: 'Queen Sweetheart Maggam Blouse',
          category: 'maggam-work-collections',
          price: 7200,
          discount: 10,
          rating: 4.8,
          description: 'A classic sweetheart neckline designer blouse featuring heavy stone settings and spring tube bead border details.',
          image: './assets/designer-blouse.png',
          images: ['./assets/designer-blouse.png', './assets/aari-detail.png'],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Maroon Gold', 'Royal Blue', 'Champagne Pink'],
          fabric: 'Tussar Silk with Cotton Lining padding',
          deliveryDays: 6,
          stock: 6,
          reviews: [
            { user: 'Divya R.', rating: 5, text: 'Beautiful beads. The sweetheart neck fits like a dream.' }
          ]
        },
        {
          id: 'prod-3',
          name: 'Mughal Royal Silk Anarkali Set',
          category: 'ready-made-dresses',
          price: 9800,
          discount: 12,
          rating: 4.7,
          description: 'Heritage banarasi silk flare suit with hand-woven borders, comfortable cotton lining, and a georgette floral dupatta.',
          image: './assets/hero-bridal.png',
          images: ['./assets/hero-bridal.png', './assets/designer-blouse.png'],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Deep Wine', 'Emerald Green', 'Mustard Yellow'],
          fabric: 'Banarasi Brocade Silk, 100% fine cotton backing',
          deliveryDays: 5,
          stock: 5,
          reviews: [
            { user: 'Ananya K.', rating: 4, text: 'Heavy and elegant, wore it for a reception and received compliments!' }
          ]
        },
        {
          id: 'prod-4',
          name: 'Emperor Brocade Bridal Lehenga',
          category: 'bridal-collections',
          price: 24500,
          discount: 20,
          rating: 5.0,
          description: 'An absolute masterpiece. Deep royal maroon lehenga skirt featuring 24 dynamic panels, gold border zardozi, and matching choli with twin dupattas.',
          image: './assets/hero-bridal.png',
          images: ['./assets/hero-bridal.png', './assets/aari-detail.png', './assets/designer-blouse.png'],
          sizes: ['S', 'M', 'L'],
          colors: ['Royal Maroon', 'Crimson Gold', 'Classic Ivory'],
          fabric: 'Premium Kanchipuram Brocade Silk, Net dupattas',
          deliveryDays: 14,
          stock: 2,
          reviews: [
            { user: 'Sushmitha S.', rating: 5, text: 'Perfect bridal silhouette. Absolute masterpiece of craftsmanship.' }
          ]
        },
        {
          id: 'prod-5',
          name: 'Pastel Mesh Reception Gown',
          category: 'party-wear-dresses',
          price: 14500,
          discount: 15,
          rating: 4.8,
          description: 'Pastel pink flowy georgette gown decorated with elegant sequins, glass crystal drops, and a modern side slit overlay.',
          image: './assets/hero-bridal.png',
          images: ['./assets/hero-bridal.png', './assets/designer-blouse.png'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Blush Pink', 'Lilac Mist', 'Sky Blue'],
          fabric: 'Georgette, Premium tulle overlay, Silk underskirt',
          deliveryDays: 8,
          stock: 3,
          reviews: [
            { user: 'Meera R.', rating: 5, text: 'Extremely elegant. Fits perfectly and flows beautifully.' }
          ]
        },
        {
          id: 'prod-6',
          name: 'Heritage Kids Pattu Pavadai Set',
          category: 'kids-dresses',
          price: 4200,
          discount: 0,
          rating: 4.7,
          description: 'Pure silk traditional skirt and puff-sleeve top set for young girls, styled with premium gold zari borders and standard linings.',
          image: './assets/hero-bridal.png',
          images: ['./assets/hero-bridal.png', './assets/aari-detail.png'],
          sizes: ['24 (Age 3-4)', '28 (Age 5-6)', '32 (Age 7-8)'],
          colors: ['Turquoise Pink', 'Yellow Maroon', 'Green Orange'],
          fabric: 'Traditional Southern Kanchi Silk base',
          deliveryDays: 4,
          stock: 8,
          reviews: [
            { user: 'Radha N.', rating: 5, text: 'Super soft inside! No stitching itchiness for my daughter.' }
          ]
        },
        {
          id: 'prod-7',
          name: 'Banarasi Golden Kaftan Suit',
          category: 'ethnic-wear',
          price: 6800,
          discount: 10,
          rating: 4.6,
          description: 'Relaxed yet majestic ethnic kaftan suit crafted from Banarasi silk with a customized neck drawstring and matching pants.',
          image: './assets/designer-blouse.png',
          images: ['./assets/designer-blouse.png', './assets/hero-bridal.png'],
          sizes: ['Free Size (Fits S-XXL)'],
          colors: ['Antique Gold', 'Burgundy Red', 'Teal Blue'],
          fabric: 'Art Silk with fine metallic brocade stitch',
          deliveryDays: 5,
          stock: 6,
          reviews: [
            { user: 'Kalyani S.', rating: 4, text: 'Comfortable and looks rich. Ideal for festive family dinners.' }
          ]
        },
        {
          id: 'prod-8',
          name: 'Kanchipuram Brocade Saree',
          category: 'sarees',
          price: 18500,
          discount: 10,
          rating: 4.9,
          description: 'Handloom Kanchipuram silk saree with classic temple border designs and full gold zari rich pallu. Blouse piece is unstitched.',
          image: './assets/hero-bridal.png',
          images: ['./assets/hero-bridal.png', './assets/aari-detail.png'],
          sizes: ['Standard 5.5m Saree + 0.8m Blouse'],
          colors: ['Emerald Green', 'Temple Crimson', 'Golden Mustard'],
          fabric: '100% Pure Southern Handloom Silk',
          deliveryDays: 6,
          stock: 4,
          reviews: [
            { user: 'Uma M.', rating: 5, text: 'Authentic feel, the brocade zari glows beautifully under light.' }
          ]
        },
        {
          id: 'prod-9',
          name: 'Hand-Stitched Zardozi Clutch',
          category: 'boutique-accessories',
          price: 2800,
          discount: 0,
          rating: 4.7,
          description: 'Premium raw silk hard-case clutch decorated with handmade Zardozi motifs, pearl borders, and a removable gold chain strap.',
          image: './assets/aari-detail.png',
          images: ['./assets/aari-detail.png', './assets/designer-blouse.png'],
          sizes: ['One Size (7.5" x 4.5")'],
          colors: ['Deep Maroon', 'Dull Gold', 'Emerald Green'],
          fabric: 'Raw Silk fabric wrapping, Velvet lining',
          deliveryDays: 3,
          stock: 12,
          reviews: [
            { user: 'Srilekha V.', rating: 5, text: 'Fits my phone and cards. Absolute luxury accessory!' }
          ]
        },
        {
          id: 'prod-10',
          name: 'Pearl Silk Potli Bag',
          category: 'boutique-accessories',
          price: 1500,
          discount: 10,
          rating: 4.5,
          description: 'Charming draw-string potli bag decorated with pearls and golden bead tassels, matches bridal ensembles perfectly.',
          image: './assets/designer-blouse.png',
          images: ['./assets/designer-blouse.png'],
          sizes: ['One Size'],
          colors: ['Gold Cream', 'Crimson Red', 'Mint Green'],
          fabric: 'Raw Silk base, Pearl tassels',
          deliveryDays: 3,
          stock: 15,
          reviews: []
        },
        {
          id: 'prod-11',
          name: 'Designer Zari Outline Blouse',
          category: 'designer-blouses',
          price: 3500,
          discount: 5,
          rating: 4.6,
          description: 'A custom-stitched designer blouse featuring solid piping borders and double-stitch padded lining templates.',
          image: './assets/designer-blouse.png',
          images: ['./assets/designer-blouse.png', './assets/aari-detail.png'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Bright Red', 'Classic Black', 'Forest Green'],
          fabric: 'Raw Silk with standard cotton base linings',
          deliveryDays: 5,
          stock: 10,
          reviews: []
        },
        {
          id: 'prod-12',
          name: 'Lotus Outline Maggam Border Base',
          category: 'maggam-work-collections',
          price: 5400,
          discount: 15,
          rating: 4.8,
          description: 'A stunning Maggam embroidery template showcasing intricate hand-stitched lotus borders, beads, and gold piping threads.',
          image: './assets/aari-detail.png',
          images: ['./assets/aari-detail.png', './assets/designer-blouse.png'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Magenta Gold', 'Teal Green', 'Deep Plum'],
          fabric: 'Mulberry silk fabric with frames backing',
          deliveryDays: 7,
          stock: 5,
          reviews: []
        }
      ],
      cart: [],
      wishlist: [],
      addresses: []
    };
  }

  // --- ORDER SERVICES ---
  getOrders() {
    return this.state.orders;
  }

  addOrder(order) {
    const newId = `ord-${100 + this.state.orders.length + 1}`;
    const newOrder = {
      id: newId,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...order
    };
    this.state.orders.unshift(newOrder);
    this.addNotification({
      title: 'New Stitching Order Created',
      message: `Order ${newId} created for ${newOrder.customerName} (${newOrder.stitchingItem}).`
    });
    this.save();
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    this.state.orders = this.state.orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    this.save();
  }

  updateOrderStaff(orderId, staffName) {
    this.state.orders = this.state.orders.map(o => {
      if (o.id === orderId) {
        return { ...o, staffAssigned: staffName };
      }
      return o;
    });
    this.save();
  }

  updateOrderStitching(orderId, updateFields) {
    this.state.orders = this.state.orders.map(o => {
      if (o.id === orderId) {
        return { ...o, ...updateFields };
      }
      return o;
    });
    this.save();
  }

  // --- APPOINTMENT SERVICES ---
  getAppointments() {
    return this.state.appointments;
  }

  addAppointment(apt) {
    const newId = `apt-${200 + this.state.appointments.length + 1}`;
    const newApt = {
      id: newId,
      status: 'Pending',
      ...apt
    };
    this.state.appointments.unshift(newApt);
    this.addNotification({
      title: 'New Appointment Scheduled',
      message: `${newApt.name} booked a ${newApt.type} on ${newApt.date} at ${newApt.time}.`
    });
    this.save();
    return newApt;
  }

  updateAppointmentStatus(aptId, status) {
    this.state.appointments = this.state.appointments.map(a => {
      if (a.id === aptId) {
        return { ...a, status };
      }
      return a;
    });
    this.save();
  }

  // --- CUSTOMER SERVICES ---
  getCustomers() {
    return this.state.customers;
  }

  addCustomer(customer) {
    const newId = `cust-${this.state.customers.length + 1}`;
    const newCustomer = {
      id: newId,
      joinedDate: new Date().toISOString().split('T')[0],
      measurements: {
        chest: 0, waist: 0, blouseLength: 0, shoulder: 0,
        frontNeck: 0, backNeck: 0, sleeveLength: 0, sleeveRound: 0, armHole: 0
      },
      ...customer
    };
    this.state.customers.push(newCustomer);
    this.save();
    return newCustomer;
  }

  updateCustomerMeasurements(customerId, measurements) {
    this.state.customers = this.state.customers.map(c => {
      if (c.id === customerId) {
        return { ...c, measurements: { ...c.measurements, ...measurements } };
      }
      return c;
    });
    this.save();
  }

  // --- NOTIFICATION SERVICES ---
  getNotifications() {
    return this.state.notifications;
  }

  addNotification(notif) {
    const newNotif = {
      id: `not-${this.state.notifications.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      ...notif
    };
    this.state.notifications.unshift(newNotif);
    this.save();
  }

  markNotificationAsRead(notifId) {
    this.state.notifications = this.state.notifications.map(n => {
      if (n.id === notifId) {
        return { ...n, read: true };
      }
      return n;
    });
    this.save();
  }

  // --- GALLERY SERVICES ---
  getGallery() {
    return this.state.gallery;
  }

  addGalleryItem(item) {
    const newItem = {
      id: `gal-${this.state.gallery.length + 1}`,
      likes: 0,
      ...item
    };
    this.state.gallery.unshift(newItem);
    this.save();
  }

  likeGalleryItem(itemId) {
    this.state.gallery = this.state.gallery.map(g => {
      if (g.id === itemId) {
        return { ...g, likes: g.likes + 1 };
      }
      return g;
    });
    this.save();
  }

  // --- REVENUE & ANALYTICS DATA ---
  getRevenueMetrics() {
    const orders = this.state.orders;
    const completedOrders = orders.filter(o => o.status === 'Completed');
    
    const totalSales = orders.reduce((sum, o) => sum + o.cost, 0);
    const advancePaid = orders.reduce((sum, o) => sum + o.advancePaid, 0);
    const pendingCollections = totalSales - advancePaid;
    
    // Stitching Status Distribution
    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalSales,
      advancePaid,
      pendingCollections,
      activeOrdersCount: orders.filter(o => o.status !== 'Completed').length,
      completedOrdersCount: completedOrders.length,
      appointmentsCount: this.state.appointments.length,
      statusCounts
    };
  }

  // --- E-COMMERCE PRODUCTS ---
  getProducts() {
    return this.state.products || [];
  }

  // --- SHOPPING CART SERVICES ---
  getCart() {
    return this.state.cart || [];
  }

  addToCart(product, qty = 1) {
    if (!this.state.cart) this.state.cart = [];
    const existing = this.state.cart.find(item => item.product.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      this.state.cart.push({ product, qty });
    }
    this.save();
  }

  removeFromCart(productId) {
    if (!this.state.cart) return;
    this.state.cart = this.state.cart.filter(item => item.product.id !== productId);
    this.save();
  }

  updateCartQty(productId, qty) {
    if (!this.state.cart) return;
    const item = this.state.cart.find(item => item.product.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
      this.save();
    }
  }

  clearCart() {
    this.state.cart = [];
    this.save();
  }

  getConfig() {
    return this.state.config || {
      phone: '+91 98401 23456',
      whatsapp: '919840123456',
      instagram: 'https://instagram.com/mahathitailors',
      facebook: 'https://facebook.com/mahathitailors',
      address: 'No. 14, Pondy Bazaar, T. Nagar, Chennai - 600017',
      email: 'info@mahathitailors.com',
      hours: 'Mon - Sun: 10:00 AM - 09:00 PM'
    };
  }

  updateConfig(newConfig) {
    this.state.config = { ...this.getConfig(), ...newConfig };
    this.save();
  }

  // --- WISHLIST SERVICES ---
  getWishlist() {
    return this.state.wishlist || [];
  }

  toggleWishlist(productId) {
    if (!this.state.wishlist) this.state.wishlist = [];
    const exists = this.state.wishlist.includes(productId);
    if (exists) {
      this.state.wishlist = this.state.wishlist.filter(id => id !== productId);
    } else {
      this.state.wishlist.push(productId);
    }
    this.save();
    return !exists; // Returns true if added, false if removed
  }

  // --- ADDRESS SERVICES ---
  getAddresses() {
    return this.state.addresses || [];
  }

  saveAddress(addr) {
    if (!this.state.addresses) this.state.addresses = [];
    const exists = this.state.addresses.find(a => 
      a.name.toLowerCase() === addr.name.toLowerCase() && 
      a.address.toLowerCase() === addr.address.toLowerCase()
    );
    if (!exists) {
      this.state.addresses.push({ id: `addr-${Date.now()}`, ...addr });
      this.save();
    }
  }

  // --- ADMIN CATALOG CRUD ENGINE ---
  addProduct(prod) {
    if (!this.state.products) this.state.products = [];
    const newId = `prod-${this.state.products.length + 1}`;
    const newProd = {
      id: newId,
      rating: 5.0,
      reviews: [],
      images: [prod.image || './assets/designer-blouse.png'],
      ...prod
    };
    this.state.products.push(newProd);
    this.save();
    return newProd;
  }

  updateProduct(prodId, fields) {
    if (!this.state.products) return;
    this.state.products = this.state.products.map(p => 
      p.id === prodId ? { ...p, ...fields } : p
    );
    this.save();
  }

  deleteProduct(prodId) {
    if (!this.state.products) return;
    this.state.products = this.state.products.filter(p => p.id !== prodId);
    this.save();
  }
}

// Export a single instance to be used across components
export const BoutiqueDB = new BoutiqueDBClass();
