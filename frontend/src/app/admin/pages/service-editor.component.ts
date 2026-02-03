import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ServicesService, ServiceItem } from '../../shared/services/services.service';

const DEMO_SERVICES = [
  // --- INSTALLATION CAMÉRA (6 Modèles) ---
  {
    title: 'Vidéoprotection Résidentielle Intelligente',
    description: 'Sécurisez votre domicile avec une solution connectée. Caméras Wi-Fi 4K, détection humaine par IA, notifications push en temps réel et stockage sécurisé sur Cloud.',
    category: 'Installation Caméra',
    image: '/images/demo/camera_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    tags: ['Domotique', 'IA', '4K'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Surveillance Industrielle Haute Densité',
    description: 'Système robuste pour entrepôts et usines. Caméras dôme anti-vandale, vision nocturne longue portée (100m) et intégration avec centrale d\'alarme existante.',
    category: 'Installation Caméra',
    image: '/images/demo/camera_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    tags: ['Industrie', 'PTZ', 'Sécurité'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Kit Autonome Solaire pour Sites Isolés',
    description: 'Caméras 4G avec panneaux solaires intégrés, batterie haute capacité et résistance aux intempéries extrêmes.',
    category: 'Installation Caméra',
    image: '/images/demo/camera_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>',
    tags: ['Solaire', '4G', 'Autonome'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Solution Discrète pour Commerces de Luxe',
    description: 'Caméras pinhole ou design épuré qui s\'intègrent parfaitement à votre décoration. Analyse de flux client et comptage de personnes inclus.',
    category: 'Installation Caméra',
    image: '/images/demo/camera_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
    tags: ['Retail', 'Analytics', 'Design'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Contrat de Maintenance & Audit de Sécurité',
    description: 'Vérification complète de votre parc matériel, nettoyage des optiques et mise à jour des firmwares.',
    category: 'Installation Caméra',
    image: '/images/demo/camera_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    tags: ['Audit', 'Entretien', 'Pro'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Lecture de Plaques (LAPI) pour Parkings',
    description: 'Automatisez la gestion de vos accès véhicules. Reconnaissance de plaque minéralogique et rapports détaillés.',
    category: 'Installation Caméra',
    image: '/images/demo/camera_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="22" height="13" rx="2"/><path d="M7 21h10"/><path d="M12 16v5"/></svg>',
    tags: ['Parking', 'LAPI', 'Accès'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },

  // --- RÉSEAU INFORMATIQUE (6 Modèles) ---
  {
    title: 'Optimisation Wi-Fi 6 Haute Performance',
    description: 'Garantissez un débit stable partout. Cartographie de couverture et déploiement de bornes Wi-Fi 6 managées.',
    category: 'Réseau Informatique',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
    tags: ['Wi-Fi 6', 'Débit', 'Pro'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Câblage Structuré Fibre & Ethernet',
    description: 'Mise aux normes de votre baie de brassage. Câblage Cat6a/Cat7 et certification des liens réseau.',
    category: 'Réseau Informatique',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    tags: ['Fibre', 'Câblage', 'Baie'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Interconnexion VPN & Télétravail',
    description: 'Reliez vos agences distantes en toute sécurité. Mise en place de tunnels VPN IPsec ou SSL.',
    category: 'Réseau Informatique',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    tags: ['VPN', 'Sécurité', 'Remote'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Téléphonie IP (VoIP) & Serveur IPBX',
    description: 'Modernisez vos communications. Standard téléphonique virtuel et réduction des coûts de communication.',
    category: 'Réseau Informatique',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    tags: ['VoIP', 'IPBX', 'Communication'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Cyber-sécurité : Firewall & Filtrage',
    description: 'Protégez votre réseau des attaques extérieures. Installation de pare-feu et antivirus réseau.',
    category: 'Réseau Informatique',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
    tags: ['Firewall', 'Protection'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Stockage Centralisé NAS Pro',
    description: 'Centralisez et sécurisez vos données. Serveur NAS haute disponibilité et sauvegarde automatique.',
    category: 'Réseau Informatique',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
    tags: ['Storage', 'NAS', 'Data'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },

  // --- PHOTOGRAPHIE & VIDÉO (6 Modèles) ---
  {
    title: 'Reportage Photo Événementiel',
    description: 'Capturez les moments forts de vos événements professionnels avec une qualité exceptionnelle.',
    category: 'Photographie & Vidéo',
    image: '/images/demo/portfolio_digital.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    tags: ['Événement', 'Business'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Shooting Produit & E-commerce',
    description: 'Sublimez vos produits pour la vente en ligne avec des photos studio professionnelles.',
    category: 'Photographie & Vidéo',
    image: '/images/demo/portfolio_digital.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M22 12a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5"/></svg>',
    tags: ['Packshot', 'Studio'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Vidéo Clip Corporate & Interview',
    description: 'Une communication vidéo qui impacte. Tournage multi-caméras et habillage graphique.',
    category: 'Photographie & Vidéo',
    image: '/images/demo/portfolio_digital.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="m22 7-8.5 5 8.5 5Z"/></svg>',
    tags: ['Vidéo', 'Interview'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Captation Drone : Vue Aérienne 4K',
    description: 'Prenez de la hauteur pour vos projets immobiliers ou promotionnels.',
    category: 'Photographie & Vidéo',
    image: '/images/demo/portfolio_digital.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 15c.67 0 1.22.45 1.41 1.07l.59 2.1c.3 1.03-.4 2.1-1.46 2.1H10.46c-1.06 0-1.76-1.07-1.46-2.1l.59-2.1A1.5 1.5 0 0 1 11 15h2z"/></svg>',
    tags: ['Drone', '4K'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Reportage Mariage Cinématique',
    description: 'Immortalisez le plus beau jour de votre vie avec un film narratif et émouvant.',
    category: 'Photographie & Vidéo',
    image: '/images/demo/portfolio_digital.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>',
    tags: ['Wedding', 'Emotion'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Montage Vidéo & Post-Production',
    description: 'Confiez-nous vos rushes pour un montage dynamique et professionnel.',
    category: 'Photographie & Vidéo',
    image: '/images/demo/portfolio_digital.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6l5-3z"/></svg>',
    tags: ['Editing', 'FX'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },

  // --- MAINTENANCE IT (6 Modèles) ---
  {
    title: 'Support Informatique & Infogérance',
    description: 'Tranquillité d\'esprit totale. Hotline dédiée et dépannage sur site rapide.',
    category: 'Maintenance IT',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    tags: ['Support', 'Hotline'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Réparation & Optimisation Hardware',
    description: 'Donnez une seconde vie à vos ordinateurs avec un nettoyage et optimisation complète.',
    category: 'Maintenance IT',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11"/></svg>',
    tags: ['Hardware', 'Optimisation'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Audit de Sécurité & Nettoyage Malware',
    description: 'Protégez vos données sensibles. Scan complet et éradication des menaces.',
    category: 'Maintenance IT',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
    tags: ['Security', 'Virus'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Maintenance Serveur & Infrastructure',
    description: 'Analyse et optimisation de vos serveurs pour une performance maximale.',
    category: 'Maintenance IT',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/></svg>',
    tags: ['System', 'Server'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Récupération de Données Critiques',
    description: 'Solution de secours pour vos fichiers perdus sur supports défectueux.',
    category: 'Maintenance IT',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/></svg>',
    tags: ['Recovery', 'Emergency'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },
  {
    title: 'Gestion de Parc Informatique',
    description: 'Inventaire et planification du renouvellement matériel de votre entreprise.',
    category: 'Maintenance IT',
    image: '/images/demo/network_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>',
    tags: ['Parc', 'Asset'],
    banners: ['/images/demo/camera_b1.png', '/images/demo/camera_b2.png', '/images/demo/camera_b3.png']
  },

  // --- MARKETING DIGITAL (6 Modèles) ---
  {
    title: 'SEO Local & Visibilité Google',
    description: 'Apparaissez en tête des recherches locales et attirez plus de clients.',
    category: 'Marketing Digital',
    image: '/images/demo/web_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    tags: ['SEO', 'Google'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },
  {
    title: 'Gestion de Publicités Payantes Ads',
    description: 'Maximisez votre ROI avec des campagnes ciblées sur Google et les réseaux sociaux.',
    category: 'Marketing Digital',
    image: '/images/demo/web_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    tags: ['Ads', 'ROI'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },
  {
    title: 'Community Management Stratégique',
    description: 'Faites grandir votre communauté et engagez vos followers durablement.',
    category: 'Marketing Digital',
    image: '/images/demo/web_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    tags: ['Social', 'Growth'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },
  {
    title: 'Email Marketing & CRM Automation',
    description: 'Automatisez votre relation client et boostez vos ventes par email.',
    category: 'Marketing Digital',
    image: '/images/demo/web_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/></svg>',
    tags: ['Emailing', 'CRM'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },
  {
    title: 'Stratégie d\'Influence Digitale',
    description: 'Associez votre marque aux bons créateurs de contenu pour un impact maximal.',
    category: 'Marketing Digital',
    image: '/images/demo/web_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>',
    tags: ['Influence', 'Branding'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },
  {
    title: 'Audit de Croissance & Analytics',
    description: 'Étude approfondie de vos performances pour définir vos axes de croissance.',
    category: 'Marketing Digital',
    image: '/images/demo/web_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/></svg>',
    tags: ['Audit', 'Data'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },

  // --- DÉVELOPPEMENT WEB (6 Modèles) ---
  {
    title: 'Plateforme E-commerce SaaS',
    description: 'Une boutique en ligne complète avec gestion des stocks et paiements sécurisés.',
    category: 'Développement Web',
    image: '/images/demo/web_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    tags: ['E-commerce', 'SaaS'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },
  {
    title: 'Portfolio Créatif Haute-Couture',
    description: 'Mettez en valeur votre travail avec un design minimaliste et des animations fluides.',
    category: 'Développement Web',
    image: '/images/demo/portfolio_digital.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12V2"/><path d="M12 12 5.6 5.6"/></svg>',
    tags: ['Creative', 'Portfolio'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },
  {
    title: 'Logiciel de Gestion Métier (ERP)',
    description: 'Centralisez vos processus : facturation, stock et clients dans un outil sur mesure.',
    category: 'Développement Web',
    image: '/images/demo/gestion_ecole.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    tags: ['ERP', 'B2B'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },
  {
    title: 'Invitation Numérique & RSVP',
    description: 'Solution moderne pour vos mariages et événements avec gestion des invités par QR Code.',
    category: 'Développement Web',
    image: '/images/demo/invitation_mariage.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    tags: ['Event', 'Invite'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },
  {
    title: 'Blog / Média Haute Performance',
    description: 'Un outil de publication optimisé pour le contenu editorial et le référencement naturel.',
    category: 'Développement Web',
    image: '/images/demo/boutique_saas.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>',
    tags: ['CMS', 'Media'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  },
  {
    title: 'Landing Page Conversion-Focused',
    description: 'Une page performante conçue pour maximiser votre taux de transformation.',
    category: 'Développement Web',
    image: '/images/demo/web_main.png',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    tags: ['Sales', 'Conversion'],
    banners: ['/images/demo/web_b1.png', '/images/demo/web_b2.png', '/images/demo/web_b3.png']
  }
];

@Component({
  selector: 'app-service-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="editor-container">
      <!-- Success Modal Overlay -->
      @if (showSuccessModal()) {
        <div class="success-modal-overlay animate-in" (click)="closeModalAndRedirect()">
          <div class="success-modal-card" (click)="$event.stopPropagation()">
            <div class="modal-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Félicitations !</h3>
            <p>{{ modalMessage() }}</p>
            <button type="button" class="btn-modal-ok" (click)="closeModalAndRedirect()">
              Continuer
            </button>
          </div>
        </div>
      }

      <header class="editor-header">
        <div class="header-info">
          <h1>{{ isEditing() ? 'Modifier le Service' : 'Nouveau Service' }}</h1>
          <p>{{ isEditing() ? 'Mettez à jour les informations de votre expertise.' : 'Créez une nouvelle expertise pour vos clients.' }}</p>
        </div>
        <div class="header-actions">
           <!-- Demo Data Button -->
          <div class="demo-selector-wrapper">
            <button type="button" class="btn-demo" (click)="showDemoDropdown.set(!showDemoDropdown())">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.455L18 2.25l.259 1.036a3.375 3.375 0 002.455 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.455zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              Auto-remplissage
            </button>
            <!-- Visual Demo Explorer -->
            @if (showDemoDropdown()) {
              <div class="demo-explorer-overlay animate-in" (click)="showDemoDropdown.set(false)">
                <div class="demo-explorer" (click)="$event.stopPropagation()">
                  <div class="explorer-header">
                    <div class="header-content">
                      <div class="explorer-badge">NEW</div>
                      <h3>Catalogue de Modèles</h3>
                      <p>36 configurations prêtes à l'emploi</p>
                    </div>
                    <button type="button" class="btn-close-explorer" (click)="showDemoDropdown.set(false)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div class="explorer-body">
                    <aside class="explorer-sidebar">
                      @for (cat of categories; track cat) {
                        <button type="button" 
                                class="cat-tab" 
                                [class.active]="activeDemoCategory() === cat"
                                (click)="activeDemoCategory.set(cat)">
                          <span class="tab-indicator"></span>
                          {{ cat }}
                        </button>
                      }
                    </aside>

                    <div class="explorer-content">
                      <div class="models-grid">
                        @for (demo of getDemosByCategory(activeDemoCategory()); track demo.title) {
                          <div class="model-card" (click)="applyDemoData(demo)">
                            <div class="card-image">
                              <img [src]="demo.image" [alt]="demo.title">
                              <div class="card-overlay">
                                <span class="btn-apply">Utiliser ce modèle</span>
                              </div>
                            </div>
                            <div class="card-info">
                              <h4>{{ demo.title }}</h4>
                              <p>{{ demo.description }}</p>
                              <div class="card-footer-info">
                                <span class="badge-tag">{{ demo.tags[0] }}</span>
                                <span class="badge-banners">+3 Bannières</span>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <button routerLink="/ods-management-portal-x9/services" class="btn-back">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour
          </button>
        </div>
      </header>

      <div class="editor-card animate-in">
        <form (submit)="saveService($event)" class="editor-form">
          <div class="form-body">
            <div class="form-main">
              <div class="form-group">
                <label>Titre du Service</label>
                <input type="text" [(ngModel)]="currentService.title" name="title" required placeholder="Ex: Développement Web Sur Mesure">
              </div>

              <div class="form-group">
                <label>Description Complète</label>
                <textarea [(ngModel)]="currentService.description" name="description" rows="6" required placeholder="Décrivez votre service en détail..."></textarea>
              </div>

              <div class="grid-2-cols">
                <div class="form-group">
                  <label>Catégorie</label>
                  <select [(ngModel)]="currentService.category" name="category" required (change)="onCategoryChange()">
                    <option value="Développement Web">Développement Web</option>
                    <option value="Installation Caméra">Installation Caméra</option>
                    <option value="Réseau Informatique">Réseau Informatique</option>
                    <option value="Photographie & Vidéo">Photographie & Vidéo</option>
                    <option value="Maintenance IT">Maintenance IT</option>
                    <option value="Marketing Digital">Marketing Digital</option>
                  </select>
                </div>
                <div class="form-group">
                  <div class="label-with-action">
                    <label>Tags (Automatique & Manuel)</label>
                    <button type="button" class="btn-toggle-options" (click)="showSuggestedTags.set(!showSuggestedTags())">
                      {{ showSuggestedTags() ? 'Masquer suggestions' : 'Voir suggestions' }}
                    </button>
                  </div>
                  <div class="tags-selector">
                    @if (showSuggestedTags()) {
                      <div class="suggested-tags animate-in">
                        @for (tag of suggestedTags; track tag) {
                          <button type="button" class="tag-chip" (click)="addTag(tag)">+ {{ tag }}</button>
                        }
                      </div>
                    }
                    <div class="selected-tags">
                      @for (tag of currentService.tags; track $index) {
                        <span class="tag-item">
                          {{ tag }}
                          <button type="button" (click)="removeTag($index)">&times;</button>
                        </span>
                      }
                    </div>
                    <input type="text" [ngModel]="currentService.tags.join(',')" (ngModelChange)="updateTags($event)" name="tags" placeholder="Ou tapez ici (séparés par virgules)...">
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="label-with-action">
                  <label>Icône (SVG HTML)</label>
                  <button type="button" class="btn-toggle-options" (click)="showIconPicker.set(!showIconPicker())">
                    {{ showIconPicker() ? 'Masquer la grille' : 'Choisir une icône' }}
                  </button>
                </div>
                <div class="icon-picker-container">
                  @if (showIconPicker()) {
                    <div class="icon-grid animate-in">
                      @for (icon of sanitizedIcons; track icon.name) {
                        <div class="icon-option" [class.active]="currentService.icon === icon.svg" (click)="selectIcon(icon.svg)" [title]="icon.name" [innerHTML]="icon.safeSvg">
                        </div>
                      }
                    </div>
                  }
                  <div class="icon-custom">
                    <textarea [(ngModel)]="currentService.icon" name="icon" rows="3" style="font-family: monospace; font-size: 0.8rem;" placeholder="Ou collez votre code SVG ici..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-sidebar">
              <div class="form-group">
                <label>Image de Couverture</label>
                <div class="image-upload-zone compact" (click)="coverInput.click()">
                  <div *ngIf="currentService.image" class="preview-container mini">
                    <img [src]="currentService.image" alt="Preview">
                    <div class="change-overlay">Changer</div>
                  </div>
                  <div *ngIf="!currentService.image" class="upload-placeholder small">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l1.29 1.29m-4.717-4.717L19.5 8.25m-18 3.333v1.5c0 .66.54 1.2 1.2 1.2h.5c.66 0 1.2-.54 1.2-1.2v-1.5m6-4.5h.5c.66 0 1.2.54 1.2 1.2v1.5c0 .66-.54 1.2-1.2 1.2h-.5c-.66 0-1.2-.54-1.2-1.2v-1.5z" />
                    </svg>
                    <span>Image</span>
                  </div>
                  <input #coverInput type="file" (change)="onFileSelected($event)" style="display: none" accept="image/*">
                </div>
              </div>
            </div>
          </div>

          <!-- Banner Section -->
          <div class="banner-section">
            <div class="banner-header">
              <h3>Bannières Publicitaires ({{ currentService.category }})</h3>
              <p>Diaporama en haut de catégorie.</p>
            </div>
            
            <div class="banner-grid compact">
              @for (img of bannerImages(); track $index) {
                <div class="banner-item">
                  <div class="image-upload-zone mini" (click)="bannerInput.click()">
                    <div *ngIf="img" class="preview-container x-mini">
                      <img [src]="img" alt="Banner Preview">
                    </div>
                    <div *ngIf="!img" class="upload-placeholder x-small">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <input #bannerInput type="file" (change)="onBannerFileSelected($event, $index)" style="display: none" accept="image/*">
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="form-footer">
            <button type="button" routerLink="/ods-management-portal-x9/services" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-submit" [disabled]="isSaving()">
              {{ isSaving() ? 'Enregistrement...' : (isEditing() ? 'Mettre à jour' : 'Créer le service') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrl: './service-editor.component.scss'
})
export class ServiceEditorComponent implements OnInit {
  private servicesService = inject(ServicesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  isEditing = signal(false);
  isSaving = signal(false);
  bannerImages = signal<string[]>(['', '', '']);
  showIconPicker = signal(false);
  showSuggestedTags = signal(false);
  showDemoDropdown = signal(false);
  activeDemoCategory = signal('Installation Caméra');
  showSuccessModal = signal(false);
  modalMessage = signal('');

  demoServices = DEMO_SERVICES;
  categories = [
    'Développement Web',
    'Installation Caméra',
    'Réseau Informatique',
    'Photographie & Vidéo',
    'Maintenance IT',
    'Marketing Digital'
  ];

  getDemosByCategory(category: string) {
    return this.demoServices.filter(d => d.category === category);
  }

  // Sanitized Icons for rendering
  sanitizedIcons: { name: string, svg: string, safeSvg: SafeHtml }[] = [];

  // Predefined Icons
  predefinedIcons = [
    { name: 'Web', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
    { name: 'Code', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
    { name: 'Camera', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' },
    { name: 'Shield', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
    { name: 'Server', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>' },
    { name: 'Mobile', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
    { name: 'Search', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' },
    { name: 'Design', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l5 5"/><path d="M9.5 14.5L16 8"/></svg>' },
    { name: 'Cpu', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>' },
    { name: 'Database', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' },
    { name: 'Globe', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
    { name: 'HardDrive', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>' }
  ];

  // Suggested Tags
  suggestedTags = [
    'Angular', 'React', 'Vue', 'Next.js', 'Node.js', 'Firebase',
    'UI/UX', 'SEO', 'Marketing', 'Sécurité', 'Réseau', 'Cloud',
    'E-commerce', 'SaaS', 'Mobile', 'WordPress', 'Python'
  ];


  currentService: ServiceItem = {
    title: '',
    description: '',
    category: 'Développement Web',
    image: '',
    icon: '',
    tags: []
  };

  ngOnInit() {
    this.sanitizedIcons = this.predefinedIcons.map(icon => ({
      ...icon,
      safeSvg: this.sanitizer.bypassSecurityTrustHtml(icon.svg)
    }));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.loadService(id);
    } else {
      this.loadCategoryBanner();
    }
  }

  loadService(id: string) {
    this.servicesService.getService(id).subscribe(service => {
      if (service) {
        this.currentService = { ...service };
        if (!this.currentService.tags) this.currentService.tags = [];
        this.loadCategoryBanner();
      } else {
        alert('Service introuvable');
        this.router.navigate(['/ods-management-portal-x9/services']);
      }
    });
  }

  loadCategoryBanner() {
    this.servicesService.getCategoryBanner(this.currentService.category).subscribe(banner => {
      if (banner && banner.images) {
        this.bannerImages.set(banner.images);
      } else {
        this.bannerImages.set(['', '', '']);
      }
    });
  }

  onCategoryChange() {
    this.loadCategoryBanner();
  }

  updateTags(tagsStr: string) {
    this.currentService.tags = tagsStr.split(',').map(t => t.trim()).filter(t => t !== '');
  }

  addTag(tag: string) {
    if (!this.currentService.tags.includes(tag)) {
      this.currentService.tags = [...this.currentService.tags, tag];
    }
  }

  removeTag(index: number) {
    this.currentService.tags.splice(index, 1);
    this.currentService.tags = [...this.currentService.tags];
  }

  selectIcon(svg: string) {
    this.currentService.icon = svg;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isSaving.set(true);
      this.servicesService.uploadImage(file).subscribe({
        next: (res) => {
          this.currentService.image = res.url;
          this.isSaving.set(false);
        },
        error: () => {
          alert('Erreur lors de l\'upload de l\'image');
          this.isSaving.set(false);
        }
      });
    }
  }

  onBannerFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.isSaving.set(true);
      this.servicesService.uploadImage(file).subscribe({
        next: (res) => {
          const newImages = [...this.bannerImages()];
          newImages[index] = res.url;
          this.bannerImages.set(newImages);
          this.isSaving.set(false);
        },
        error: () => {
          alert('Erreur lors de l\'upload de la bannière');
          this.isSaving.set(false);
        }
      });
    }
  }

  applyDemoData(demo: any) {
    this.currentService = {
      ...this.currentService,
      title: demo.title,
      description: demo.description,
      category: demo.category,
      image: demo.image,
      icon: demo.icon,
      tags: [...demo.tags]
    };
    this.bannerImages.set([...demo.banners]);
    this.showDemoDropdown.set(false);
  }

  closeModalAndRedirect() {
    this.showSuccessModal.set(false);
    this.router.navigate(['/ods-management-portal-x9/services']);
  }

  saveService(event: Event) {
    event.preventDefault();
    if (!this.currentService.title || !this.currentService.description) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    this.isSaving.set(true);

    // Save Category Banner first or in parallel
    const bannerObs = this.servicesService.saveCategoryBanner(
      this.currentService.category,
      this.bannerImages()
    );

    const serviceObs = this.isEditing()
      ? this.servicesService.updateService(this.currentService.id!, this.currentService)
      : this.servicesService.createService(this.currentService);

    bannerObs.subscribe({
      next: () => {
        serviceObs.subscribe({
          next: () => {
            this.modalMessage.set(this.isEditing() ? 'Service et bannières mis à jour avec succès !' : 'Service créé avec bannières !');
            this.showSuccessModal.set(true);
            this.isSaving.set(false);
          },
          error: (err) => {
            console.error(err);
            alert('Erreur service : ' + (err.message || 'Erreur inconnue'));
            this.isSaving.set(false);
          }
        });
      },
      error: (err) => {
        console.error(err);
        alert('Erreur bannière : ' + (err.message || 'Erreur inconnue'));
        this.isSaving.set(false);
      }
    });
  }
}
