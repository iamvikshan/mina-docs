// @root/types/components.d.ts

import type { ImageMetadata } from 'astro';

/**
 * Common component prop types
 */

// Avatar Component Types
export interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

// Testimonial Types
export interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatarSrc: string;
  avatarAlt: string;
}

export interface TestimonialsProps {
  title: string;
  testimonials: Testimonial[];
}

// Feature Types
export interface Tab {
  heading: string;
  content: string;
  svg: string;
  src: ImageMetadata | string;
  alt: string;
  first?: boolean;
  second?: boolean;
}

export interface FeatureTabsProps {
  title?: string;
  tabs: Tab[];
}

export interface Stat {
  stat: string;
  description: string;
}

export interface FeatureStatsProps {
  title: string;
  subTitle?: string;
  mainStatTitle: string;
  mainStatSubTitle: string;
  stats?: Stat[];
}

// Social Share Types
export interface SocialPlatform {
  name: string;
  url: string;
  svg: string;
}

export interface SocialShareProps {
  pageTitle: string;
  title?: string;
}

// Icon Types (used by astro-icon wrapper component)
export interface IconProps {
  name: string;
  class?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

// Link Component Types
export interface NavLinkProps {
  url: string;
  name: string;
}

export interface FooterSocialLinkProps {
  url: string;
  name: string;
  icon: string;
}

// Button Component Types
export interface ButtonProps {
  title: string;
  url?: string;
  style?: string;
}

export interface SubmitBtnProps {
  title: string;
  disabled?: boolean;
}

// Form Input Types
export interface InputProps {
  id: string;
  label: string;
  name: string;
}

export interface TextInputProps extends InputProps {
  type?: 'text' | 'password';
  placeholder?: string;
  required?: boolean;
}

export interface TextAreaInputProps extends InputProps {
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export interface EmailInputProps extends InputProps {
  placeholder?: string;
  required?: boolean;
}

export interface PhoneInputProps extends InputProps {
  placeholder?: string;
  required?: boolean;
}

// Block Component Types
export interface TabNavProps {
  title: string;
  active?: boolean;
  id: string;
}

export interface TabContentProps {
  id: string;
  active?: boolean;
  content: string;
}

export interface StatsProps {
  stat: string;
  description: string;
}

export interface IconBlockProps {
  heading: string;
  content: string;
  svg: string;
}

export interface ContactIconBlockProps {
  heading: string;
  content: string;
  isLinkVisible?: boolean;
  isArrowVisible?: boolean;
  url?: string;
  icon: string;
}

export interface SectionProps {
  title: string;
  subTitle?: string;
}

// Feedback Types
export interface PostFeedbackProps {
  title: string;
  url: string;
}

// Card Types
export interface CardProps {
  title: string;
  icon?: string;
}

// Layout Types
export interface MainLayoutProps {
  title?: string;
  meta?: string;
  structuredData?: object;
  lang?: string;
}
