/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  PASSENGER = "PASSENGER",
  DRIVER = "DRIVER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  registrationNumber: string;
  photos: string[];
}

export interface Driver {
  id: string;
  fullName: string;
  driverLicenseNumber: string;
  profilePhoto: string;
  operatingCountry: string;
  operatingCity: string;
  yearsDriving: number;
  verificationStatus: "unverified" | "pending" | "verified";
  identityVerified: boolean;
  backgroundCheckVerified: boolean;
  vehicle: Vehicle;
  trustScore: number; // 0 - 100
  riskRating: "low" | "medium" | "high" | "critical";
  reportCount: number;
  positiveReviewsCount: number;
  negativeReviewsCount: number;
  lastSeen: string; // ISO date string or active status
  emergencyContactVerified: boolean;
  scoreFactors: {
    identityWeight: number; // 35%
    reviewsWeight: number;  // 20%
    behaviorWeight: number; // 20%
    historyWeight: number;  // 15%
    reputationWeight: number; // 10%
  };
}

export type IncidentCategory =
  | "unsafe_driving"
  | "harassment"
  | "theft"
  | "fraud"
  | "overcharging"
  | "vehicle_issues"
  | "reckless_behavior"
  | "impersonation"
  | "suspicious_activity"
  | "accident"
  | "other";

export interface IncidentReport {
  id: string;
  driverId: string;
  userId: string;
  category: IncidentCategory;
  description: string;
  timestamp: string;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    landmark?: string;
  };
  evidenceUrls: string[];
  isAnonymous: boolean;
  status: "pending_review" | "under_investigation" | "resolved" | "dismissed";
  severity: "low" | "medium" | "high" | "critical";
  aiClassification?: {
    suggestedCategory: IncidentCategory;
    toxicityScore: number; // 0 to 1
    sentiment: "neutral" | "angry" | "fearful" | "distressed" | "hostile";
    isLikelyFake: boolean;
    confidence: number; // 0 to 1
    reasoning: string;
  };
}

export interface SafetyAlert {
  id: string;
  title: string;
  message: string;
  category: "hotspot" | "driver_flagged" | "community_notice" | "critical_weather" | "system";
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  severity: "info" | "warning" | "critical";
  timestamp: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  driverId: string;
  userId: string;
  rating: number; // 1 - 5
  comment: string;
  tripId?: string;
  serviceUsed: "Rideshare" | "Private Transport" | "Local Taxi" | "Other";
  timestamp: string;
}

export interface DangerZoneHotspot {
  id: string;
  name: string;
  city: string;
  country: string;
  riskLevel: "medium" | "high" | "critical";
  latitude: number;
  longitude: number;
  radius: number; // in meters
  recentIncidentCount: number;
  description: string;
}

export interface SOSActivation {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  status: "active" | "contacts_notified" | "resolved";
  audioRecordingUrl?: string;
  timeline: {
    time: string;
    event: string;
  }[];
}

export interface AboutMeData {
  fullName: string;
  title: string;
  bio: string;
  witsProject: string;
  passion: string;
  leadership: string;
  phone1: string;
  phone2: string;
  email: string;
  location: string;
  linkedin: string;
  languages: string[];
  profilePhoto: string;
}



