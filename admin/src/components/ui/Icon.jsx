import React from 'react';
import {
  // Navigation
  Gauge, Users, Briefcase, Building2, FileCheck2, BarChart3, Mail, Settings, HelpCircle,
  // Actions
  Plus, Pencil, Trash2, Eye, EyeOff, Search, X, ChevronLeft, ChevronRight, ChevronDown,
  ChevronsLeft, ChevronsRight, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight,
  Check, Download, Upload, Filter, RotateCcw, Save, Send, Bell, LogOut, User, UserPlus,
  Menu, Camera, MoreVertical, Sparkles, Crown, Sun, Moon, Star, Rocket, Bookmark, Grid, Layers, Award, Code, Gift,
  // Status / categories
  CheckCircle2, Clock, XCircle, AlertTriangle, CirclePause, ThumbsUp, MessageSquare, UserCheck, UserX,
  Trophy, ClipboardList, Tag, FileText, Hash,
  // Money / chart
  DollarSign, TrendingUp, Target, Calendar, CreditCard, Banknote, Wallet,
  // Location / contact
  MapPin, Phone, ShieldCheck, Lock, Key, BookOpen, UserCog, BellRing,
  // Stats / data
  PieChart, Activity, Globe, Share2, Link2, Copy, ExternalLink, Edit3, CheckCheck,
  // Brand
  Zap,
} from 'lucide-react';

// Map Font Awesome class names -> lucide components
const iconMap = {
  // Brand
  'fa-solid fa-bolt': Zap,
  'fa-solid fa-rocket': Rocket,
  'fa-solid fa-crown': Crown,
  'fa-solid fa-sparkles': Sparkles,

  // Navigation
  'fa-solid fa-gauge-high': Gauge,
  'fa-solid fa-users': Users,
  'fa-solid fa-briefcase': Briefcase,
  'fa-solid fa-building': Building2,
  'fa-solid fa-file-circle-check': FileCheck2,
  'fa-solid fa-chart-line': BarChart3,
  'fa-solid fa-envelope': Mail,
  'fa-solid fa-gear': Settings,
  'fa-solid fa-circle-question': HelpCircle,

  // Actions
  'fa-solid fa-plus': Plus,
  'fa-solid fa-pen': Pencil,
  'fa-solid fa-user-pen': Pencil,
  'fa-solid fa-trash': Trash2,
  'fa-solid fa-eye': Eye,
  'fa-solid fa-eye-slash': EyeOff,
  'fa-solid fa-magnifying-glass': Search,
  'fa-solid fa-xmark': X,
  'fa-solid fa-chevron-left': ChevronLeft,
  'fa-solid fa-chevron-right': ChevronRight,
  'fa-solid fa-chevron-down': ChevronDown,
  'fa-solid fa-angles-left': ChevronsLeft,
  'fa-solid fa-angles-right': ChevronsRight,
  'fa-solid fa-arrow-right': ArrowRight,
  'fa-solid fa-arrow-left': ArrowLeft,
  'fa-solid fa-arrow-up': ArrowUp,
  'fa-solid fa-arrow-down': ArrowDown,
  'fa-solid fa-arrow-up-right-from-square': ArrowUpRight,
  'fa-solid fa-check': Check,
  'fa-solid fa-circle-check': CheckCircle2,
  'fa-solid fa-download': Download,
  'fa-solid fa-upload': Upload,
  'fa-solid fa-filter': Filter,
  'fa-solid fa-rotate': RotateCcw,
  'fa-solid fa-floppy-disk': Save,
  'fa-solid fa-paper-plane': Send,
  'fa-solid fa-bell': Bell,
  'fa-solid fa-arrow-right-from-bracket': LogOut,
  'fa-solid fa-user': User,
  'fa-solid fa-user-plus': UserPlus,
  'fa-solid fa-bars': Menu,
  'fa-solid fa-camera': Camera,
  'fa-solid fa-ellipsis-vertical': MoreVertical,
  'fa-solid fa-star': Star,
  'fa-solid fa-bookmark': Bookmark,

  // Status
  'fa-solid fa-clock': Clock,
  'fa-solid fa-circle-xmark': XCircle,
  'fa-solid fa-triangle-exclamation': AlertTriangle,
  'fa-solid fa-circle-pause': CirclePause,
  'fa-solid fa-thumbs-up': ThumbsUp,
  'fa-solid fa-comments': MessageSquare,
  'fa-solid fa-trophy': Trophy,
  'fa-solid fa-clipboard-list': ClipboardList,
  'fa-solid fa-tag': Tag,
  'fa-solid fa-file': FileText,
  'fa-solid fa-hashtag': Hash,

  // Money / chart
  'fa-solid fa-dollar-sign': DollarSign,
  'fa-solid fa-arrow-trend-up': TrendingUp,
  'fa-solid fa-bullseye': Target,
  'fa-solid fa-calendar': Calendar,
  'fa-solid fa-credit-card': CreditCard,
  'fa-solid fa-money-bill': Banknote,
  'fa-solid fa-money-bill-wave': Wallet,

  // Location / contact
  'fa-solid fa-location-dot': MapPin,
  'fa-solid fa-phone': Phone,
  'fa-solid fa-shield-halved': ShieldCheck,
  'fa-solid fa-shield-alt': ShieldCheck,
  'fa-solid fa-lock': Lock,
  'fa-solid fa-key': Key,
  'fa-solid fa-circle-info': BookOpen,
  'fa-solid fa-users-gear': UserCog,
  'fa-solid fa-bell-concierge': BellRing,

  // Stats / data
  'fa-solid fa-chart-pie': PieChart,
  'fa-solid fa-chart-line': BarChart3,
  'fa-solid fa-wave-square': Activity,
  'fa-solid fa-globe': Globe,
  'fa-solid fa-share-nodes': Share2,
  'fa-solid fa-link': Link2,
  'fa-solid fa-copy': Copy,
  'fa-solid fa-arrow-up-right-from-square': ExternalLink,
  'fa-solid fa-circle-check-double': CheckCheck,
  'fa-solid fa-user-edit': Edit3,

  // Status bullet / extras
  'fa-solid fa-grip': Activity,
  'fa-solid fa-list': BarChart3,
  'fa-solid fa-file-export': Download,
  'fa-solid fa-building-circle-plus': Plus,
  'fa-solid fa-file-import': Upload,
  'fa-solid fa-square-check': Check,
  'fa-solid fa-square-pen': Pencil,
};

const aliasMap = {
  // Common alternates
  'plus': Plus,
  'pencil': Pencil,
  'pen': Pencil,
  'trash': Trash2,
  'eye': Eye,
  'eye-off': EyeOff,
  'search': Search,
  'x': X,
  'check': Check,
  'check-circle': CheckCircle2,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'chevrons-left': ChevronsLeft,
  'chevrons-right': ChevronsRight,
  'more-vertical': MoreVertical,
  'settings': Settings,
  'user': User,
  'users': Users,
  'mail': Mail,
  'bell': Bell,
  'log-out': LogOut,
  'menu': Menu,
  'briefcase': Briefcase,
  'building': Building2,
  'filter': Filter,
  'download': Download,
  'upload': Upload,
  'trending-up': TrendingUp,
  'star': Star,
  'crown': Crown,
  'rocket': Rocket,
  'sparkles': Sparkles,
  'save': Save,
  'grid': Grid,
  'layers': Layers,
  'user-check': UserCheck,
  'user-x': UserX,
  'clipboard': ClipboardList,
  'edit': Pencil,
  'edit-3': Edit3,
  'trash-2': Trash2,
  'gauge': Gauge,
  'shield': ShieldCheck,
  'lock': Lock,
  'key': Key,
  'sun': Sun,
  'moon': Moon,
  'camera': Camera,
  'user-plus': UserPlus,
  'map-pin': MapPin,
  'phone': Phone,
  'dollar-sign': DollarSign,
  'target': Target,
  'calendar': Calendar,
  'credit-card': CreditCard,
  'wallet': Wallet,
  'file-check': FileCheck2,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  'activity': Activity,
  'globe': Globe,
  'trophy': Trophy,
  'clock': Clock,
  'x-circle': XCircle,
  'alert-triangle': AlertTriangle,
  'message-square': MessageSquare,
  'thumbs-up': ThumbsUp,
  'tag': Tag,
  'file-text': FileText,
  'bookmark': Bookmark,
  'award': Award,
  'code': Code,
  'gift': Gift,
  'rotate-cw': RotateCcw,
  'help-circle': HelpCircle,
  'send': Send,
};

export const Icon = ({ name, size = 16, className = '', strokeWidth = 2, ...rest }) => {
  if (!name) return null;
  let Comp = iconMap[name];
  if (!Comp && typeof name === 'string') {
    Comp = aliasMap[name] || aliasMap[name?.toLowerCase()];
  }
  if (!Comp) {
    // last-resort: try kebab-case stripping fa- prefix
    return null;
  }
  return <Comp size={size} strokeWidth={strokeWidth} className={className} {...rest} />;
};

export default Icon;
