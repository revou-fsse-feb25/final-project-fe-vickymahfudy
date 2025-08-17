import React from "react";
import {
  Target,
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  CheckCircle,
  File,
  AlertTriangle,
  Clock,
  Trophy,
  MessageCircle,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Briefcase,
  User,
  UserCheck,
  Settings,
  AlertCircle,
  Calendar,
  ExternalLink,
} from "lucide-react";

// Standard icon sizes
const iconSizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
  "2xl": "h-10 w-10",
};

interface IconProps {
  size?: keyof typeof iconSizes;
  className?: string;
}

// Semantic icon components
export const TargetIcon = ({ size = "md", className = "" }: IconProps) => (
  <Target className={`${iconSizes[size]} ${className}`} />
);

export const UsersIcon = ({ size = "md", className = "" }: IconProps) => (
  <Users className={`${iconSizes[size]} ${className}`} />
);

export const BookIcon = ({ size = "md", className = "" }: IconProps) => (
  <BookOpen className={`${iconSizes[size]} ${className}`} />
);

export const GraduationIcon = ({ size = "md", className = "" }: IconProps) => (
  <GraduationCap className={`${iconSizes[size]} ${className}`} />
);

export const AssignmentIcon = ({ size = "md", className = "" }: IconProps) => (
  <FileText className={`${iconSizes[size]} ${className}`} />
);

export const CompletedIcon = ({ size = "md", className = "" }: IconProps) => (
  <CheckCircle className={`${iconSizes[size]} ${className}`} />
);

export const DocumentIcon = ({ size = "md", className = "" }: IconProps) => (
  <File className={`${iconSizes[size]} ${className}`} />
);

export const WarningIcon = ({ size = "md", className = "" }: IconProps) => (
  <AlertTriangle className={`${iconSizes[size]} ${className}`} />
);

export const ClockIcon = ({ size = "md", className = "" }: IconProps) => (
  <Clock className={`${iconSizes[size]} ${className}`} />
);

export const TrophyIcon = ({ size = "md", className = "" }: IconProps) => (
  <Trophy className={`${iconSizes[size]} ${className}`} />
);

export const CommentIcon = ({ size = "md", className = "" }: IconProps) => (
  <MessageCircle className={`${iconSizes[size]} ${className}`} />
);

export const LocationIcon = ({ size = "md", className = "" }: IconProps) => (
  <MapPin className={`${iconSizes[size]} ${className}`} />
);

export const FacebookIcon = ({ size = "md", className = "" }: IconProps) => (
  <Facebook className={`${iconSizes[size]} ${className}`} />
);

export const TwitterIcon = ({ size = "md", className = "" }: IconProps) => (
  <Twitter className={`${iconSizes[size]} ${className}`} />
);

export const LinkedInIcon = ({ size = "md", className = "" }: IconProps) => (
  <Linkedin className={`${iconSizes[size]} ${className}`} />
);

export const BriefcaseIcon = ({ size = "md", className = "" }: IconProps) => (
  <Briefcase className={`${iconSizes[size]} ${className}`} />
);

export const StudentIcon = ({ size = "md", className = "" }: IconProps) => (
  <User className={`${iconSizes[size]} ${className}`} />
);

export const TeamLeadIcon = ({ size = "md", className = "" }: IconProps) => (
  <UserCheck className={`${iconSizes[size]} ${className}`} />
);

export const AdminIcon = ({ size = "md", className = "" }: IconProps) => (
  <Settings className={`${iconSizes[size]} ${className}`} />
);

export const AlertIcon = ({ size = "md", className = "" }: IconProps) => (
  <AlertCircle className={`${iconSizes[size]} ${className}`} />
);

export const CalendarIcon = ({ size = "md", className = "" }: IconProps) => (
  <Calendar className={`${iconSizes[size]} ${className}`} />
);

export const LinkIcon = ({ size = "md", className = "" }: IconProps) => (
  <ExternalLink className={`${iconSizes[size]} ${className}`} />
);

// Export all icons for easy access
export const Icons = {
  Target: TargetIcon,
  Users: UsersIcon,
  Book: BookIcon,
  Graduation: GraduationIcon,
  Assignment: AssignmentIcon,
  Completed: CompletedIcon,
  Document: DocumentIcon,
  Warning: WarningIcon,
  Clock: ClockIcon,
  Trophy: TrophyIcon,
  Comment: CommentIcon,
  Location: LocationIcon,
  Facebook: FacebookIcon,
  Twitter: TwitterIcon,
  LinkedIn: LinkedInIcon,
  Briefcase: BriefcaseIcon,
  Student: StudentIcon,
  TeamLead: TeamLeadIcon,
  Admin: AdminIcon,
  Alert: AlertIcon,
  Calendar: CalendarIcon,
  Link: LinkIcon,
};
