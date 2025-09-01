import { saveData } from "@/services/asyncStorage";

// Mock data

  export const DIP_OPTIONS = ["BBQ Sauce", "Garlic Mayo", "Anyone can cook"];

  const pizzas = [
      {
        id: '1',
        name: 'Pepperoni Feast',
        description: 'Classic pepperoni, mozzarella cheese, tomato sauce on a hand-tossed crust',
        image: require('../assets/images/pizza_pepperoni.png'),
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
        id: '2',
        name: 'Meat Lovers',
        description: 'Pepperoni, ham, bacon, sausage, beef on a hand-tossed crust',
        image: require('../assets/images/pizza_italian.png'),
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
        id: '3',
        name: 'BBQ Chicken',
        description: 'Grilled chicken, BBQ sauce, red onions, cilantro on a hand-tossed crust',
        image: require('../assets/images/pizza_special.png'),
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
      {
        id: '4',
        name: 'Chicago Bold',
        description: 'Crispy golden crust, Spicy BBQ Chicken, Tomato Sauce, Onions, Chillies & Coriander.',
        image: require('../assets/images/pizza_dark.png'),
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
        id: '5',
        name: 'Veggie Supreme',
        description: 'Bell peppers, mushrooms, onions, black olives, tomatoes on a thin crust',
        image: require('../assets/images/pizza_dark.png'),
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
        id: '6',
        name: 'Hawaiian',
        description: 'Ham, pineapple, mozzarella cheese on a hand-tossed crust',
        image: require('../assets/images/pizza_special.png'),
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
        id: 'd1',
        name: 'Deal 1',
        description: 'Chicago Bold 9" Special or Chicken Supreme 2"',
        image: require('../assets/images/pizza_pepperoni.png'),
        price: 1100,
        deliveryTime: 40,
        deliveryFee: 'Free',
        category: 'Deals',
      },
      {
        id: 'd2',
        name: 'Deal 2',
        description: 'Chicago Bold 9" Special or Chicken Supreme 2"',
        image: require('../assets/images/pizza_italian.png'),
        price: 4300,
        deliveryTime: 35,
        deliveryFee: 'Free',
        category: 'Deals',
      },
      {
        id: 'd3',
        name: 'Deal 3',
        description: 'Chicago Bold 9" Special or Chicken Supreme 2"',
        image: require('../assets/images/pizza_special.png'),
        price: 5100,
        deliveryTime: 70,
        deliveryFee: 'Free',
        category: 'Deals',
      },
      {
        id: 'd4',
        name: 'Deal 4',
        description: 'Chicago Bold 9" Special or Chicken Supreme 2"',
        image: require('../assets/images/pizza_dark.png'),
        price: 7600,
        deliveryTime: 80,
        deliveryFee: 'Free',
        category: 'Deals',
      },
  ];


  const mockOrders = [];

  // Mock API functions
  export const mockAuthAPI = {

    sendOTP: async (user) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      await saveData("tempUser", user);

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
        };
      } else {
        throw new Error('Invalid OTP');
      }
    },

    updateProfile: async (toUpdate) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      await saveData('user', toUpdate);
      return {
        success: true,
        message: 'Profile updated successfully',
      };
    },
  };

  export const mockPizzaAPI = {
    getCategories: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const seen = new Set();
      pizzas.forEach(p => {
        if (p?.category) seen.add(p.category);
      });

      const categories = [...seen];

      return { success: true, categories };
    },

    getPizzas: async (category) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let result;

      if (category) {
        result = pizzas.filter(pizza => pizza.category === category);
      } else {
        result = pizzas;
      }

      return {
        success: true,
        pizzas: result,
      };
    },

    getPizzaById: async (id) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const pizza = pizzas.find(p => p.id === id);

      if (pizza) {
        return {
          success: true,
          pizza,
        };
      } else {
        throw new Error('Pizza not found');
      }
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