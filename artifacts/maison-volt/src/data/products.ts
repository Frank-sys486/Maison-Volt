export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  shortDescription: string;
  specs: string[];
  warranty: string;
  rating: number;
  image: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "nova-14",
    name: "NovaBook Atelier 14",
    category: "Laptops",
    price: 74990,
    shortDescription: "Premium daily driver for productivity and coding.",
    description: "Forged from a single block of aerospace-grade aluminum, the NovaBook Atelier 14 is the ultimate expression of mobile productivity. With an industry-leading OLED display and a custom-tuned tactile keyboard, it seamlessly bridges the gap between raw performance and uncompromising elegance.",
    specs: ["16GB LPDDR5X RAM", "1TB PCIe 4.0 NVMe SSD", "14-inch 2.8K OLED Display (120Hz)", "12-hour all-day battery life", "Precision glass trackpad"],
    warranty: "1-year limited warranty",
    rating: 4.9,
    image: "/attached_assets/generated_images/laptop.jpg",
    badge: "Flagship"
  },
  {
    id: "vanta-x1",
    name: "VantaPhone X1",
    category: "Smartphones",
    price: 52990,
    shortDescription: "Flagship mobile photography and sleek aesthetics.",
    description: "The VantaPhone X1 redefines mobile luxury. Encased in midnight matte glass with subtle brass accents, it features a pro-grade camera system co-engineered with industry masters. Experience fluid, uninterrupted power in a device that looks as good as it performs.",
    specs: ["256GB UFS 4.0 Storage", "6.7-inch LTPO AMOLED Display", "50MP Triple Camera System", "120W Ultra-fast charging", "Titanium alloy frame"],
    warranty: "1-year limited warranty",
    rating: 4.8,
    image: "/attached_assets/generated_images/phone.jpg"
  },
  {
    id: "aurum-headphones",
    name: "Aurum Wireless Headphones",
    category: "Audio",
    price: 18990,
    shortDescription: "Studio-grade sound meets active noise cancellation.",
    description: "Tune out the noise and immerse yourself in pristine, studio-quality sound. The Aurum Wireless Headphones are crafted with memory foam earcups wrapped in synthetic leather, offering unparalleled comfort for extended listening sessions.",
    specs: ["Adaptive Active Noise Cancellation", "40-hour continuous playback", "Spatial audio support", "High-fidelity 50mm drivers", "Machined aluminum yokes"],
    warranty: "1-year limited warranty",
    rating: 4.7,
    image: "/attached_assets/generated_images/headphones.jpg",
    badge: "Bestseller"
  },
  {
    id: "obsidian-keyboard",
    name: "Obsidian Mechanical Keyboard",
    category: "Desk Setup",
    price: 9990,
    shortDescription: "Tactile perfection for coders and writers.",
    description: "The Obsidian Mechanical Keyboard is an absolute joy to type on. Built around a solid aluminum chassis with a sound-dampening foam layer, it delivers a deeply satisfying acoustic signature with every keystroke. Hot-swappable switches allow for endless customization.",
    specs: ["CNC machined aluminum frame", "Hot-swappable tactile switches", "Pure white subtle LED backlight", "Double-shot PBT keycaps", "Detachable braided USB-C cable"],
    warranty: "1-year limited warranty",
    rating: 4.9,
    image: "/attached_assets/generated_images/keyboard.jpg"
  },
  {
    id: "luxe-dock",
    name: "LuxeDock USB-C Hub",
    category: "Desk Setup",
    price: 6490,
    shortDescription: "Essential connectivity in an elegant form factor.",
    description: "Expand your workspace without compromising your desk's aesthetic. The LuxeDock seamlessly matches your premium devices while providing all the essential ports you need for a fully realized workstation.",
    specs: ["4K@60Hz HDMI output", "100W USB-C Power Delivery", "UHS-II SD & MicroSD readers", "3x USB-A 3.2 Gen 2 ports", "Anodized aluminum casing"],
    warranty: "1-year limited warranty",
    rating: 4.6,
    image: "/attached_assets/generated_images/hub.jpg"
  },
  {
    id: "noir-speaker",
    name: "Noir Smart Speaker",
    category: "Smart Home",
    price: 12990,
    shortDescription: "Room-filling audio wrapped in minimalist design.",
    description: "A statement piece that sounds as magnificent as it looks. The Noir Smart Speaker delivers 360-degree omnidirectional audio with deep, resonant bass and crystal-clear highs. Intelligent voice control integrates effortlessly into your smart home ecosystem.",
    specs: ["360-degree room-filling sound", "Far-field voice recognition", "Multi-room audio sync", "Matte fabric and metal finish", "Seamless smart home integration"],
    warranty: "1-year limited warranty",
    rating: 4.8,
    image: "/attached_assets/generated_images/speaker.jpg"
  },
  {
    id: "monolith-monitor",
    name: "Monolith 4K Monitor",
    category: "Desk Setup",
    price: 32990,
    shortDescription: "A breathtaking window to your creative work.",
    description: "The Monolith 4K Monitor provides absolute color accuracy in a stunning edge-to-edge design. Designed for creators who demand perfection, it serves as the ultimate centerpiece for a premium desk setup.",
    specs: ["27-inch 4K UHD (3840x2160) IPS panel", "99% DCI-P3 color gamut", "HDR400 certification", "USB-C display input with 90W charging", "Adjustable solid metal stand"],
    warranty: "1-year limited warranty",
    rating: 4.9,
    image: "/attached_assets/generated_images/monitor.jpg",
    badge: "New"
  },
  {
    id: "axis-charger",
    name: "Axis Travel Charger",
    category: "Travel Tech",
    price: 4990,
    shortDescription: "Power everything you own from a single outlet.",
    description: "Travel lighter. The Axis Travel Charger utilizes advanced GaN technology to pack an astonishing 100W of power into a form factor smaller than a deck of cards. Charge your laptop, phone, and accessories simultaneously.",
    specs: ["100W maximum output", "Advanced GaN tech for compact size", "3x USB-C ports, 1x USB-A port", "Foldable prongs for travel", "Intelligent power distribution"],
    warranty: "1-year limited warranty",
    rating: 4.7,
    image: "/attached_assets/generated_images/charger.jpg"
  }
];
