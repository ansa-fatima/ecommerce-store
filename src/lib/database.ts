import mongoose from 'mongoose';
import Product, { IProduct } from '@/models/Product';
import Order, { IOrder } from '@/models/Order';
import User, { IUser } from '@/models/User';
import Category, { ICategory } from '@/models/Category';
import ChatMessage, { IChatMessage } from '@/models/ChatMessage';

// MongoDB connection function
async function dbConnect() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// --- Product Service ---
export const ProductService = {
  async getAllProducts(): Promise<IProduct[]> {
    await dbConnect();
    return Product.find({ isActive: true }).populate('category').sort({ createdAt: -1 });
  },

  async getProductById(id: string): Promise<IProduct | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Product.findById(id).populate('category');
  },

  async getProductsByCategory(categoryId: string): Promise<IProduct[]> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return [];
    return Product.find({ category: categoryId, isActive: true }).populate('category').sort({ createdAt: -1 });
  },

  async searchProducts(query: string): Promise<IProduct[]> {
    await dbConnect();
    return Product.find({
      name: { $regex: query, $options: 'i' },
      isActive: true,
    }).populate('category').sort({ createdAt: -1 });
  },

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    await dbConnect();
    return Product.create(productData);
  },

  async updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Product.findByIdAndUpdate(id, updateData, { new: true }).populate('category');
  },

  async deleteProduct(id: string): Promise<boolean> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  },
};

// --- Order Service ---
export const OrderService = {
  async getAllOrders(): Promise<IOrder[]> {
    await dbConnect();
    return Order.find().sort({ createdAt: -1 });
  },

  async getOrderById(id: string): Promise<IOrder | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Order.findById(id);
  },

  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    await dbConnect();
    return Order.create(orderData);
  },

  async updateOrderStatus(id: string, status: IOrder['status']): Promise<IOrder | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
  },

  async updateOrderPaymentStatus(id: string, paymentStatus: IOrder['paymentStatus']): Promise<IOrder | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Order.findByIdAndUpdate(id, { paymentStatus, updatedAt: new Date() }, { new: true });
  },
};

// --- User Service ---
export const UserService = {
  async getAllUsers(): Promise<IUser[]> {
    await dbConnect();
    return User.find({ role: 'customer' }).sort({ createdAt: -1 });
  },

  async getUserById(id: string): Promise<IUser | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return User.findById(id);
  },

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    await dbConnect();
    return User.create(userData);
  },

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return User.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deleteUser(id: string): Promise<boolean> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await User.findByIdAndDelete(id);
    return !!result;
  },
};

// --- Category Service ---
export const CategoryService = {
  async getAllCategories(): Promise<ICategory[]> {
    await dbConnect();
    return Category.find({ isActive: true }).sort({ name: 1 });
  },

  async getCategoryById(id: string): Promise<ICategory | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Category.findById(id);
  },

  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    await dbConnect();
    return Category.create(categoryData);
  },

  async updateCategory(id: string, updateData: Partial<ICategory>): Promise<ICategory | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Category.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deleteCategory(id: string): Promise<boolean> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  },
};

// --- ChatMessage Service ---
export const ChatMessageService = {
  async createMessage(messageData: Partial<IChatMessage>): Promise<IChatMessage> {
    await dbConnect();
    const message = new ChatMessage(messageData);
    return message.save();
  },

  async getMessagesByConversation(conversationId: string): Promise<IChatMessage[]> {
    await dbConnect();
    return ChatMessage.find({ conversationId }).sort({ timestamp: 1 });
  },

  async getAllMessages(): Promise<IChatMessage[]> {
    await dbConnect();
    return ChatMessage.find().sort({ timestamp: -1 });
  },

  async getConversations(): Promise<{ conversationId: string; lastMessage: IChatMessage; messageCount: number }[]> {
    await dbConnect();
    const conversations = await ChatMessage.aggregate([
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $last: '$$ROOT' },
          messageCount: { $sum: 1 }
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      }
    ]);
    return conversations.map(conv => ({
      conversationId: conv._id,
      lastMessage: conv.lastMessage,
      messageCount: conv.messageCount
    }));
  },

  async markAsRead(conversationId: string): Promise<void> {
    await dbConnect();
    await ChatMessage.updateMany(
      { conversationId, sender: 'user' },
      { isRead: true }
    );
  },

  async deleteMessage(id: string): Promise<boolean> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await ChatMessage.findByIdAndDelete(id);
    return !!result;
  }
};