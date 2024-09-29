// app/actions.js
'use server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { UploadImage } from './UploadImage';  // Adjust the path for your logo upload function

const prisma = new PrismaClient();

// Custom validation function to check file type
const isValidFile = (file) => {
  if (!file) return false;
  const validTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add other valid types as needed
  return validTypes.includes(file.type);
};

// Define Zod schema for validation
const registrationSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(2, 'Password must be at least 2 characters long'),
  confirmPassword: z.string().min(2, 'Confirm Password must be at least 2 characters long'),
  phone: z.string().min(1, 'Phone number is required').regex(/^\d+$/, 'Phone number must contain only digits'),
  restaurantName: z.string().min(1, 'Restaurant name is required'),
  location: z.string().min(1, 'Location is required'),
  logo: z.instanceof(File).refine(isValidFile, 'Logo must be a valid image file (jpeg, png, gif)'),
});

export async function RegisterRestaurantSuperAdmin(formData) {
  // Extract data from FormData
  const name = formData.get('name')?.toString() ?? '';
  const email = formData.get('email')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';
  const confirmPassword = formData.get('confirmPassword')?.toString() ?? '';
  const phone = formData.get('phone')?.toString() ?? '';
  const restaurantName = formData.get('restaurantName')?.toString() ?? '';
  const location = formData.get('location')?.toString() ?? '';

  console.log("see email here:", email)
  
  // Extract logo file
  const logo = formData.get('logo'); // This will be a File object


  // Create an object from the form data
  const data = {
    name,
    email,
    password,
    confirmPassword,
    phone,
    restaurantName,
    location,
    logo, // Include the logo in the data object
  };

  console.log("see all Data:", data)
  // Validate the data using Zod schema
  try {
    registrationSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("see error:", error)
      // Handle validation errors
      const messages = error.errors.map(err => err.message).join(', ');
      return {
        error: messages,
        success: false,
      };
    }
    // Handle other types of errors
    return {
      error: 'An unexpected error occurred',
      success: false,
    };
  }

  // Check if passwords match
  if (data.password !== data.confirmPassword) {
    return {
      error: 'Passwords do not match',
      success: false,
    };
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

console.log("see existingUser:", existingUser)

  if (existingUser) {
    return {
      error: 'Email already registered',
      success: false,
    };
  }

  // Generate a salt and hash password
  const salt = await bcrypt.genSalt(10);
  console.log("see the salt:", salt);

  // Hash the password
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // Handle logo file upload and get the URL
  let logoUrl;
  if (logo) {
    logoUrl = await UploadImage(logo); // Implement your upload function to get the URL
    logoUrl = `/${logoUrl.uniqueFileName}`
  }

  console.log("see thre logoUrl:", logoUrl)

  // Save user and restaurant to the database
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phoneNumber: data.phone,
        isActive: true,
        location: data.location,
        // Here you can set the restaurantId later after creating the restaurant
      },
    });

    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        location,
        logoUrl, // Set the logo URL here
        superAdminId: user.id, // Set the user as the super admin of the restaurant
      },
    });

    // Update the user with the restaurant ID
    await prisma.user.update({
      where: { id: user.id },
      data: { restaurantId: restaurant.id },
    });

    return {
      message: 'User and restaurant registered successfully',
      success: true,
    };
  } catch (error) {
    // Handle errors
    if (error instanceof Error) {
      return {
        error: error.message, // Return the error message
        success: false,
      };
    }
    // Handle other types of errors
    return {
      error: 'An unexpected error occurred',
      success: false,
    };
  }
}