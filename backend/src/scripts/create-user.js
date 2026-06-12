import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        console.log('Connecting to database...');
        // Test connection by doing a simple query
        await prisma.$queryRaw`SELECT 1`;
        console.log('Connection successful!');

        const email = 'admin@gryork.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log(`User ${email} already exists. Updating password...`);
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword, role: 'super_admin' }
            });
            console.log('User password updated successfully.');
        } else {
            console.log(`Creating user ${email}...`);
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: 'Admin User',
                    role: 'super_admin',
                    isActive: true,
                }
            });
            console.log('User created successfully.');
        }
        
        console.log('\n--- LOGIN CREDENTIALS ---');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-------------------------\n');

    } catch (error) {
        console.error('Database connection or query failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
