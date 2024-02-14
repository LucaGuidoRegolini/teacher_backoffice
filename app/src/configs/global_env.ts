import 'dotenv/config';

// Database configuration
export const mongo_url = process.env.MONGO_URL || 'mongodb://localhost:27017/project';

// Server configuration
export const app_port = process.env.APP_PORT;

// JWT configuration
export const jwt_secret = process.env.JWT_SECRET;

// Email configuration
export const mail_driver = process.env.MAIL_DRIVER;
export const email_address = process.env.EMAIL_ADDRESS;
export const email_name = process.env.EMAIL_NAME;

// Brave SMTP configuration
export const brave_smtp_host = process.env.BRAVE_SMTP_HOST;
export const brave_smtp_port = process.env.BRAVE_SMTP_PORT;
export const brave_smtp_user = process.env.BRAVE_SMTP_USER;
export const brave_smtp_pass = process.env.BRAVE_SMTP_PASS;
