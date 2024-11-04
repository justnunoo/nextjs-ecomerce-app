import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
const prismaClientSingleton = () => {
    return new PrismaClient();
};

// Check if we're in a development environment and prevent creating multiple PrismaClient instances
const prisma = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;