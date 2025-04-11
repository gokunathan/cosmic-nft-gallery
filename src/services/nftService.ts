
// Mock NFT data service
export interface Creator {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
}

export interface Collection {
  id: string;
  name: string;
  verified: boolean;
  floorPrice: number;
  bannerImage?: string;
}

export interface Rarity {
  score: number;
  rank: number;
  totalInCollection: number;
}

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface HistoryEvent {
  event: 'Minted' | 'Transfer' | 'Sale' | 'Bid';
  from: string;
  to: string;
  date: string;
  price: number;
  currency: string;
}

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  previewImage: string;
  creator: Creator;
  collection: Collection;
  price: number;
  currency: string;
  likes: number;
  views: number;
  listed: string;
  auction: boolean;
  blockchain: string;
  rarity: Rarity;
  attributes: Attribute[];
  history: HistoryEvent[];
  liked?: boolean; // Client-side tracking
  endTime?: string; // For auctions
}

// Sample Collections
const collections: Collection[] = [
  {
    id: "collection-123",
    name: "Cosmic Dreamers",
    verified: true,
    floorPrice: 0.85,
    bannerImage: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "collection-124",
    name: "Ethernal Voxels",
    verified: true,
    floorPrice: 1.2,
    bannerImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "collection-125",
    name: "Abstract Dimensions",
    verified: false,
    floorPrice: 0.2,
    bannerImage: "https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "collection-126",
    name: "Digital Fauna",
    verified: true,
    floorPrice: 0.65,
    bannerImage: "https://images.unsplash.com/photo-1578393098337-5594cce112da?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3"
  }
];

// Sample Creators
const creators: Creator[] = [
  {
    id: "creator-789",
    name: "DigitalDreamer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true
  },
  {
    id: "creator-790",
    name: "VoxelKing",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    verified: true
  },
  {
    id: "creator-791",
    name: "AbstractAlice",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    verified: false
  },
  {
    id: "creator-792",
    name: "CryptoFauna",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    verified: true
  }
];

// Sample NFTs
export const nfts: NFT[] = [
  // Cosmic Dreamers Collection
  {
    id: "nft-12345",
    name: "Cosmic Dreamer #42",
    description: "An interdimensional being floating through the cosmic void",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3",
    creator: creators[0],
    collection: collections[0],
    price: 1.2,
    currency: "ETH",
    likes: 234,
    views: 1892,
    listed: "2025-03-15T14:30:00Z",
    auction: false,
    blockchain: "Ethereum",
    rarity: {
      score: 87.5,
      rank: 42,
      totalInCollection: 10000
    },
    attributes: [
      { trait_type: "Background", value: "Deep Space" },
      { trait_type: "Skin", value: "Nebula" },
      { trait_type: "Eyes", value: "Starlight" },
      { trait_type: "Accessory", value: "Cosmic Halo" }
    ],
    history: [
      {
        event: "Minted",
        from: "0x0000000000000000000000000000000000000000",
        to: "0x1a2b3c...",
        date: "2025-01-10T12:00:00Z",
        price: 0.5,
        currency: "ETH"
      },
      {
        event: "Transfer",
        from: "0x1a2b3c...",
        to: "0x4d5e6f...",
        date: "2025-02-05T18:45:00Z",
        price: 0.75,
        currency: "ETH"
      }
    ]
  },
  {
    id: "nft-12346",
    name: "Cosmic Dreamer #137",
    description: "A dreamlike entity with a glimpse into another universe",
    image: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    creator: creators[0],
    collection: collections[0],
    price: 0.95,
    currency: "ETH",
    likes: 158,
    views: 1243,
    listed: "2025-03-12T09:15:00Z",
    auction: false,
    blockchain: "Ethereum",
    rarity: {
      score: 72.3,
      rank: 137,
      totalInCollection: 10000
    },
    attributes: [
      { trait_type: "Background", value: "Cosmic Nebula" },
      { trait_type: "Skin", value: "Stardust" },
      { trait_type: "Eyes", value: "Galaxy" },
      { trait_type: "Accessory", value: "Star Crown" }
    ],
    history: [
      {
        event: "Minted",
        from: "0x0000000000000000000000000000000000000000",
        to: "0xabc123...",
        date: "2025-01-05T14:30:00Z",
        price: 0.5,
        currency: "ETH"
      }
    ]
  },
  
  // Ethernal Voxels Collection
  {
    id: "nft-23456",
    name: "Voxel Spacecraft #08",
    description: "A meticulously crafted voxel spacecraft hovering above an alien landscape",
    image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    creator: creators[1],
    collection: collections[1],
    price: 1.45,
    currency: "ETH",
    likes: 312,
    views: 2420,
    listed: "2025-03-10T11:20:00Z",
    auction: true,
    endTime: "2025-04-20T11:20:00Z",
    blockchain: "Ethereum",
    rarity: {
      score: 92.1,
      rank: 8,
      totalInCollection: 500
    },
    attributes: [
      { trait_type: "Base", value: "Titanium" },
      { trait_type: "Engines", value: "Quantum" },
      { trait_type: "Weapons", value: "Plasma" },
      { trait_type: "Special", value: "Cloaking" }
    ],
    history: [
      {
        event: "Minted",
        from: "0x0000000000000000000000000000000000000000",
        to: "0xdef456...",
        date: "2025-02-01T09:00:00Z",
        price: 0.8,
        currency: "ETH"
      },
      {
        event: "Sale",
        from: "0xdef456...",
        to: "0xghi789...",
        date: "2025-02-28T16:30:00Z",
        price: 1.2,
        currency: "ETH"
      }
    ]
  },
  {
    id: "nft-23457",
    name: "Voxel Mech #15",
    description: "A battle-ready mech constructed in voxel art style",
    image: "https://images.unsplash.com/photo-1683009427500-71a01c6f3e8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1683009427500-71a01c6f3e8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    creator: creators[1],
    collection: collections[1],
    price: 1.8,
    currency: "ETH",
    likes: 276,
    views: 1890,
    listed: "2025-03-08T13:45:00Z",
    auction: true,
    endTime: "2025-04-15T13:45:00Z",
    blockchain: "Ethereum",
    rarity: {
      score: 88.7,
      rank: 15,
      totalInCollection: 500
    },
    attributes: [
      { trait_type: "Armor", value: "Heavy" },
      { trait_type: "Weaponry", value: "Missile Pods" },
      { trait_type: "Power", value: "Fusion Core" },
      { trait_type: "Special", value: "Jump Jets" }
    ],
    history: [
      {
        event: "Minted",
        from: "0x0000000000000000000000000000000000000000",
        to: "0xvwx789...",
        date: "2025-01-25T14:15:00Z",
        price: 1.0,
        currency: "ETH"
      }
    ]
  },
  
  // Abstract Dimensions Collection
  {
    id: "nft-34567",
    name: "Dimensional Shift #24",
    description: "An abstract representation of reality shifting between dimensions",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    creator: creators[2],
    collection: collections[2],
    price: 0.35,
    currency: "ETH",
    likes: 89,
    views: 754,
    listed: "2025-03-14T08:30:00Z",
    auction: false,
    blockchain: "Polygon",
    rarity: {
      score: 62.8,
      rank: 24,
      totalInCollection: 100
    },
    attributes: [
      { trait_type: "Dimension", value: "Fourth" },
      { trait_type: "Color Scheme", value: "Ultraviolet" },
      { trait_type: "Complexity", value: "High" },
      { trait_type: "Movement", value: "Fluid" }
    ],
    history: [
      {
        event: "Minted",
        from: "0x0000000000000000000000000000000000000000",
        to: "0xjkl012...",
        date: "2025-02-20T10:20:00Z",
        price: 0.2,
        currency: "ETH"
      }
    ]
  },
  {
    id: "nft-34568",
    name: "Abstract Topology #07",
    description: "A study in geometric abstraction and spatial relationships",
    image: "https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    creator: creators[2],
    collection: collections[2],
    price: 0.28,
    currency: "ETH",
    likes: 65,
    views: 612,
    listed: "2025-03-13T16:45:00Z",
    auction: false,
    blockchain: "Polygon",
    rarity: {
      score: 71.4,
      rank: 7,
      totalInCollection: 100
    },
    attributes: [
      { trait_type: "Style", value: "Geometric" },
      { trait_type: "Color Scheme", value: "Monochromatic" },
      { trait_type: "Complexity", value: "Medium" },
      { trait_type: "Technique", value: "Digital Painting" }
    ],
    history: [
      {
        event: "Minted",
        from: "0x0000000000000000000000000000000000000000",
        to: "0xmno345...",
        date: "2025-02-18T09:10:00Z",
        price: 0.15,
        currency: "ETH"
      },
      {
        event: "Sale",
        from: "0xmno345...",
        to: "0xpqr678...",
        date: "2025-03-01T14:25:00Z",
        price: 0.25,
        currency: "ETH"
      }
    ]
  },
  
  // Digital Fauna Collection
  {
    id: "nft-45678",
    name: "Cybernetic Lion #03",
    description: "A majestic lion reimagined with cybernetic enhancements",
    image: "https://images.unsplash.com/photo-1520931061294-db3e762a9273?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1520931061294-db3e762a9273?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3",
    creator: creators[3],
    collection: collections[3],
    price: 0.75,
    currency: "ETH",
    likes: 187,
    views: 1432,
    listed: "2025-03-09T12:15:00Z",
    auction: false,
    blockchain: "Ethereum",
    rarity: {
      score: 94.2,
      rank: 3,
      totalInCollection: 300
    },
    attributes: [
      { trait_type: "Species", value: "Lion" },
      { trait_type: "Enhancement", value: "Cyber Eyes" },
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Environment", value: "Tech Savanna" }
    ],
    history: [
      {
        event: "Minted",
        from: "0x0000000000000000000000000000000000000000",
        to: "0xstu901...",
        date: "2025-02-05T11:30:00Z",
        price: 0.5,
        currency: "ETH"
      }
    ]
  },
  {
    id: "nft-45679",
    name: "Digital Butterfly #18",
    description: "A spectacularly colored digital butterfly with interactive wing patterns",
    image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3",
    creator: creators[3],
    collection: collections[3],
    price: 0.6,
    currency: "ETH",
    likes: 142,
    views: 978,
    listed: "2025-03-11T10:50:00Z",
    auction: true,
    endTime: "2025-04-18T10:50:00Z",
    blockchain: "Ethereum",
    rarity: {
      score: 85.9,
      rank: 18,
      totalInCollection: 300
    },
    attributes: [
      { trait_type: "Species", value: "Butterfly" },
      { trait_type: "Wing Pattern", value: "Fractal" },
      { trait_type: "Animation", value: "Color Shift" },
      { trait_type: "Environment", value: "Digital Garden" }
    ],
    history: [
      {
        event: "Minted",
        from: "0x0000000000000000000000000000000000000000",
        to: "0xvwx234...",
        date: "2025-02-10T15:40:00Z",
        price: 0.4,
        currency: "ETH"
      },
      {
        event: "Sale",
        from: "0xvwx234...",
        to: "0xyz567...",
        date: "2025-03-05T09:15:00Z",
        price: 0.55,
        currency: "ETH"
      }
    ]
  }
];

// Mock filter categories
export interface FilterCategory {
  id: string;
  name: string;
  options: FilterOption[];
}

export interface FilterOption {
  id: string;
  name: string;
  count?: number; // How many items match this filter option
}

export const filterCategories: FilterCategory[] = [
  {
    id: "collection",
    name: "Collections",
    options: collections.map(collection => ({
      id: collection.id,
      name: collection.name,
      count: nfts.filter(nft => nft.collection.id === collection.id).length
    }))
  },
  {
    id: "price",
    name: "Price Range",
    options: [
      { id: "under-0.5", name: "Under 0.5 ETH", count: nfts.filter(nft => nft.price < 0.5).length },
      { id: "0.5-1", name: "0.5 - 1 ETH", count: nfts.filter(nft => nft.price >= 0.5 && nft.price <= 1).length },
      { id: "1-2", name: "1 - 2 ETH", count: nfts.filter(nft => nft.price > 1 && nft.price <= 2).length },
      { id: "above-2", name: "Above 2 ETH", count: nfts.filter(nft => nft.price > 2).length }
    ]
  },
  {
    id: "blockchain",
    name: "Blockchain",
    options: [
      { id: "ethereum", name: "Ethereum", count: nfts.filter(nft => nft.blockchain === "Ethereum").length },
      { id: "polygon", name: "Polygon", count: nfts.filter(nft => nft.blockchain === "Polygon").length },
      { id: "solana", name: "Solana", count: 0 },
      { id: "binance", name: "Binance Smart Chain", count: 0 }
    ]
  },
  {
    id: "status",
    name: "Status",
    options: [
      { id: "buy-now", name: "Buy Now", count: nfts.filter(nft => !nft.auction).length },
      { id: "on-auction", name: "On Auction", count: nfts.filter(nft => nft.auction).length },
    ]
  }
];

export const sortOptions = [
  { id: "recently-listed", name: "Recently Listed" },
  { id: "price-high-low", name: "Price: High to Low" },
  { id: "price-low-high", name: "Price: Low to High" },
  { id: "most-liked", name: "Most Liked" },
  { id: "most-viewed", name: "Most Viewed" },
  { id: "ending-soon", name: "Ending Soon" }
];

// Mock service functions
export const getNFTs = async (filters: any = {}, sort: string = "recently-listed", page: number = 1) => {
  console.log('Fetching NFTs with filters:', filters, 'sort:', sort, 'page:', page);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredNFTs = [...nfts];
  
  // Apply filters
  if (filters.collections && filters.collections.length > 0) {
    filteredNFTs = filteredNFTs.filter(nft => filters.collections.includes(nft.collection.id));
  }
  
  if (filters.blockchain && filters.blockchain.length > 0) {
    filteredNFTs = filteredNFTs.filter(nft => filters.blockchain.includes(nft.blockchain.toLowerCase()));
  }
  
  if (filters.status) {
    if (filters.status.includes('buy-now') && !filters.status.includes('on-auction')) {
      filteredNFTs = filteredNFTs.filter(nft => !nft.auction);
    } else if (!filters.status.includes('buy-now') && filters.status.includes('on-auction')) {
      filteredNFTs = filteredNFTs.filter(nft => nft.auction);
    }
  }
  
  if (filters.price) {
    if (filters.price.includes('under-0.5')) {
      filteredNFTs = filteredNFTs.filter(nft => nft.price < 0.5);
    } else if (filters.price.includes('0.5-1')) {
      filteredNFTs = filteredNFTs.filter(nft => nft.price >= 0.5 && nft.price <= 1);
    } else if (filters.price.includes('1-2')) {
      filteredNFTs = filteredNFTs.filter(nft => nft.price > 1 && nft.price <= 2);
    } else if (filters.price.includes('above-2')) {
      filteredNFTs = filteredNFTs.filter(nft => nft.price > 2);
    }
  }
  
  // Apply sorting
  switch (sort) {
    case 'price-high-low':
      filteredNFTs.sort((a, b) => b.price - a.price);
      break;
      
    case 'price-low-high':
      filteredNFTs.sort((a, b) => a.price - b.price);
      break;
      
    case 'most-liked':
      filteredNFTs.sort((a, b) => b.likes - a.likes);
      break;
      
    case 'most-viewed':
      filteredNFTs.sort((a, b) => b.views - a.views);
      break;
      
    case 'ending-soon':
      const now = new Date().getTime();
      filteredNFTs.sort((a, b) => {
        // Only consider auction items with endTime
        if (a.auction && b.auction && a.endTime && b.endTime) {
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        } else if (a.auction && a.endTime) {
          return -1; // a comes first
        } else if (b.auction && b.endTime) {
          return 1; // b comes first
        }
        return 0;
      });
      break;
      
    case 'recently-listed':
    default:
      filteredNFTs.sort((a, b) => new Date(b.listed).getTime() - new Date(a.listed).getTime());
      break;
  }
  
  // Pagination
  const itemsPerPage = 6;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNFTs = filteredNFTs.slice(startIndex, endIndex);
  
  return {
    nfts: paginatedNFTs,
    totalPages: Math.ceil(filteredNFTs.length / itemsPerPage),
    total: filteredNFTs.length
  };
};

export const getTrendingCollections = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return collections.map(collection => {
    const collectionNFTs = nfts.filter(nft => nft.collection.id === collection.id);
    return {
      ...collection,
      itemCount: collectionNFTs.length,
      floorPrice: collection.floorPrice,
      volumeTraded: Math.floor(Math.random() * 100) + 20,
      creator: creators.find(creator => 
        collectionNFTs.length > 0 && creator.id === collectionNFTs[0].creator.id
      )
    };
  }).sort(() => Math.random() - 0.5);
};

export const getNFTDetails = async (id: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nft = nfts.find(nft => nft.id === id);
  
  if (!nft) {
    throw new Error('NFT not found');
  }
  
  return nft;
};
