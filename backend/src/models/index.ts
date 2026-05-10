import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// ============================================================
// USER MODEL
// ============================================================
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};
export const User = mongoose.model<IUser>('User', UserSchema);

// ============================================================
// PROJECT MODEL
// ============================================================
export interface IProject extends Document {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  featured: boolean;
  tech: string[];
  features: string[];
  github?: string;
  live?: string;
  image?: string;
  order: number;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['AI/ML', 'Full Stack', 'Systems', 'Finance'] },
  featured: { type: Boolean, default: false },
  tech: [{ type: String }],
  features: [{ type: String }],
  github: String,
  live: String,
  image: String,
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

// ============================================================
// SKILL MODEL
// ============================================================
export interface ISkill extends Document {
  category: string;
  icon: string;
  items: string[];
  color: string;
  order: number;
}

const SkillSchema = new Schema<ISkill>({
  category: { type: String, required: true },
  icon: { type: String, default: '◈' },
  items: [{ type: String }],
  color: { type: String, default: 'rgba(0,212,255,0.1)' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);

// ============================================================
// EXPERIENCE MODEL
// ============================================================
export interface IExperience extends Document {
  role: string;
  organization: string;
  period: string;
  description: string;
  type: string;
  order: number;
}

const ExperienceSchema = new Schema<IExperience>({
  role: { type: String, required: true },
  organization: { type: String, required: true },
  period: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['club', 'internship', 'work'], default: 'club' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);

// ============================================================
// BLOG MODEL
// ============================================================
export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  published: boolean;
  coverImage?: string;
  readTime: number;
  views: number;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  category: { type: String, default: 'General' },
  published: { type: Boolean, default: false },
  coverImage: String,
  readTime: { type: Number, default: 5 },
  views: { type: Number, default: 0 },
}, { timestamps: true });

BlogSchema.index({ published: 1, createdAt: -1 });
export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);

// ============================================================
// CONTACT/MESSAGE MODEL
// ============================================================
export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  ip?: string;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
  ip: String,
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

// ============================================================
// ANALYTICS MODEL
// ============================================================
export interface IAnalytics extends Document {
  event: string;
  data: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  country?: string;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  event: { type: String, required: true, index: true },
  data: { type: Schema.Types.Mixed, default: {} },
  ip: String,
  userAgent: String,
  country: String,
}, { timestamps: true });

AnalyticsSchema.index({ createdAt: -1 });
export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
