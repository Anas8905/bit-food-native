// Mock data
const pizzas = [
    {
      id: '1',
      name: 'Chicago Bold',
      description: 'Crispy golden crust, Spicy BBQ Chicken, Tomato Sauce, Onions, Chillies & Coriander.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.10.31%E2%80%AFPM-Xs1nnWF4TV21kTGdbK12Orgff3GWct.png',
      category: 'Popular',
      rating: 4.8,
      reviewCount: '2k+',
      deliveryTime: 20,
      deliveryFee: 'Free',
      variations: [
        { size: '6" - Small (1)', price: 510 },
        { size: '9" - Medium (2)', price: 1100 },
        { size: '12" - Large (2-3)', price: 1600 },
        { size: '15" - Party (3-4)', price: 2100 },
        { size: '21" - Humangasor (4-6)', price: 3700 },
      ]
    },
    {
      id: '2',
      name: 'Pepperoni Feast',
      description: 'Classic pepperoni, mozzarella cheese, tomato sauce on a hand-tossed crust',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.10.43%E2%80%AFPM-tYHy0saIpWiSMA4D69obC1yxt0varp.png',
      category: 'Popular',
      rating: 4.5,
      reviewCount: '1.5k+',
      deliveryTime: 25,
      deliveryFee: 'Free',
      variations: [
        { size: '6" - Small (1)', price: 510 },
        { size: '9" - Medium (2)', price: 1100 },
        { size: '12" - Large (2-3)', price: 1600 },
        { size: '15" - Party (3-4)', price: 2100 },
      ]
    },
    {
      id: '3',
      name: 'Veggie Supreme',
      description: 'Bell peppers, mushrooms, onions, black olives, tomatoes on a thin crust',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.10.43%E2%80%AFPM-tYHy0saIpWiSMA4D69obC1yxt0varp.png',
      category: 'Classics',
      rating: 4.3,
      reviewCount: '1k+',
      deliveryTime: 20,
      deliveryFee: 'Free',
      variations: [
        { size: '6" - Small (1)', price: 450 },
        { size: '9" - Medium (2)', price: 950 },
        { size: '12" - Large (2-3)', price: 1400 },
      ]
    },
    {
      id: '4',
      name: 'Meat Lovers',
      description: 'Pepperoni, ham, bacon, sausage, beef on a hand-tossed crust',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.10.43%E2%80%AFPM-tYHy0saIpWiSMA4D69obC1yxt0varp.png',
      category: 'Popular',
      rating: 4.7,
      reviewCount: '1.8k+',
      deliveryTime: 30,
      deliveryFee: 'Free',
      variations: [
        { size: '9" - Medium (2)', price: 1200 },
        { size: '12" - Large (2-3)', price: 1700 },
        { size: '15" - Party (3-4)', price: 2300 },
      ]
    },
    {
      id: '5',
      name: 'Hawaiian',
      description: 'Ham, pineapple, mozzarella cheese on a hand-tossed crust',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.10.43%E2%80%AFPM-tYHy0saIpWiSMA4D69obC1yxt0varp.png',
      category: 'Classics',
      rating: 4.2,
      reviewCount: '900+',
      deliveryTime: 20,
      deliveryFee: 'Free',
      variations: [
        { size: '6" - Small (1)', price: 480 },
        { size: '9" - Medium (2)', price: 1000 },
        { size: '12" - Large (2-3)', price: 1500 },
      ]
    },
    {
      id: '6',
      name: 'BBQ Chicken',
      description: 'Grilled chicken, BBQ sauce, red onions, cilantro on a hand-tossed crust',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.10.43%E2%80%AFPM-tYHy0saIpWiSMA4D69obC1yxt0varp.png',
      category: 'Popular',
      rating: 4.6,
      reviewCount: '1.2k+',
      deliveryTime: 25,
      deliveryFee: 'Free',
      variations: [
        { size: '9" - Medium (2)', price: 1100 },
        { size: '12" - Large (2-3)', price: 1600 },
        { size: '15" - Party (3-4)', price: 2200 },
      ]
    },
  ];
  
  const deals = [
    {
      id: 'd1',
      name: 'Deal 1',
      description: 'Chicago Bold 9" Special or Chicken Supreme 2"',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.10.43%E2%80%AFPM-tYHy0saIpWiSMA4D69obC1yxt0varp.png',
      price: 1100,
      deliveryTime: 40,
      deliveryFee: 'Free',
      category: 'Deals',
    },
    {
      id: 'd2',
      name: 'Deal 2',
      description: 'Chicago Bold 9" Special or Chicken Supreme 2"',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.10.43%E2%80%AFPM-tYHy0saIpWiSMA4D69obC1yxt0varp.png',
      price: 4300,
      deliveryTime: 35,
      deliveryFee: 'Free',
      category: 'Deals',
    },
    {
      id: 'd3',
      name: 'Deal 3',
      description: 'Chicago Bold 9" Special or Chicken Supreme 2"',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.10.43%E2%80%AFPM-tYHy0saIpWiSMA4D69obC1yxt0varp.png',
      price: 5100,
      deliveryTime: 70,
      deliveryFee: 'Free',
      category: 'Deals',
    },
    {
      id: 'd4',
      name: 'Deal 4',
      description: 'Chicago Bold 9" Special or Chicken Supreme 2"',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.10.43%E2%80%AFPM-tYHy0saIpWiSMA4D69obC1yxt0varp.png',
      price: 7600,
      deliveryTime: 80,
      deliveryFee: 'Free',
      category: 'Deals',
    },
  ];
  
  const mockUser = {
    id: '1',
    fullName: 'Taimoor Khan',
    phoneNumber: '+92 3212033774',
    email: 'mikepsully@gmail.com',
    addresses: [
      {
        id: 'a1',
        type: 'HOME',
        address: 'E-23/12-Z, Al-Rehman Street, Abid Road, Walton',
      },
      {
        id: 'a2',
        type: 'OFFICE',
        address: '23 A Khayaban-e-Iqbal, Sector XX DHA Phase 3, Lahore',
      },
    ],
  };
  
  const mockOrders = [];
  
  // Mock API functions
  export const mockAuthAPI = {
    sendOTP: async (phoneNumber) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'OTP sent successfully',
      };
    },
    
    verifyOTP: async (phoneNumber, otp) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, any 4-digit OTP is valid
      if (otp.length === 4) {
        return {
          success: true,
          message: 'OTP verified successfully',
          user: mockUser,
        };
      } else {
        throw new Error('Invalid OTP');
      }
    },
    
    updateProfile: async (userData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Profile updated successfully',
        user: { ...mockUser, ...userData },
      };
    },
  };
  
  export const mockPizzaAPI = {
    getCategories: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        categories: ['Popular', 'Deals', 'Classics'],
      };
    },
    
    getPizzas: async (category = null) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let result;
      
      if (category === 'Deals') {
        result = deals;
      } else if (category) {
        result = pizzas.filter(pizza => pizza.category === category);
      } else {
        result = [...pizzas, ...deals];
      }
      
      return {
        success: true,
        pizzas: result,
      };
    },
    
    getPizzaById: async (id) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const pizza = pizzas.find(p => p.id === id) || deals.find(d => d.id === id);
      
      if (pizza) {
        return {
          success: true,
          pizza,
        };
      } else {
        throw new Error('Pizza not found');
      }
    },
    
    searchPizzas: async (query) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const results = pizzas.filter(
        pizza => pizza.name.toLowerCase().includes(query.toLowerCase()) || 
                 pizza.description.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        success: true,
        pizzas: results,
      };
    },
  };
  
  export const mockOrderAPI = {
    placeOrder: async (orderData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newOrder = {
        id: `ord-${Date.now()}`,
        ...orderData,
        status: 'received',
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: 45, // minutes
        courier: {
          name: 'I am Batman',
          phone: '+92 300 1234567',
          image: 'https://i.pravatar.cc/150?img=8',
        },
      };
      
      mockOrders.push(newOrder);
      
      return {
        success: true,
        message: 'Order placed successfully',
        order: newOrder,
      };
    },
    
    getOrders: async (userId) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userOrders = mockOrders.filter(order => order.userId === userId);
      
      return {
        success: true,
        orders: userOrders,
      };
    },
    
    getOrderById: async (orderId) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const order = mockOrders.find(order => order.id === orderId);
      
      if (order) {
        return {
          success: true,
          order,
        };
      } else {
        throw new Error('Order not found');
      }
    },
  };